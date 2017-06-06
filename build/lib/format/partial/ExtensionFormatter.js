"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TplEngine_1 = require("../../TplEngine");
const Utility_1 = require("../../Utility");
const FieldTypesFormatter_1 = require("./FieldTypesFormatter");
var ExtensionFormatter;
(function (ExtensionFormatter) {
    function format(fileName, exportMap, extension, indentLevel) {
        let extensionName = Utility_1.Utility.snakeToCamel(extension.getName());
        let fieldType = FieldTypesFormatter_1.FieldTypesFormatter.getFieldType(extension.getType(), extension.getTypeName().slice(1), fileName, exportMap);
        return TplEngine_1.TplEngine.render('partial/extension', {
            indent: Utility_1.Utility.generateIndent(indentLevel),
            extensionName: extensionName,
            fieldType: fieldType,
        });
    }
    ExtensionFormatter.format = format;
})(ExtensionFormatter = exports.ExtensionFormatter || (exports.ExtensionFormatter = {}));
//# sourceMappingURL=ExtensionFormatter.js.map