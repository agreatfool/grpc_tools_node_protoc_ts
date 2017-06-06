"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utility_1 = require("../Utility");
const TplEngine_1 = require("../TplEngine");
const WellKnown_1 = require("../WellKnown");
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
    });
    function format(descriptor, exportMap) {
        if (descriptor.getServiceList().length === 0) {
            return '';
        }
        let fileName = descriptor.getName();
        let packageName = descriptor.getPackage();
        let upToRoot = Utility_1.Utility.getPathToRoot(fileName);
        let imports = [];
        let services = [];
        let serviceTypeNames = [];
        // Need to import the non-service file that was generated for this .proto file
        imports.push(`import * as grpc from "grpc";`);
        let asPseudoNamespace = Utility_1.Utility.filePathToPseudoNamespace(fileName);
        imports.push(`import * as ${asPseudoNamespace} from "${upToRoot}${Utility_1.Utility.filePathFromProtoWithoutExt(fileName)}";`);
        descriptor.getDependencyList().forEach((dependency) => {
            let pseudoNamespace = Utility_1.Utility.filePathToPseudoNamespace(dependency);
            if (dependency in WellKnown_1.WellKnownTypesMap) {
                imports.push(`import * as ${pseudoNamespace} from "${WellKnown_1.WellKnownTypesMap[dependency]}";`);
            }
            else {
                let filePath = Utility_1.Utility.filePathFromProtoWithoutExt(dependency);
                imports.push(`import * as ${pseudoNamespace} from "${upToRoot + filePath}";`);
            }
        });
        descriptor.getServiceList().forEach(service => {
            let serviceData = JSON.parse(ProtoSvcTsdFormatter.defaultServiceType);
            serviceData.serviceName = service.getName();
            service.getMethodList().forEach(method => {
                let methodData = JSON.parse(ProtoSvcTsdFormatter.defaultServiceMethodType);
                methodData.packageName = packageName;
                methodData.serviceName = serviceData.serviceName;
                methodData.methodName = method.getName();
                methodData.requestStream = method.getClientStreaming();
                methodData.responseStream = method.getServerStreaming();
                methodData.requestTypeName = FieldTypesFormatter_1.FieldTypesFormatter.getFieldType(FieldTypesFormatter_1.MESSAGE_TYPE, method.getInputType().slice(1), "", exportMap);
                methodData.responseTypeName = FieldTypesFormatter_1.FieldTypesFormatter.getFieldType(FieldTypesFormatter_1.MESSAGE_TYPE, method.getOutputType().slice(1), "", exportMap);
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
        TplEngine_1.TplEngine.registerHelper('dotToUnderline', function (str) {
            return str.replace(/\./g, '_');
        });
        return TplEngine_1.TplEngine.render('svc_tsd', {
            packageName: packageName,
            fileName: fileName,
            imports: imports,
            services: services,
            serviceTypeNames: serviceTypeNames
        });
    }
    ProtoSvcTsdFormatter.format = format;
})(ProtoSvcTsdFormatter = exports.ProtoSvcTsdFormatter || (exports.ProtoSvcTsdFormatter = {}));
//# sourceMappingURL=ProtoSvcTsdFormatter.js.map