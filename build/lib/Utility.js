"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utility = void 0;
const PROTO2_SYNTAX = "proto2";
var Utility;
(function (Utility) {
    function filePathToPseudoNamespace(filePath) {
        return filePath.replace(".proto", "").replace(/\//g, "_").replace(/\./g, "_").replace(/-/g, "_") + "_pb";
    }
    Utility.filePathToPseudoNamespace = filePathToPseudoNamespace;
    function snakeToCamel(str) {
        return str.replace(/(_\w)/g, (m) => {
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
        const parts = name.split("_");
        for (const [index, part] of parts.entries()) {
            parts[index] = Utility.uppercaseFirst(Utility.snakeToCamel(part).toLowerCase());
        }
        return parts.join("");
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
        stdin.on("readable", () => {
            let chunk;
            while ((chunk = stdin.read())) {
                if (!(chunk instanceof Buffer)) {
                    throw new Error("Did not receive buffer");
                }
                ret.push(chunk);
                len += chunk.length;
            }
        });
        stdin.on("end", () => {
            callback(Buffer.concat(ret, len));
        });
    }
    Utility.withAllStdIn = withAllStdIn;
    function isReserved(name) {
        for (const keyword of reservedKeywords) {
            if (name === keyword) {
                return true;
            }
        }
        return false;
    }
    Utility.isReserved = isReserved;
    function formatOccupiedName(name) {
        if (name === "Extension" || name === "JsPbMessageId") {
            name += "$";
        }
        return name;
    }
    Utility.formatOccupiedName = formatOccupiedName;
    // reserved Javascript keywords used by the Javascript generator
    // src: https://github.com/google/protobuf/blob/ed4321d1cb33199984118d801956822842771e7e/src/google/protobuf/compiler/js/js_generator.cc#L60-L119
    const reservedKeywords = [
        "abstract",
        "boolean",
        "break",
        "byte",
        "case",
        "catch",
        "char",
        "class",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "do",
        "double",
        "else",
        "enum",
        "export",
        "extends",
        "false",
        "final",
        "finally",
        "float",
        "for",
        "function",
        "goto",
        "if",
        "implements",
        "import",
        "in",
        "instanceof",
        "int",
        "interface",
        "long",
        "native",
        "new",
        "null",
        "package",
        "private",
        "protected",
        "public",
        "return",
        "short",
        "static",
        "super",
        "switch",
        "synchronized",
        "this",
        "throw",
        "throws",
        "transient",
        "try",
        "typeof",
        "var",
        "void",
        "volatile",
        "while",
        "with",
    ];
})(Utility = exports.Utility || (exports.Utility = {}));
//# sourceMappingURL=Utility.js.map