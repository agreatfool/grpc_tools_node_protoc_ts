import {TplEngine} from "../../engine/Engine";
import {EnumFormatter} from "../../../format/partial/EnumFormatter";
import IEnumModel = EnumFormatter.IEnumModel;
import {Utility} from "../../../Utility";

const TPL =
`

#INDENT#export enum #ENUM_NAME# {
#ATTRIBUTES#
#INDENT#}`;

const ATTR_TPL = "#INDENT##IT_LV1##KEY# = #VAL#,";

export class EnumRender extends TplEngine {
  private recognized: IEnumModel;

  constructor(data: unknown) {
    super(data);

    this.recognized = this.data as IEnumModel;
  }

  public render(): string {
    return TPL
      .replace(/#INDENT#/g, this.recognized.indent)
      .replace("#ENUM_NAME#", this.recognized.enumName)
      .replace("#ATTRIBUTES#", this.renderAttributes());
  }

  private renderAttributes(): string {
    const indent = Utility.generateIndent(1);
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
