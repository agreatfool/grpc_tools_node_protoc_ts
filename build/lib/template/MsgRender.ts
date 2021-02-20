import {TplEngine} from "./engine/Engine";

export class MsgRender extends TplEngine {
  constructor(data: unknown) {
    super(data);
  }

  public render() {
    return "";
  }
}
