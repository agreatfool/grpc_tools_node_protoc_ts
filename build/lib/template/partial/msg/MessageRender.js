"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRender = void 0;
const Engine_1 = require("../../engine/Engine");
const Utility_1 = require("../../../Utility");
const TPL = `

#INDENT#export class #MESSAGE_NAME# extends jspb.Message {
#FIELDS#
#INDENT##IT_LV1#serializeBinary(): Uint8Array;
#INDENT##IT_LV1#toObject(includeInstance?: boolean): #MESSAGE_NAME#.#OBJ_TYPE_NAME#;
#INDENT##IT_LV1#static toObject(includeInstance: boolean, msg: #MESSAGE_NAME#: #MESSAGE_NAME#.#OBJ_TYPE_NAME#;
#INDENT##IT_LV1#static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
#INDENT##IT_LV1#static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
#INDENT##IT_LV1#static serializeBinaryToWriter(message: #MESSAGE_NAME#, writer: jspb.BinaryWriter): void;
#INDENT##IT_LV1#static deserializeBinary(bytes: Uint8Array): #MESSAGE_NAME#;
#INDENT##IT_LV1#static deserializeBinaryFromReader(message: #MESSAGE_NAME#, reader: jspb.BinaryReader): #MESSAGE_NAME#;
#INDENT#}`;
const MAP_FIELD_TPL = `

#INDENT##IT_LV1#get#CAMEL_UPPER_NAME#Map(): jspb.Map<#MAP_KEY_TYPE_NAME#, #MAP_KEY_VAL_NAME#>;
#INDENT##IT_LV1#clear#CAMEL_UPPER_NAME#Map(): void;`;
class MessageRender extends Engine_1.TplEngine {
    constructor(data) {
        super(data);
        this.recognized = this.data;
        this.indent = Utility_1.Utility.generateIndent(1);
    }
    render() {
        return TPL
            .replace(/#INDENT#/g, this.recognized.indent)
            .replace(/#IT_LV1#/g, this.indent)
            .replace(/#MESSAGE_NAME#/g, this.recognized.message.messageName)
            .replace(/#OBJ_TYPE_NAME#/g, this.recognized.objectTypeName)
            .replace("#FIELDS#", this.renderFields);
    }
    renderFields() {
        let rendered = "";
        for (const field of this.recognized.message.fields) {
            if (rendered) {
                rendered += "\n";
            }
            rendered += this.renderField(field);
        }
        return rendered;
    }
    renderField(field) {
        if (field.isMapField) {
            return this.renderMapField(field);
        }
        else {
            return this.renderNonMapField(field);
        }
    }
    renderMapField(field) {
        return MAP_FIELD_TPL
            .replace(/#INDENT#/g, this.recognized.indent)
            .replace(/#IT_LV1#/g, this.indent)
            .replace("#CAMEL_UPPER_NAME#", field.camelUpperName)
            .replace("#MAP_KEY_TYPE_NAME#", field.mapFieldInfo.keyTypeName)
            .replace("#MAP_KEY_VAL_NAME#", field.mapFieldInfo.valueTypeName);
    }
    renderNonMapField(field) {
        return field.hasFieldPresence ? this.renderNonMapFieldPresence(field) : "" + field.isRepeatField ? this.renderNonMapFieldRepeat(field) : "";
    }
    renderNonMapFieldPresence(field) {
        return `\n${this.recognized.indent}${this.indent}has${field.camelUpperName}(): boolean;`
            + this.utilAppendClearMethod(field);
    }
    renderNonMapFieldRepeat(field) {
        return "";
    }
    renderNonMapFieldNonRepeat(field) {
        return "";
    }
    utilAppendClearMethod(field) {
        if (!field.hasClearMethodCreated) {
            field.hasClearMethodCreated = true;
            return `\n${this.recognized.indent}${this.indent}clear${field.camelUpperName}${field.isRepeatField ? "List" : ""}(): void;`;
        }
        else {
            return "";
        }
    }
}
exports.MessageRender = MessageRender;
//# sourceMappingURL=MessageRender.js.map