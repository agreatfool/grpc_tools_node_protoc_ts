"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumFormatter;
(function (EnumFormatter) {
    function format(enumDescriptor, indent) {
        let enumName = enumDescriptor.getName();
        let values = {};
        enumDescriptor.getValueList().forEach(value => {
            values[value.getName().toUpperCase()] = value.getNumber();
        });
        return {
            indent,
            enumName: enumName,
            values: values,
        };
    }
    EnumFormatter.format = format;
})(EnumFormatter = exports.EnumFormatter || (exports.EnumFormatter = {}));
//# sourceMappingURL=EnumFormatter.js.map