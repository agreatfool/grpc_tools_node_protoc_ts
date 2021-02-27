"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtoMsgTsdFormatter = void 0;
const Utility_1 = require("../Utility");
const WellKnown_1 = require("../WellKnown");
const MessageFormatter_1 = require("./partial/MessageFormatter");
const ExtensionFormatter_1 = require("./partial/ExtensionFormatter");
const EnumFormatter_1 = require("./partial/EnumFormatter");
const DependencyFilter_1 = require("../DependencyFilter");
const TplEngine_1 = require("../TplEngine");
var ProtoMsgTsdFormatter;
(function (ProtoMsgTsdFormatter) {
    function format(descriptor, exportMap) {
        var _a, _b;
        const fileName = descriptor.getName();
        const packageName = descriptor.getPackage();
        const imports = [];
        const messages = [];
        const extensions = [];
        const enums = [];
        const wellKnownDeclarations = [];
        const upToRoot = Utility_1.Utility.getPathToRoot(fileName);
        imports.push(`import * as jspb from "google-protobuf";`);
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
                imports.push(`import * as ${pseudoNamespace} from "${upToRoot}${filePath}";`);
            }
        });
        descriptor.getMessageTypeList().forEach((enumType) => {
            var _a;
            messages.push(MessageFormatter_1.MessageFormatter.format(fileName, exportMap, enumType, "", descriptor, (_a = WellKnown_1.WellKnownExtensionsMap[fileName]) === null || _a === void 0 ? void 0 : _a.extensions));
        });
        descriptor.getExtensionList().forEach((extension) => {
            extensions.push(ExtensionFormatter_1.ExtensionFormatter.format(fileName, exportMap, extension, ""));
        });
        descriptor.getEnumTypeList().forEach((enumType) => {
            enums.push(EnumFormatter_1.EnumFormatter.format(enumType, ""));
        });
        TplEngine_1.TplEngine.registerHelper("formatName", (str) => {
            return Utility_1.Utility.formatOccupiedName(str);
        });
        if (fileName in WellKnown_1.WellKnownExtensionsMap) {
            (_b = (_a = WellKnown_1.WellKnownExtensionsMap[fileName]) === null || _a === void 0 ? void 0 : _a.declarations) === null || _b === void 0 ? void 0 : _b.forEach(declaration => {
                wellKnownDeclarations.push(`\n${declaration}`);
            });
        }
        return {
            packageName,
            fileName,
            imports,
            messages,
            extensions,
            enums,
            wellKnownDeclarations,
        };
    }
    ProtoMsgTsdFormatter.format = format;
})(ProtoMsgTsdFormatter = exports.ProtoMsgTsdFormatter || (exports.ProtoMsgTsdFormatter = {}));
//# sourceMappingURL=ProtoMsgTsdFormatter.js.map