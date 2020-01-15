"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utility_1 = require("../../Utility");
var OneofFormatter;
(function (OneofFormatter) {
    function format(oneofDecl, oneofFields, indent) {
        let oneofName = Utility_1.Utility.oneOfName(oneofDecl.getName());
        let oneofNameUpper = oneofDecl.getName().toUpperCase();
        let fields = {};
        oneofFields.forEach(field => {
            fields[field.getName().toUpperCase()] = field.getNumber();
        });
        return {
            indent,
            oneofName: oneofName,
            oneofNameUpper: oneofNameUpper,
            fields: fields,
        };
    }
    OneofFormatter.format = format;
})(OneofFormatter = exports.OneofFormatter || (exports.OneofFormatter = {}));
//# sourceMappingURL=OneofFormatter.js.map