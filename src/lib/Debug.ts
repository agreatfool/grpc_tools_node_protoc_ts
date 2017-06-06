import * as LibUtil from "util";
import * as LibFs from "fs";

const LOG_PATH = '/tmp/protoc-gen-ts.debug.log';

export namespace Debug {

    export function log(info: any): void {
        LibFs.appendFileSync(LOG_PATH, LibUtil.inspect(info, {showHidden: true, depth: null}) + "\n");
    }

}