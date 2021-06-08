"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtoSvcTsdFormatter = void 0;
const Utility_1 = require("../Utility");
const TplEngine_1 = require("../TplEngine");
const WellKnown_1 = require("../WellKnown");
const DependencyFilter_1 = require("../DependencyFilter");
const FieldTypesFormatter_1 = require("./partial/FieldTypesFormatter");
var ProtoSvcTsdFormatter;
(function (ProtoSvcTsdFormatter) {
    ProtoSvcTsdFormatter.defaultServiceType = JSON.stringify({
        serviceName: "",
        methods: [],
    });
    ProtoSvcTsdFormatter.defaultServiceMethodType = JSON.stringify({
        packageName: "",
        serviceName: "",
        methodName: "",
        requestStream: false,
        responseStream: false,
        requestTypeName: "",
        responseTypeName: "",
        type: "",
    });
    function format(descriptor, exportMap, isGrpcJs) {
        if (descriptor.getServiceList().length === 0) {
            return null;
        }
        const fileName = descriptor.getName();
        const packageName = descriptor.getPackage();
        const upToRoot = Utility_1.Utility.getPathToRoot(fileName);
        const imports = [];
        const services = [];
        // Need to import the non-service file that was generated for this .proto file
        if (isGrpcJs) {
            imports.push(`import * as grpc from "@grpc/grpc-js";`);
        }
        else {
            imports.push(`import * as grpc from "grpc";`);
        }
        const asPseudoNamespace = Utility_1.Utility.filePathToPseudoNamespace(fileName);
        imports.push(`import * as ${asPseudoNamespace} from "${upToRoot}${Utility_1.Utility.filePathFromProtoWithoutExt(fileName)}";`);
        descriptor.getDependencyList().forEach((dependency) => {
            if (DependencyFilter_1.DependencyFilter.indexOf(dependency) !== -1) {
                return; // filtered
            }
            const pseudoNamespace = Utility_1.Utility.filePathToPseudoNamespace(dependency);
            if (dependency in WellKnown_1.WellKnownTypesMap) {
                imports.push(`import * as ${pseudoNamespace} from "${WellKnown_1.WellKnownTypesMap[dependency]}";`);
            }
            else {
                const filePath = Utility_1.Utility.filePathFromProtoWithoutExt(dependency);
                imports.push(`import * as ${pseudoNamespace} from "${upToRoot + filePath}";`);
            }
        });
        descriptor.getServiceList().forEach((service) => {
            const serviceData = JSON.parse(ProtoSvcTsdFormatter.defaultServiceType);
            serviceData.serviceName = service.getName();
            service.getMethodList().forEach((method) => {
                const methodData = JSON.parse(ProtoSvcTsdFormatter.defaultServiceMethodType);
                methodData.packageName = packageName;
                methodData.serviceName = serviceData.serviceName;
                methodData.methodName = method.getName();
                methodData.requestStream = method.getClientStreaming();
                methodData.responseStream = method.getServerStreaming();
                methodData.requestTypeName = FieldTypesFormatter_1.FieldTypesFormatter.getFieldType(FieldTypesFormatter_1.MESSAGE_TYPE, method.getInputType().slice(1), "", exportMap);
                methodData.responseTypeName = FieldTypesFormatter_1.FieldTypesFormatter.getFieldType(FieldTypesFormatter_1.MESSAGE_TYPE, method.getOutputType().slice(1), "", exportMap);
                if (!methodData.requestStream && !methodData.responseStream) {
                    methodData.type = "ClientUnaryCall";
                }
                else if (methodData.requestStream && !methodData.responseStream) {
                    methodData.type = "ClientWritableStream";
                }
                else if (!methodData.requestStream && methodData.responseStream) {
                    methodData.type = "ClientReadableStream";
                }
                else if (methodData.requestStream && methodData.responseStream) {
                    methodData.type = "ClientDuplexStream";
                }
                serviceData.methods.push(methodData);
            });
            services.push(serviceData);
        });
        TplEngine_1.TplEngine.registerHelper("lcFirst", (str) => {
            return str.charAt(0).toLowerCase() + str.slice(1);
        });
        TplEngine_1.TplEngine.registerHelper("fetchIsGrpcJs", () => {
            return isGrpcJs;
        });
        return {
            packageName,
            fileName,
            imports,
            services,
        };
    }
    ProtoSvcTsdFormatter.format = format;
})(ProtoSvcTsdFormatter = exports.ProtoSvcTsdFormatter || (exports.ProtoSvcTsdFormatter = {}));
//# sourceMappingURL=ProtoSvcTsdFormatter.js.map