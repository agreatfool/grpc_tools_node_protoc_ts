import * as LibFs from "fs";
import * as LibPath from "path";
import * as handlebars from "handlebars";
import * as helpers from "handlebars-helpers";

helpers({handlebars: handlebars});
handlebars.registerHelper('curlyLeft', function () {
    return '{';
});
handlebars.registerHelper('curlyRight', function () {
    return '}';
});

const TPL_BASE_PATH = LibPath.join(__dirname, 'template');

export namespace TplEngine {

    export function registerHelper(name: string, fn: Function, inverse?: boolean): void {
        handlebars.registerHelper(name, fn, inverse);
    }

    export function render(templateName: string, params: { [key: string]: any }): string {
        return compile(templateName)(params);
    }

    export function compile(templateName: string): HandlebarsTemplateDelegate {
        return handlebars.compile(
            LibFs.readFileSync(`${LibPath.join(TPL_BASE_PATH, templateName)}.hbs`).toString()
        );
    }

}