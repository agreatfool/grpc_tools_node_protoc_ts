"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LibFs = require("fs");
const LibPath = require("path");
const handlebars = require("handlebars");
const helpers = require("handlebars-helpers");
helpers({ handlebars: handlebars });
handlebars.registerHelper('curlyLeft', function () {
    return '{';
});
handlebars.registerHelper('curlyRight', function () {
    return '}';
});
const TPL_BASE_PATH = LibPath.join(__dirname, 'template');
var TplEngine;
(function (TplEngine) {
    function registerHelper(name, fn, inverse) {
        handlebars.registerHelper(name, fn, inverse);
    }
    TplEngine.registerHelper = registerHelper;
    function render(templateName, params) {
        return compile(templateName)(params);
    }
    TplEngine.render = render;
    function compile(templateName) {
        return handlebars.compile(LibFs.readFileSync(`${LibPath.join(TPL_BASE_PATH, templateName)}.hbs`).toString());
    }
    TplEngine.compile = compile;
})(TplEngine = exports.TplEngine || (exports.TplEngine = {}));
//# sourceMappingURL=TplEngine.js.map