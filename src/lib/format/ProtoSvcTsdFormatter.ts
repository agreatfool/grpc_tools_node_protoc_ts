import {FileDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {ExportMap} from "../ExportMap";
import {Utility} from "../Utility";
import {TplEngine} from "../TplEngine";
import {WellKnownTypesMap} from "../WellKnown";
import {DependencyFilter} from "../DependencyFilter";
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
        type: string; // "ClientUnaryCall" || "ClientWritableStream" || "ClientReadableStream" || "ClientDuplexStream"
    }

    export const defaultServiceMethodType = JSON.stringify({
        packageName: "",
        serviceName: "",
        methodName: "",
        requestStream: false,
        responseStream: false,
        requestTypeName: "",
        responseTypeName: "",
        type: "",
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

        // Need to import the non-service file that was generated for this .proto file
        imports.push(`import * as grpc from "grpc";`);
        let asPseudoNamespace = Utility.filePathToPseudoNamespace(fileName);
        imports.push(`import * as ${asPseudoNamespace} from "${upToRoot}${Utility.filePathFromProtoWithoutExt(fileName)}";`);

        descriptor.getDependencyList().forEach((dependency: string) => {
            if (DependencyFilter.indexOf(dependency) !== -1) {
                return; // filtered
            }
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

                if (!methodData.requestStream && !methodData.responseStream) {
                    methodData.type = 'ClientUnaryCall';
                } else if (methodData.requestStream && !methodData.responseStream) {
                    methodData.type = 'ClientWritableStream';
                } else if (!methodData.requestStream && methodData.responseStream) {
                    methodData.type = 'ClientReadableStream';
                } else if (methodData.requestStream && methodData.responseStream) {
                    methodData.type = 'ClientDuplexStream';
                }

                serviceData.methods.push(methodData);
            });

            services.push(serviceData);
        });

        TplEngine.registerHelper('lcFirst', function (str) {
            return str.charAt(0).toLowerCase() + str.slice(1);
        });

        return TplEngine.render('svc_tsd', {
            packageName: packageName,
            fileName: fileName,
            imports: imports,
            services: services,
        });
    }

}