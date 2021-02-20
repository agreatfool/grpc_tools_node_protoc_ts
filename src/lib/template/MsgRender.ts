import {TplEngine} from "./engine/Engine";
import {ProtoMsgTsdFormatter} from "../format/ProtoMsgTsdFormatter";
import {EnumRender} from "./partial/msg/EnumRender";
import {EnumFormatter} from "../format/partial/EnumFormatter";
import {ExtensionFormatter} from "../format/partial/ExtensionFormatter";
import {ExtensionRender} from "./partial/msg/ExtensionRender";
import {MessageFormatter} from "../format/partial/MessageFormatter";
import {MessageRender} from "./partial/msg/MessageRender";
import IProtoMsgTsdModel = ProtoMsgTsdFormatter.IProtoMsgTsdModel;
import IEnumModel = EnumFormatter.IEnumModel;
import IExtensionModel = ExtensionFormatter.IExtensionModel;
import IMessageModel = MessageFormatter.IMessageModel;

const TPL = `// package: #PACKAGE_NAME#
// file: #FILE_NAME#

/* tslint:disable */
/* eslint-disable */

#IMPORTS##MESSAGES##EXTENSIONS##ENUMS#
`;

export class MsgRender extends TplEngine {
  private recognized: IProtoMsgTsdModel;

  constructor(data: unknown) {
    super(data);

    this.recognized = this.data as IProtoMsgTsdModel;
  }

  public render() {
    return TPL
      .replace("#PACKAGE_NAME#", this.recognized.packageName)
      .replace("#FILE_NAME#", this.recognized.fileName)
      .replace("#IMPORTS#", this.renderImports())
      .replace("#MESSAGES#", this.renderMessages())
      .replace("#EXTENSIONS#", this.renderExtensions())
      .replace("#ENUMS#", this.renderEnums());
  }

  private renderImports(): string {
    let rendered = "";

    for (const importData of this.recognized.imports) {
      if (rendered) {
        rendered += "\n";
      }
      rendered += importData;
    }

    return rendered;
  }

  private renderMessages(): string {
    const messages: IMessageModel[] = this.recognized.messages;
    let rendered = "";

    for (const message of messages) {
      rendered += new MessageRender(message).render();
    }

    return rendered;
  }

  private renderExtensions(): string {
    const extensions: IExtensionModel[] = this.recognized.extensions;
    let rendered = "";

    for (const extension of extensions) {
      rendered += new ExtensionRender(extension).render();
    }

    return rendered;
  }

  private renderEnums(): string {
    const enums: IEnumModel[] = this.recognized.enums;
    let rendered = "";

    for (const enumData of enums) {
      rendered += new EnumRender(enumData).render();
    }

    return rendered;
  }
}
