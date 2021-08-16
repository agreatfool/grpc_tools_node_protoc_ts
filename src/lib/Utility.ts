import {FileDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {IExportEnumEntry, IExportMessageEntry} from "./ExportMap";

const PROTO2_SYNTAX = "proto2";

export namespace Utility {

    export function filePathToPseudoNamespace(filePath: string): string {
        return filePath.replace(".proto", "").replace(/\//g, "_").replace(/\./g, "_").replace(/-/g, "_") + "_pb";
    }

    export function snakeToCamel(str: string): string {
        return str.replace(/(_\w)/g, (m) => {
            return m[1].toUpperCase();
        });
    }

    export function uppercaseFirst(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    export function isProto2(fileDescriptor: FileDescriptorProto): boolean {
        // Empty syntax defaults to proto2
        return (fileDescriptor.getSyntax() === "" || fileDescriptor.getSyntax() === PROTO2_SYNTAX);
    }

    export function oneOfName(name: string) {
        const parts = name.split("_");
        for (const [index, part] of parts.entries()) {
            parts[index] = Utility.uppercaseFirst(Utility.snakeToCamel(part).toLowerCase());
        }
        return parts.join("");
    }

    export function generateIndent(indentLevel: number): string {
        let indent = "";
        for (let i = 0; i < indentLevel; i++) {
            indent += "    ";
        }
        return indent;
    }

    export function getPathToRoot(fileName: string) {
        const depth = fileName.split("/").length;
        return depth === 1 ? "./" : new Array(depth).join("../");
    }

    export function withinNamespaceFromExportEntry(name: string, exportEntry: IExportMessageEntry | IExportEnumEntry) {
        return exportEntry.pkg ? name.substring(exportEntry.pkg.length + 1) : name;
    }

    export function filePathFromProtoWithoutExt(protoFilePath: string): string {
        return protoFilePath.replace(".proto", "_pb");
    }

    export function svcFilePathFromProtoWithoutExt(protoFilePath: string): string {
        return protoFilePath.replace(".proto", "_grpc_pb");
    }

    export function withAllStdIn(callback: (buffer: Buffer) => void): void {
        const ret: Buffer[] = [];
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

    export function isReserved(name: string): boolean {
        for (const keyword of reservedKeywords) {
            if (name === keyword) {
                return true;
            }
        }
        return false;
    }

    export function formatOccupiedName(name: string): string {
        if (name === "Extension" || name === "JsPbMessageId") {
            name += "$";
        }
        return name;
    }

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
}
