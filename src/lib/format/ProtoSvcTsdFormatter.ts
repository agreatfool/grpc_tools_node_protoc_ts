import {FileDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {ExportMap} from "../ExportMap";
import {Utility} from "../Utility";
import {TplEngine} from "../TplEngine";
import {WellKnownTypesMap} from "../WellKnown";
import {FieldTypesFormatter, MESSAGE_TYPE} from "./partial/FieldTypesFormatter";

export namespace ProtoSvcTsdFormatter {

    export interface ServiceType {
        serviceName: string;
        methods: Array<ServiceMethodType>;
    }

    export const defaultServiceType = JSON.stringify({
        serviceName: "",
        methods: [],
    } as ServiceType);

    export interface ServiceMethodType {
        packageName: string;
        serviceName: string;
        methodName: string;
        requestStream: boolean;
        responseStream: boolean;
        requestTypeName: string;
        responseTypeName: string;
    }

    export const defaultServiceMethodType = JSON.stringify({
        packageName: "",
        serviceName: "",
        methodName: "",
        requestStream: false,
        responseStream: false,
        requestTypeName: "",
        responseTypeName: "",
    } as ServiceMethodType);

    export function format(descriptor: FileDescriptorProto, exportMap: ExportMap): string {
        if (descriptor.getServiceList().length === 0) {
            return '';
        }

        let fileName = descriptor.getName();
        let packageName = descriptor.getPackage();
        let upToRoot = Utility.getPathToRoot(fileName);

        let imports: Array<string> = [];
        let services: Array<ServiceType> = [];
        let serviceTypeNames: Array<string> = [];

        // Need to import the non-service file that was generated for this .proto file
        imports.push(`import * as grpc from "grpc";`);
        let asPseudoNamespace = Utility.filePathToPseudoNamespace(fileName);
        imports.push(`import * as ${asPseudoNamespace} from "${upToRoot}${Utility.filePathFromProtoWithoutExt(fileName)}";`);

        descriptor.getDependencyList().forEach((dependency: string) => {
            let pseudoNamespace = Utility.filePathToPseudoNamespace(dependency);
            if (dependency in WellKnownTypesMap) {
                imports.push(`import * as ${pseudoNamespace} from "${WellKnownTypesMap[dependency]}";`);
            } else {
                let filePath = Utility.filePathFromProtoWithoutExt(dependency);
                imports.push(`import * as ${pseudoNamespace} from "${upToRoot + filePath}";`);
            }
        });

        descriptor.getServiceList().forEach(service => {
            let serviceData = JSON.parse(defaultServiceType) as ServiceType;

            serviceData.serviceName = service.getName();

            service.getMethodList().forEach(method => {
                let methodData = JSON.parse(defaultServiceMethodType) as ServiceMethodType;

                methodData.packageName = packageName;
                methodData.serviceName = serviceData.serviceName;
                methodData.methodName = method.getName();
                methodData.requestStream = method.getClientStreaming();
                methodData.responseStream = method.getServerStreaming();
                methodData.requestTypeName = FieldTypesFormatter.getFieldType(MESSAGE_TYPE, method.getInputType().slice(1), "", exportMap);
                methodData.responseTypeName = FieldTypesFormatter.getFieldType(MESSAGE_TYPE, method.getOutputType().slice(1), "", exportMap);

                if (serviceTypeNames.indexOf(methodData.requestTypeName) === -1) {
                    serviceTypeNames.push(methodData.requestTypeName);
                }
                if (serviceTypeNames.indexOf(methodData.responseTypeName) === -1) {
                    serviceTypeNames.push(methodData.responseTypeName);
                }

                serviceData.methods.push(methodData);
            });

            services.push(serviceData);
        });

        TplEngine.registerHelper('dotToUnderline', function (str) {
            return str.replace(/\./g, '_');
        });

        return TplEngine.render('svc_tsd', {
            packageName: packageName,
            fileName: fileName,
            imports: imports,
            services: services,
            serviceTypeNames: serviceTypeNames
        });
    }

}