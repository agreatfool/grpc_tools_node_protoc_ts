import {FileDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {ExportMap} from "../ExportMap";
import {Utility} from "../Utility";
import {TplEngine} from "../TplEngine";
import {WellKnownTypesMap} from "../WellKnown";
import {DependencyFilter} from "../DependencyFilter";
import {FieldTypesFormatter, MESSAGE_TYPE} from "./partial/FieldTypesFormatter";

export namespace ProtoSvcTsdFormatter {

    export interface IServiceType {
        serviceName: string;
        methods: IServiceMethodType[];
    }

    export const defaultServiceType = JSON.stringify({
        serviceName: "",
        methods: [],
    } as IServiceType);

    export interface IServiceMethodType {
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
    } as IServiceMethodType);

    export interface IProtoSvcTsdModel {
        packageName: string;
        fileName: string;
        imports: string[];
        services: IServiceType[];
    }

    export function format(descriptor: FileDescriptorProto, exportMap: ExportMap, isGrpcJs: boolean): IProtoSvcTsdModel {
        if (descriptor.getServiceList().length === 0) {
            return null;
        }

        const fileName = descriptor.getName();
        const packageName = descriptor.getPackage();
        const upToRoot = Utility.getPathToRoot(fileName);

        const imports: string[] = [];
        const services: IServiceType[] = [];

        // Need to import the non-service file that was generated for this .proto file
        if (isGrpcJs) {
            imports.push(`import * as grpc from "@grpc/grpc-js";`);
        } else {
            imports.push(`import * as grpc from "grpc";`);
        }
        const asPseudoNamespace = Utility.filePathToPseudoNamespace(fileName);
        imports.push(`import * as ${asPseudoNamespace} from "${upToRoot}${Utility.filePathFromProtoWithoutExt(fileName)}";`);

        descriptor.getDependencyList().forEach((dependency: string) => {
            if (DependencyFilter.indexOf(dependency) !== -1) {
                return; // filtered
            }
            const pseudoNamespace = Utility.filePathToPseudoNamespace(dependency);
            if (dependency in WellKnownTypesMap) {
                imports.push(`import * as ${pseudoNamespace} from "${WellKnownTypesMap[dependency]}";`);
            } else {
                const filePath = Utility.filePathFromProtoWithoutExt(dependency);
                imports.push(`import * as ${pseudoNamespace} from "${upToRoot + filePath}";`);
            }
        });

        descriptor.getServiceList().forEach((service) => {
            const serviceData = JSON.parse(defaultServiceType) as IServiceType;

            serviceData.serviceName = service.getName();

            service.getMethodList().forEach((method) => {
                const methodData = JSON.parse(defaultServiceMethodType) as IServiceMethodType;

                methodData.packageName = packageName;
                methodData.serviceName = serviceData.serviceName;
                methodData.methodName = method.getName();
                methodData.requestStream = method.getClientStreaming();
                methodData.responseStream = method.getServerStreaming();
                methodData.requestTypeName = FieldTypesFormatter.getFieldType(MESSAGE_TYPE, method.getInputType().slice(1), "", exportMap);
                methodData.responseTypeName = FieldTypesFormatter.getFieldType(MESSAGE_TYPE, method.getOutputType().slice(1), "", exportMap);

                if (!methodData.requestStream && !methodData.responseStream) {
                    methodData.type = "ClientUnaryCall";
                } else if (methodData.requestStream && !methodData.responseStream) {
                    methodData.type = "ClientWritableStream";
                } else if (!methodData.requestStream && methodData.responseStream) {
                    methodData.type = "ClientReadableStream";
                } else if (methodData.requestStream && methodData.responseStream) {
                    methodData.type = "ClientDuplexStream";
                }

                serviceData.methods.push(methodData);
            });

            services.push(serviceData);
        });

        TplEngine.registerHelper("lcFirst", (str) => {
            return str.charAt(0).toLowerCase() + str.slice(1);
        });

        TplEngine.registerHelper("fetchIsGrpcJs", () => {
            return isGrpcJs;
        });

        return {
            packageName,
            fileName,
            imports,
            services,
        };
    }

}
