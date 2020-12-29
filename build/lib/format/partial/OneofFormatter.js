"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneofFormatter = void 0;
const Utility_1 = require("../../Utility");
var OneofFormatter;
(function (OneofFormatter) {
    function format(oneofDecl, oneofFields, indent) {
        const oneofName = Utility_1.Utility.oneOfName(oneofDecl.getName());
        const oneofNameUpper = oneofDecl.getName().toUpperCase();
        const fields = {};
        oneofFields.forEach((field) => {
            fields[field.getName().toUpperCase()] = field.getNumber();
        });
        return {
            indent,
            oneofName,
            oneofNameUpper,
            fields,
        };
    }
    OneofFormatter.format = format;
})(OneofFormatter = exports.OneofFormatter || (exports.OneofFormatter = {}));
//# sourceMappingURL=OneofFormatter.js.map