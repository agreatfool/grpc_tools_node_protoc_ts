"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldTypesFormatter = exports.JS_NUMBER = exports.JS_STRING = exports.JS_NORMAL = exports.ENUM_TYPE = exports.BYTES_TYPE = exports.MESSAGE_TYPE = void 0;
const Utility_1 = require("../../Utility");
exports.MESSAGE_TYPE = 11;
exports.BYTES_TYPE = 12;
exports.ENUM_TYPE = 14;
// @see https://github.com/protocolbuffers/protobuf/blob/v3.11.4/src/google/protobuf/descriptor.proto#L542
exports.JS_NORMAL = 0;
exports.JS_STRING = 1;
exports.JS_NUMBER = 2;
const TypeNumToTypeString = {};
TypeNumToTypeString[1] = "number"; // TYPE_DOUBLE
TypeNumToTypeString[2] = "number"; // TYPE_FLOAT
TypeNumToTypeString[3] = "number"; // TYPE_INT64
TypeNumToTypeString[4] = "number"; // TYPE_UINT64
TypeNumToTypeString[5] = "number"; // TYPE_INT32
TypeNumToTypeString[6] = "number"; // TYPE_FIXED64
TypeNumToTypeString[7] = "number"; // TYPE_FIXED32
TypeNumToTypeString[8] = "boolean"; // TYPE_BOOL
TypeNumToTypeString[9] = "string"; // TYPE_STRING
TypeNumToTypeString[10] = "Object"; // TYPE_GROUP
TypeNumToTypeString[exports.MESSAGE_TYPE] = "Object"; // TYPE_MESSAGE - Length-delimited aggregate.
TypeNumToTypeString[exports.BYTES_TYPE] = "Uint8Array"; // TYPE_BYTES
TypeNumToTypeString[13] = "number"; // TYPE_UINT32
TypeNumToTypeString[exports.ENUM_TYPE] = "number"; // TYPE_ENUM
TypeNumToTypeString[15] = "number"; // TYPE_SFIXED32
TypeNumToTypeString[16] = "number"; // TYPE_SFIXED64
TypeNumToTypeString[17] = "number"; // TYPE_SINT32 - Uses ZigZag encoding.
TypeNumToTypeString[18] = "number"; // TYPE_SINT64 - Uses ZigZag encoding.
const JsTypeNumToTypeString = {};
JsTypeNumToTypeString[exports.JS_NORMAL] = null; // [jstype = JS_NORMAL], value "null" means just using the original type
JsTypeNumToTypeString[exports.JS_STRING] = "string"; // [jstype = JS_STRING]
JsTypeNumToTypeString[exports.JS_NUMBER] = "number"; // [jstype = JS_NUMBER]
var FieldTypesFormatter;
(function (FieldTypesFormatter) {
    function getTypeName(fieldTypeNum) {
        return TypeNumToTypeString[fieldTypeNum];
    }
    FieldTypesFormatter.getTypeName = getTypeName;
    function getJsTypeName(fieldTypeNum) {
        return fieldTypeNum === exports.JS_NORMAL ? null : JsTypeNumToTypeString[fieldTypeNum];
    }
    FieldTypesFormatter.getJsTypeName = getJsTypeName;
    function getFieldType(type, typeName, currentFileName, exportMap) {
        let fieldType;
        let fromExport;
        let withinNamespace;
        switch (type) {
            case exports.MESSAGE_TYPE:
                fromExport = exportMap.getMessage(typeName);
                if (!fromExport) {
                    throw new Error("Could not getFieldType for message: " + typeName);
                }
                withinNamespace = Utility_1.Utility.withinNamespaceFromExportEntry(typeName, fromExport);
                if (fromExport.fileName === currentFileName) {
                    fieldType = withinNamespace;
                }
                else {
                    fieldType = Utility_1.Utility.filePathToPseudoNamespace(fromExport.fileName) + "." + withinNamespace;
                }
                break;
            case exports.ENUM_TYPE:
                fromExport = exportMap.getEnum(typeName);
                if (!fromExport) {
                    throw new Error("Could not getFieldType for enum: " + typeName);
                }
                withinNamespace = Utility_1.Utility.withinNamespaceFromExportEntry(typeName, fromExport);
                if (fromExport.fileName === currentFileName) {
                    fieldType = withinNamespace;
                }
                else {
                    fieldType = Utility_1.Utility.filePathToPseudoNamespace(fromExport.fileName) + "." + withinNamespace;
                }
                break;
            default:
                fieldType = TypeNumToTypeString[type];
                break;
        }
        return fieldType;
    }
    FieldTypesFormatter.getFieldType = getFieldType;
})(FieldTypesFormatter = exports.FieldTypesFormatter || (exports.FieldTypesFormatter = {}));
//# sourceMappingURL=FieldTypesFormatter.js.map