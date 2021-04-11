"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TplEngine = void 0;
const LibFs = require("fs");
const LibPath = require("path");
const handlebars = require("handlebars");
handlebars.registerHelper("is", function (arg1, arg2, options) {
    /* tslint:disable:triple-equals */
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    /* tslint:disable:triple-equals */
});
handlebars.registerHelper("eq", function (arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper("curlyLeft", () => {
    return "{";
});
handlebars.registerHelper("curlyRight", () => {
    return "}";
});
handlebars.registerHelper("render", (templateName, params) => {
    return TplEngine.render(templateName, params);
});
const TPL_BASE_PATH = LibPath.join(__dirname, "template");
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