"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TplEngine_1 = require("../TplEngine");
var ProtoIndexFormatter;
(function (ProtoIndexFormatter) {
    function format(exports, template) {
        return TplEngine_1.TplEngine.render(template, {
            exports,
        });
    }
    ProtoIndexFormatter.format = format;
})(ProtoIndexFormatter = exports.ProtoIndexFormatter || (exports.ProtoIndexFormatter = {}));
//# sourceMappingURL=ProtoIndexFormatter.js.map