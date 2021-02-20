import {TplEngine} from "../../engine/Engine";
import {ExtensionFormatter} from "../../../format/partial/ExtensionFormatter";
import IExtensionModel = ExtensionFormatter.IExtensionModel;

const TPL =
`

#INDENT#export const #EXT_NAME#: jspb.ExtensionFieldInfo<#FIELD_TYPE#>;`;

export class ExtensionRender extends TplEngine {
  private recognized: IExtensionModel;

  constructor(data: unknown) {
    super(data);

    this.recognized = this.data as IExtensionModel;
  }

  public render(): string {
    return TPL
      .replace(/#INDENT#/g, this.recognized.indent)
      .replace("#EXT_NAME#", this.recognized.extensionName)
      .replace("#FIELD_TYPE#", this.recognized.fieldType);
  }
}
