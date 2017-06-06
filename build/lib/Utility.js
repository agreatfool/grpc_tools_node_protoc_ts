"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PROTO2_SYNTAX = "proto2";
var Utility;
(function (Utility) {
    function filePathToPseudoNamespace(filePath) {
        return filePath.replace(".proto", "").replace(/\//g, "_").replace(/\./g, "_").replace(/-/g, "_") + "_pb";
    }
    Utility.filePathToPseudoNamespace = filePathToPseudoNamespace;
    function snakeToCamel(str) {
        return str.replace(/(_\w)/g, function (m) {
            return m[1].toUpperCase();
        });
    }
    Utility.snakeToCamel = snakeToCamel;
    function uppercaseFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    Utility.uppercaseFirst = uppercaseFirst;
    function isProto2(fileDescriptor) {
        // Empty syntax defaults to proto2
        return (fileDescriptor.getSyntax() === "" || fileDescriptor.getSyntax() === PROTO2_SYNTAX);
    }
    Utility.isProto2 = isProto2;
    function oneOfName(name) {
        return Utility.uppercaseFirst(Utility.snakeToCamel(name));
    }
    Utility.oneOfName = oneOfName;
    function generateIndent(indentLevel) {
        let indent = "";
        for (let i = 0; i < indentLevel; i++) {
            indent += "    ";
        }
        return indent;
    }
    Utility.generateIndent = generateIndent;
    function getPathToRoot(fileName) {
        const depth = fileName.split("/").length;
        return depth === 1 ? "./" : new Array(depth).join("../");
    }
    Utility.getPathToRoot = getPathToRoot;
    function withinNamespaceFromExportEntry(name, exportEntry) {
        return exportEntry.pkg ? name.substring(exportEntry.pkg.length + 1) : name;
    }
    Utility.withinNamespaceFromExportEntry = withinNamespaceFromExportEntry;
    function filePathFromProtoWithoutExt(protoFilePath) {
        return protoFilePath.replace(".proto", "_pb");
    }
    Utility.filePathFromProtoWithoutExt = filePathFromProtoWithoutExt;
    function svcFilePathFromProtoWithoutExt(protoFilePath) {
        return protoFilePath.replace(".proto", "_grpc_pb");
    }
    Utility.svcFilePathFromProtoWithoutExt = svcFilePathFromProtoWithoutExt;
    function withAllStdIn(callback) {
        const ret = [];
        let len = 0;
        const stdin = process.stdin;
        stdin.on("readable", function () {
            let chunk;
            while ((chunk = stdin.read())) {
                if (!(chunk instanceof Buffer))
                    throw new Error("Did not receive buffer");
                ret.push(chunk);
                len += chunk.length;
            }
        });
        stdin.on("end", function () {
            callback(Buffer.concat(ret, len));
        });
    }
    Utility.withAllStdIn = withAllStdIn;
})(Utility = exports.Utility || (exports.Utility = {}));
//# sourceMappingURL=Utility.js.map