"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumRender = void 0;
const Engine_1 = require("../../engine/Engine");
const Utility_1 = require("../../../Utility");
const TPL = `

#INDENT#export enum #ENUM_NAME# {
#ATTRIBUTES#
#INDENT#}`;
const ATTR_TPL = "#INDENT##IT_LV1##KEY# = #VAL#,";
class EnumRender extends Engine_1.TplEngine {
    constructor(data) {
        super(data);
        this.recognized = this.data;
    }
    render() {
        return TPL
            .replace(/#INDENT#/g, this.recognized.indent)
            .replace("#ENUM_NAME#", this.recognized.enumName)
            .replace("#ATTRIBUTES#", this.renderAttributes());
    }
    renderAttributes() {
        const indent = Utility_1.Utility.generateIndent(1);
        let rendered = "";
        for (const [key, value] of Object.entries(this.recognized.values)) {
            if (rendered) {
                rendered += "\n";
            }
            rendered += ATTR_TPL
                .replace(/#INDENT#/g, this.recognized.indent)
                .replace("#IT_LV1#", indent)
                .replace("#KEY#", key)
                .replace("#VAL#", value.toString());
        }
        return rendered;
    }
}
exports.EnumRender = EnumRender;
//# sourceMappingURL=EnumRender.js.map