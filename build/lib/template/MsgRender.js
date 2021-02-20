"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgRender = void 0;
const Engine_1 = require("./engine/Engine");
const EnumRender_1 = require("./partial/msg/EnumRender");
const ExtensionRender_1 = require("./partial/msg/ExtensionRender");
const MessageRender_1 = require("./partial/msg/MessageRender");
const TPL = `// package: #PACKAGE_NAME#
// file: #FILE_NAME#

/* tslint:disable */
/* eslint-disable */

#IMPORTS##MESSAGES##EXTENSIONS##ENUMS#
`;
class MsgRender extends Engine_1.TplEngine {
    constructor(data) {
        super(data);
        this.recognized = this.data;
    }
    render() {
        return TPL
            .replace("#PACKAGE_NAME#", this.recognized.packageName)
            .replace("#FILE_NAME#", this.recognized.fileName)
            .replace("#IMPORTS#", this.renderImports())
            .replace("#MESSAGES#", this.renderMessages())
            .replace("#EXTENSIONS#", this.renderExtensions())
            .replace("#ENUMS#", this.renderEnums());
    }
    renderImports() {
        let rendered = "";
        for (const importData of this.recognized.imports) {
            if (rendered) {
                rendered += "\n";
            }
            rendered += importData;
        }
        return rendered;
    }
    renderMessages() {
        const messages = this.recognized.messages;
        let rendered = "";
        for (const message of messages) {
            rendered += new MessageRender_1.MessageRender(message).render();
        }
        return rendered;
    }
    renderExtensions() {
        const extensions = this.recognized.extensions;
        let rendered = "";
        for (const extension of extensions) {
            rendered += new ExtensionRender_1.ExtensionRender(extension).render();
        }
        return rendered;
    }
    renderEnums() {
        const enums = this.recognized.enums;
        let rendered = "";
        for (const enumData of enums) {
            rendered += new EnumRender_1.EnumRender(enumData).render();
        }
        return rendered;
    }
}
exports.MsgRender = MsgRender;
//# sourceMappingURL=MsgRender.js.map