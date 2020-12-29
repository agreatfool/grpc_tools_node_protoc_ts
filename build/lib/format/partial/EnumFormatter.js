"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumFormatter = void 0;
var EnumFormatter;
(function (EnumFormatter) {
    function format(enumDescriptor, indent) {
        const enumName = enumDescriptor.getName();
        const values = {};
        enumDescriptor.getValueList().forEach((value) => {
            values[value.getName().toUpperCase()] = value.getNumber();
        });
        return {
            indent,
            enumName,
            values,
        };
    }
    EnumFormatter.format = format;
})(EnumFormatter = exports.EnumFormatter || (exports.EnumFormatter = {}));
//# sourceMappingURL=EnumFormatter.js.map