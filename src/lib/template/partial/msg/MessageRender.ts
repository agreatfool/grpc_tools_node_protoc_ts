import {TplEngine} from "../../engine/Engine";
import {MessageFormatter} from "../../../format/partial/MessageFormatter";
import {Utility} from "../../../Utility";
import IMessageModel = MessageFormatter.IMessageModel;
import IMessageFieldType = MessageFormatter.IMessageFieldType;

const TPL =
  `

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

const MAP_FIELD_TPL =
  `

#INDENT##IT_LV1#get#CAMEL_UPPER_NAME#Map(): jspb.Map<#MAP_KEY_TYPE_NAME#, #MAP_KEY_VAL_NAME#>;
#INDENT##IT_LV1#clear#CAMEL_UPPER_NAME#Map(): void;`;

export class MessageRender extends TplEngine {
  private recognized: IMessageModel;
  private readonly indent: string;

  constructor(data: unknown) {
    super(data);

    this.recognized = this.data as IMessageModel;
    this.indent = Utility.generateIndent(1);
  }

  public render(): string {
    return TPL
      .replace(/#INDENT#/g, this.recognized.indent)
      .replace(/#IT_LV1#/g, this.indent)
      .replace(/#MESSAGE_NAME#/g, this.recognized.message.messageName)
      .replace(/#OBJ_TYPE_NAME#/g, this.recognized.objectTypeName)
      .replace("#FIELDS#", this.renderFields());
  }

  private renderFields(): string {
    let rendered = "";

    for (const field of this.recognized.message.fields) {
      rendered += this.renderField(field);
    }

    return rendered;
  }

  private renderField(field: IMessageFieldType): string {
    if (field.isMapField) {
      return this.renderMapField(field);
    } else {
      return this.renderNonMapField(field);
    }
  }

  private renderMapField(field: IMessageFieldType): string {
    return MAP_FIELD_TPL
      .replace(/#INDENT#/g, this.recognized.indent)
      .replace(/#IT_LV1#/g, this.indent)
      .replace("#CAMEL_UPPER_NAME#", field.camelUpperName)
      .replace("#MAP_KEY_TYPE_NAME#", field.mapFieldInfo.keyTypeName)
      .replace("#MAP_KEY_VAL_NAME#", field.mapFieldInfo.valueTypeName);
  }

  private renderNonMapField(field: IMessageFieldType): string {
    return field.hasFieldPresence ? this.renderNonMapFieldPresence(field) : "" + field.isRepeatField ? this.renderNonMapFieldRepeat(field) : "";
  }

  private renderNonMapFieldPresence(field: IMessageFieldType): string {
    return `\n${this.recognized.indent}${this.indent}has${field.camelUpperName}(): boolean;`
      + this.utilAppendClearMethod(field);
  }

  private renderNonMapFieldRepeat(field: IMessageFieldType): string {
    return "";
  }

  private renderNonMapFieldNonRepeat(field: IMessageFieldType): string {
    return "";
  }

  private utilAppendClearMethod(field): string {
    if (!field.hasClearMethodCreated) {
      field.hasClearMethodCreated = true;
      return `\n${this.recognized.indent}${this.indent}clear${field.camelUpperName}${field.isRepeatField ? "List" : ""}(): void;`;
    } else {
      return "";
    }
  }
}
