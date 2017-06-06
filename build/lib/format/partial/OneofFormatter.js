"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TplEngine_1 = require("../../TplEngine");
const Utility_1 = require("../../Utility");
var OneofFormatter;
(function (OneofFormatter) {
    function format(oneofDecl, oneofFields, indentLevel) {
        let oneofName = Utility_1.Utility.oneOfName(oneofDecl.getName());
        let oneofNameUpper = oneofName.toUpperCase();
        let fields = {};
        oneofFields.forEach(field => {
            fields[field.getName().toUpperCase()] = field.getNumber();
        });
        return TplEngine_1.TplEngine.render('partial/oneof', {
            indent: Utility_1.Utility.generateIndent(indentLevel),
            oneofName: oneofName,
            oneofNameUpper: oneofNameUpper,
            fields: fields,
        });
    }
    OneofFormatter.format = format;
})(OneofFormatter = exports.OneofFormatter || (exports.OneofFormatter = {}));
//# sourceMappingURL=OneofFormatter.js.map