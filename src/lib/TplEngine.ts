import * as LibFs from "fs";
import * as LibPath from "path";
import * as handlebars from "handlebars";
import * as helpers from "handlebars-helpers";

helpers({handlebars});
handlebars.registerHelper("curlyLeft", () => {
    return "{";
});
handlebars.registerHelper("curlyRight", () => {
    return "}";
});
handlebars.registerHelper("render", (templateName: string, params: { [key: string]: any }) => {
    return TplEngine.render(templateName, params);
});

const TPL_BASE_PATH = LibPath.join(__dirname, "template");

const templateCache = {};

export namespace TplEngine {

    export function registerHelper(name: string, fn: handlebars.HelperDelegate): void {
        handlebars.registerHelper(name, fn);
    }

    export function render(templateName: string, params: { [key: string]: any }): string {
        const template = templateCache[templateName] ||
            (templateCache[templateName] = compile(templateName));
        return template(params);
    }

    export function compile(templateName: string): HandlebarsTemplateDelegate {
        return handlebars.compile(
            LibFs.readFileSync(`${LibPath.join(TPL_BASE_PATH, templateName)}.hbs`).toString()
        );
    }

}
