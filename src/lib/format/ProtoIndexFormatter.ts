import { TplEngine } from '../TplEngine';

export namespace ProtoIndexFormatter {

  export function format(exports: string[], template: string): string {

    return TplEngine.render(template, {
      exports,
    });
  }

}
