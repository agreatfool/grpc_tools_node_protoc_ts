"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const descriptor_pb_1 = require("google-protobuf/google/protobuf/descriptor_pb");
const Utility_1 = require("../../Utility");
const FieldTypesFormatter_1 = require("./FieldTypesFormatter");
const EnumFormatter_1 = require("./EnumFormatter");
const ExtensionFormatter_1 = require("./ExtensionFormatter");
const OneofFormatter_1 = require("./OneofFormatter");
const TplEngine_1 = require("../../TplEngine");
exports.OBJECT_TYPE_NAME = 'AsObject';
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
        if (field.hasOneofIndex()) {
            return true;
        }
        if (field.getType() === FieldTypesFormatter_1.MESSAGE_TYPE) {
            return true;
        }
        return Utility_1.Utility.isProto2(descriptor);
    }
    function format(fileName, exportMap, descriptor, indentLevel, fileDescriptor) {
        let messageData = JSON.parse(MessageFormatter.defaultMessageType);
        messageData.messageName = descriptor.getName();
        messageData.oneofDeclList = descriptor.getOneofDeclList();
        let messageOptions = descriptor.getOptions();
        if (messageOptions !== undefined && messageOptions.getMapEntry()) {
            // this message type is the entry tuple for a map - don't output it
            return "";
        }
        let oneofGroups = [];
        descriptor.getFieldList().forEach((field) => {
            let fieldData = JSON.parse(MessageFormatter.defaultMessageFieldType);
            if (field.hasOneofIndex()) {
                let oneOfIndex = field.getOneofIndex();
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
            let fullTypeName = field.getTypeName().slice(1);
            if (fieldData.type === FieldTypesFormatter_1.MESSAGE_TYPE) {
                const fieldMessageType = exportMap.getMessage(fullTypeName);
                if (fieldMessageType === undefined) {
                    throw new Error("No message export for: " + fullTypeName);
                }
                fieldData.isMapField = fieldMessageType.messageOptions !== undefined
                    && fieldMessageType.messageOptions.getMapEntry();
                if (fieldData.isMapField) {
                    let mapData = {};
                    let keyTuple = fieldMessageType.mapFieldOptions.key;
                    let keyType = keyTuple[0];
                    let keyTypeName = FieldTypesFormatter_1.FieldTypesFormatter.getFieldType(keyType, keyTuple[1], fileName, exportMap);
                    let valueTuple = fieldMessageType.mapFieldOptions.value;
                    let valueType = valueTuple[0];
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
                let withinNamespace = Utility_1.Utility.withinNamespaceFromExportEntry(fullTypeName, fieldMessageType);
                if (fieldMessageType.fileName === fileName) {
                    exportType = withinNamespace;
                }
                else {
                    exportType = Utility_1.Utility.filePathToPseudoNamespace(fieldMessageType.fileName) + "." + withinNamespace;
                }
                fieldData.exportType = exportType;
            }
            else if (fieldData.type === FieldTypesFormatter_1.ENUM_TYPE) {
                let fieldEnumType = exportMap.getEnum(fullTypeName);
                if (fieldEnumType === undefined) {
                    throw new Error("No enum export for: " + fullTypeName);
                }
                let withinNamespace = Utility_1.Utility.withinNamespaceFromExportEntry(fullTypeName, fieldEnumType);
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
        descriptor.getNestedTypeList().forEach(nested => {
            const msgOutput = format(fileName, exportMap, nested, indentLevel + 1, fileDescriptor);
            if (msgOutput !== "") {
                // If the message class is a Map entry then it isn't output, so don't print the namespace block
                messageData.nestedTypes.push(msgOutput);
            }
        });
        descriptor.getEnumTypeList().forEach(enumType => {
            messageData.formattedEnumListStr.push(EnumFormatter_1.EnumFormatter.format(enumType, indentLevel + 1));
        });
        descriptor.getOneofDeclList().forEach((oneOfDecl, index) => {
            messageData.formattedOneofListStr.push(OneofFormatter_1.OneofFormatter.format(oneOfDecl, oneofGroups[index] || [], indentLevel + 1));
        });
        descriptor.getExtensionList().forEach(extension => {
            messageData.formattedExtListStr.push(ExtensionFormatter_1.ExtensionFormatter.format(fileName, exportMap, extension, indentLevel + 1));
        });
        TplEngine_1.TplEngine.registerHelper('printClearIfNotPresent', function (fieldData) {
            if (!fieldData.hasClearMethodCreated) {
                fieldData.hasClearMethodCreated = true;
                return `clear${fieldData.camelUpperName}${fieldData.isRepeatField ? "List" : ""}(): void;`;
            }
        });
        TplEngine_1.TplEngine.registerHelper('printRepeatedAddMethod', function (fieldData, valueType) {
            return `add${fieldData.camelUpperName}(value${fieldData.isOptionalValue ? "?" : ""}: ${valueType}, index?: number): ${valueType};`;
        });
        TplEngine_1.TplEngine.registerHelper('oneOfName', function (oneOfDecl) {
            return Utility_1.Utility.oneOfName(oneOfDecl.getName());
        });
        return TplEngine_1.TplEngine.render('partial/message', {
            indent: Utility_1.Utility.generateIndent(indentLevel),
            objectTypeName: exports.OBJECT_TYPE_NAME,
            BYTES_TYPE: FieldTypesFormatter_1.BYTES_TYPE,
            MESSAGE_TYPE: FieldTypesFormatter_1.MESSAGE_TYPE,
            message: messageData,
        });
    }
    MessageFormatter.format = format;
})(MessageFormatter = exports.MessageFormatter || (exports.MessageFormatter = {}));
//# sourceMappingURL=MessageFormatter.js.map