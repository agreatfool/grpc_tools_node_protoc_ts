"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TplEngine_1 = require("../../TplEngine");
const Utility_1 = require("../../Utility");
var EnumFormatter;
(function (EnumFormatter) {
    function format(enumDescriptor, indentLevel) {
        let enumName = enumDescriptor.getName();
        let values = {};
        enumDescriptor.getValueList().forEach(value => {
            values[value.getName().toUpperCase()] = value.getNumber();
        });
        return TplEngine_1.TplEngine.render('partial/enum', {
            indent: Utility_1.Utility.generateIndent(indentLevel),
            enumName: enumName,
            values: values,
        });
    }
    EnumFormatter.format = format;
})(EnumFormatter = exports.EnumFormatter || (exports.EnumFormatter = {}));
//# sourceMappingURL=EnumFormatter.js.map