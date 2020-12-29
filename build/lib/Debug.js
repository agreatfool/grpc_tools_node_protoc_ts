"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
const LibUtil = require("util");
const LibFs = require("fs");
const LOG_PATH = "/tmp/protoc-gen-ts.debug.log";
var Debug;
(function (Debug) {
    function log(info) {
        LibFs.appendFileSync(LOG_PATH, LibUtil.inspect(info, { showHidden: true, depth: null }) + "\n");
    }
    Debug.log = log;
})(Debug = exports.Debug || (exports.Debug = {}));
//# sourceMappingURL=Debug.js.map