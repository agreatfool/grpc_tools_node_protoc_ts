"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utility_1 = require("../Utility");
const WellKnown_1 = require("../WellKnown");
const MessageFormatter_1 = require("./partial/MessageFormatter");
const ExtensionFormatter_1 = require("./partial/ExtensionFormatter");
const EnumFormatter_1 = require("./partial/EnumFormatter");
const DependencyFilter_1 = require("../DependencyFilter");
var ProtoMsgTsdFormatter;
(function (ProtoMsgTsdFormatter) {
    function format(descriptor, exportMap) {
        let fileName = descriptor.getName();
        let packageName = descriptor.getPackage();
        let imports = [];
        let messages = [];
        let extensions = [];
        let enums = [];
        let upToRoot = Utility_1.Utility.getPathToRoot(fileName);
        imports.push(`import * as jspb from "google-protobuf";`);
        descriptor.getDependencyList().forEach((dependency) => {
            if (DependencyFilter_1.DependencyFilter.indexOf(dependency) !== -1) {
                return; // filtered
            }
            let pseudoNamespace = Utility_1.Utility.filePathToPseudoNamespace(dependency);
            if (dependency in WellKnown_1.WellKnownTypesMap) {
                imports.push(`import * as ${pseudoNamespace} from "${WellKnown_1.WellKnownTypesMap[dependency]}";`);
            }
            else {
                let filePath = Utility_1.Utility.filePathFromProtoWithoutExt(dependency);
                imports.push(`import * as ${pseudoNamespace} from "${upToRoot}${filePath}";`);
            }
        });
        descriptor.getMessageTypeList().forEach(enumType => {
            messages.push(MessageFormatter_1.MessageFormatter.format(fileName, exportMap, enumType, "", descriptor));
        });
        descriptor.getExtensionList().forEach(extension => {
            extensions.push(ExtensionFormatter_1.ExtensionFormatter.format(fileName, exportMap, extension, ""));
        });
        descriptor.getEnumTypeList().forEach(enumType => {
            enums.push(EnumFormatter_1.EnumFormatter.format(enumType, ""));
        });
        return {
            packageName: packageName,
            fileName: fileName,
            imports: imports,
            messages: messages,
            extensions: extensions,
            enums: enums,
        };
    }
    ProtoMsgTsdFormatter.format = format;
})(ProtoMsgTsdFormatter = exports.ProtoMsgTsdFormatter || (exports.ProtoMsgTsdFormatter = {}));
//# sourceMappingURL=ProtoMsgTsdFormatter.js.map