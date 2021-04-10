"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageFormatter = exports.OBJECT_TYPE_NAME = void 0;
const descriptor_pb_1 = require("google-protobuf/google/protobuf/descriptor_pb");
const Utility_1 = require("../../Utility");
const FieldTypesFormatter_1 = require("./FieldTypesFormatter");
const EnumFormatter_1 = require("./EnumFormatter");
const ExtensionFormatter_1 = require("./ExtensionFormatter");
const OneofFormatter_1 = require("./OneofFormatter");
const TplEngine_1 = require("../../TplEngine");
exports.OBJECT_TYPE_NAME = "AsObject";
var MessageFormatter;
(function (MessageFormatter) {
    MessageFormatter.defaultMessageType = JSON.stringify({
        messageName: "",
        oneofGroups: [],
        oneofDeclList: [],
        fields: [],
        nestedTypes: [],
        formattedEnumListStr: [],
        formattedOneofListStr: [],
        formattedExtListStr: [],
    });
    MessageFormatter.defaultMessageFieldType = JSON.stringify({
        snakeCaseName: "",
        camelCaseName: "",
        camelUpperName: "",
        fieldObjectType: "",
        type: undefined,
        exportType: "",
        isMapField: false,
        mapFieldInfo: undefined,
        isRepeatField: false,
        isOptionalValue: false,
        canBeUndefined: false,
        hasClearMethodCreated: false,
        hasFieldPresence: false,
    });
    function hasFieldPresence(field, descriptor) {
        if (field.getLabel() === descriptor_pb_1.FieldDescriptorProto.Label.LABEL_REPEATED) {
            return false;
        }
        if (field.hasProto3Optional()) {
            return true;
        }
        if (field.hasOneofIndex()) {
            return true;
        }
        if (field.getType() === FieldTypesFormatter_1.MESSAGE_TYPE) {
            return true;
        }
        return Utility_1.Utility.isProto2(descriptor);
    }
    function format(fileName, exportMap, descriptor, indent, fileDescriptor) {
        const nextIndent = `${indent}    `;
        const messageData = JSON.parse(MessageFormatter.defaultMessageType);
        const proto3OptionalFields = new Set();
        descriptor.getFieldList().forEach((field) => {
            if (field.hasName() && field.hasProto3Optional()) {
                proto3OptionalFields.add(field.getName());
            }
        });
        messageData.messageName = descriptor.getName();
        messageData.oneofDeclList = descriptor.getOneofDeclList().filter((oneOfDecl) => {
            const name = oneOfDecl.getName();
            return !(name && name.length > 1 && proto3OptionalFields.has(name.substring(1)));
        });
        const messageOptions = descriptor.getOptions();
        if (messageOptions !== undefined && messageOptions.getMapEntry()) {
            // this message type is the entry tuple for a map - don't output it
            return null;
        }
        const oneofGroups = [];
        descriptor.getFieldList().forEach((field) => {
            const fieldData = JSON.parse(MessageFormatter.defaultMessageFieldType);
            if (field.hasOneofIndex()) {
                const oneOfIndex = field.getOneofIndex();
                let existing = oneofGroups[oneOfIndex];
                if (existing === undefined) {
                    existing = [];
                    oneofGroups[oneOfIndex] = existing;
                }
                existing.push(field);
            }
            fieldData.snakeCaseName = field.getName().toLowerCase();
            fieldData.camelCaseName = Utility_1.Utility.snakeToCamel(fieldData.snakeCaseName);
            fieldData.camelUpperName = Utility_1.Utility.uppercaseFirst(fieldData.camelCaseName);
            // handle reserved keywords in field names like Javascript generator
            // see: https://github.com/google/protobuf/blob/ed4321d1cb33199984118d801956822842771e7e/src/google/protobuf/compiler/js/js_generator.cc#L508-L510
            if (Utility_1.Utility.isReserved(fieldData.camelCaseName)) {
                fieldData.camelCaseName = `pb_${fieldData.camelCaseName}`;
            }
            fieldData.type = field.getType();
            fieldData.isMapField = false;
            fieldData.canBeUndefined = false;
            let exportType;
            const fullTypeName = field.getTypeName().slice(1);
            if (fieldData.type === FieldTypesFormatter_1.MESSAGE_TYPE) {
                const fieldMessageType = exportMap.getMessage(fullTypeName);
                if (fieldMessageType === undefined) {
                    throw new Error("No message export for: " + fullTypeName);
                }
                fieldData.isMapField = fieldMessageType.messageOptions !== undefined
                    && fieldMessageType.messageOptions.getMapEntry();
                if (fieldData.isMapField) {
                    const mapData = {};
                    const keyTuple = fieldMessageType.mapFieldOptions.key;
                    const keyType = keyTuple[0];
                    const keyTypeName = FieldTypesFormatter_1.FieldTypesFormatter.getFieldType(keyType, keyTuple[1], fileName, exportMap);
                    const valueTuple = fieldMessageType.mapFieldOptions.value;
                    const valueType = valueTuple[0];
                    let valueTypeName = FieldTypesFormatter_1.FieldTypesFormatter.getFieldType(valueType, valueTuple[1], fileName, exportMap);
                    if (valueType === FieldTypesFormatter_1.BYTES_TYPE) {
                        valueTypeName = "Uint8Array | string";
                    }
                    mapData.keyType = keyType;
                    mapData.keyTypeName = keyTypeName;
                    mapData.valueType = valueType;
                    mapData.valueTypeName = valueTypeName;
                    fieldData.mapFieldInfo = mapData;
                    messageData.fields.push(fieldData);
                    return;
                }
                const withinNamespace = Utility_1.Utility.withinNamespaceFromExportEntry(fullTypeName, fieldMessageType);
                if (fieldMessageType.fileName === fileName) {
                    exportType = withinNamespace;
                }
                else {
                    exportType = Utility_1.Utility.filePathToPseudoNamespace(fieldMessageType.fileName) + "." + withinNamespace;
                }
                fieldData.exportType = exportType;
            }
            else if (fieldData.type === FieldTypesFormatter_1.ENUM_TYPE) {
                const fieldEnumType = exportMap.getEnum(fullTypeName);
                if (fieldEnumType === undefined) {
                    throw new Error("No enum export for: " + fullTypeName);
                }
                const withinNamespace = Utility_1.Utility.withinNamespaceFromExportEntry(fullTypeName, fieldEnumType);
                if (fieldEnumType.fileName === fileName) {
                    exportType = withinNamespace;
                }
                else {
                    exportType = Utility_1.Utility.filePathToPseudoNamespace(fieldEnumType.fileName) + "." + withinNamespace;
                }
                fieldData.exportType = exportType;
            }
            else {
                let type = FieldTypesFormatter_1.FieldTypesFormatter.getTypeName(fieldData.type);
                // Check for [jstype = JS_STRING] overrides
                const options = field.getOptions();
                if (options && options.hasJstype()) {
                    const jstype = FieldTypesFormatter_1.FieldTypesFormatter.getJsTypeName(options.getJstype());
                    if (jstype) {
                        type = jstype;
                    }
                }
                exportType = fieldData.exportType = type;
            }
            fieldData.isOptionalValue = field.getType() === FieldTypesFormatter_1.MESSAGE_TYPE;
            fieldData.isRepeatField = field.getLabel() === descriptor_pb_1.FieldDescriptorProto.Label.LABEL_REPEATED;
            if (!fieldData.isRepeatField && fieldData.type !== FieldTypesFormatter_1.BYTES_TYPE) {
                let fieldObjectType = exportType;
                let canBeUndefined = false;
                if (fieldData.type === FieldTypesFormatter_1.MESSAGE_TYPE) {
                    fieldObjectType += ".AsObject";
                    if (!Utility_1.Utility.isProto2(fileDescriptor) || (field.getLabel() === descriptor_pb_1.FieldDescriptorProto.Label.LABEL_OPTIONAL)) {
                        canBeUndefined = true;
                    }
                }
                else if (field.getProto3Optional()) {
                    canBeUndefined = true;
                }
                else {
                    if (Utility_1.Utility.isProto2(fileDescriptor)) {
                        canBeUndefined = true;
                    }
                }
                fieldData.fieldObjectType = fieldObjectType;
                fieldData.canBeUndefined = canBeUndefined;
            }
            fieldData.hasFieldPresence = hasFieldPresence(field, fileDescriptor);
            messageData.fields.push(fieldData);
        });
        descriptor.getNestedTypeList().forEach((nested) => {
            const msgOutput = format(fileName, exportMap, nested, nextIndent, fileDescriptor);
            if (msgOutput !== null) {
                // If the message class is a Map entry then it isn't output, so don't print the namespace block
                messageData.nestedTypes.push(msgOutput);
            }
        });
        descriptor.getEnumTypeList().forEach((enumType) => {
            messageData.formattedEnumListStr.push(EnumFormatter_1.EnumFormatter.format(enumType, nextIndent));
        });
        descriptor.getOneofDeclList().forEach((oneOfDecl, index) => {
            const name = oneOfDecl.getName();
            if (name && name.length > 1 && proto3OptionalFields.has(name.substring(1))) {
                // Skip synthetic one-ofs for proto3 optional fields
                return;
            }
            messageData.formattedOneofListStr.push(OneofFormatter_1.OneofFormatter.format(oneOfDecl, oneofGroups[index] || [], nextIndent));
        });
        descriptor.getExtensionList().forEach((extension) => {
            messageData.formattedExtListStr.push(ExtensionFormatter_1.ExtensionFormatter.format(fileName, exportMap, extension, nextIndent));
        });
        TplEngine_1.TplEngine.registerHelper("printClearIfNotPresent", (fieldData) => {
            if (!fieldData.hasClearMethodCreated) {
                fieldData.hasClearMethodCreated = true;
                if (fieldData.isRepeatField) {
                    return `clear${fieldData.camelUpperName}List(): void;`;
                }
                else {
                    return `clear${Utility_1.Utility.formatOccupiedName(fieldData.camelUpperName)}(): void;`;
                }
            }
        });
        TplEngine_1.TplEngine.registerHelper("printRepeatedAddMethod", (fieldData, valueType) => {
            return `add${Utility_1.Utility.formatOccupiedName(fieldData.camelUpperName)}(value${fieldData.isOptionalValue ? "?" : ""}: ${valueType}, index?: number): ${valueType};`;
        });
        TplEngine_1.TplEngine.registerHelper("oneOfName", (oneOfDecl) => {
            return Utility_1.Utility.oneOfName(oneOfDecl.getName());
        });
        return {
            indent,
            objectTypeName: exports.OBJECT_TYPE_NAME,
            BYTES_TYPE: FieldTypesFormatter_1.BYTES_TYPE,
            MESSAGE_TYPE: FieldTypesFormatter_1.MESSAGE_TYPE,
            message: messageData,
        };
    }
    MessageFormatter.format = format;
})(MessageFormatter = exports.MessageFormatter || (exports.MessageFormatter = {}));
//# sourceMappingURL=MessageFormatter.js.map