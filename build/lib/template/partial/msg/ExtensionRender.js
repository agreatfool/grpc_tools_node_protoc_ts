"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionRender = void 0;
const Engine_1 = require("../../engine/Engine");
const TPL = `

#INDENT#export const #EXT_NAME#: jspb.ExtensionFieldInfo<#FIELD_TYPE#>;`;
class ExtensionRender extends Engine_1.TplEngine {
    constructor(data) {
        super(data);
        this.recognized = this.data;
    }
    render() {
        return TPL
            .replace(/#INDENT#/g, this.recognized.indent)
            .replace("#EXT_NAME#", this.recognized.extensionName)
            .replace("#FIELD_TYPE#", this.recognized.fieldType);
    }
}
exports.ExtensionRender = ExtensionRender;
//# sourceMappingURL=ExtensionRender.js.map