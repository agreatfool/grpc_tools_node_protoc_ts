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
handlebars.registerHelper('render', function (templateName, params) {
    return TplEngine.render(templateName, params);
});
const TPL_BASE_PATH = LibPath.join(__dirname, 'template');
const templateCache = {};
var TplEngine;
(function (TplEngine) {
    function registerHelper(name, fn) {
        handlebars.registerHelper(name, fn);
    }
    TplEngine.registerHelper = registerHelper;
    function render(templateName, params) {
        const template = templateCache[templateName] ||
            (templateCache[templateName] = compile(templateName));
        return template(params);
    }
    TplEngine.render = render;
    function compile(templateName) {
        return handlebars.compile(LibFs.readFileSync(`${LibPath.join(TPL_BASE_PATH, templateName)}.hbs`).toString());
    }
    TplEngine.compile = compile;
})(TplEngine = exports.TplEngine || (exports.TplEngine = {}));
//# sourceMappingURL=TplEngine.js.map