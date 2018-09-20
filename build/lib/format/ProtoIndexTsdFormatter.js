"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TplEngine_1 = require("../TplEngine");
var ProtoIndexTsdFormatter;
(function (ProtoIndexTsdFormatter) {
    function format(files) {
        let exports = files.map(file => `export * from "./${file}";`);
        return TplEngine_1.TplEngine.render('index_tsd', {
            exports,
        });
    }
    ProtoIndexTsdFormatter.format = format;
})(ProtoIndexTsdFormatter = exports.ProtoIndexTsdFormatter || (exports.ProtoIndexTsdFormatter = {}));
//# sourceMappingURL=ProtoIndexFormatter.js.map
