import {
    DescriptorProto,
    FieldDescriptorProto,
    FileDescriptorProto,
    OneofDescriptorProto
} from "google-protobuf/google/protobuf/descriptor_pb";
import {ExportMap} from "../../ExportMap";
import {Utility} from "../../Utility";
import {BYTES_TYPE, ENUM_TYPE, FieldTypesFormatter, MESSAGE_TYPE} from "./FieldTypesFormatter";
import {EnumFormatter} from "./EnumFormatter";
import {ExtensionFormatter} from "./ExtensionFormatter";
import {OneofFormatter} from "./OneofFormatter";
import {TplEngine} from "../../TplEngine";

export const OBJECT_TYPE_NAME = 'AsObject';

export namespace MessageFormatter {

    export interface MessageType {
        messageName: string;
        oneofGroups: Array<Array<FieldDescriptorProto>>;
        oneofDeclList: Array<OneofDescriptorProto>;
        fields: Array<MessageFieldType>;
        nestedTypes: Array<string>;
        formattedEnumListStr: Array<string>;
        formattedOneofListStr: Array<string>;
        formattedExtListStr: Array<string>;
    }

    export const defaultMessageType = JSON.stringify({
        messageName: "",
        oneofGroups: [],
        oneofDeclList: [],
        fields: [],
        nestedTypes: [],
        formattedEnumListStr: [],
        formattedOneofListStr: [],
        formattedExtListStr: [],
    } as MessageType);

    export interface MessageFieldType {
        snakeCaseName: string;
        camelCaseName: string;
        camelUpperName: string;
        fieldObjectType: string;
        type: FieldDescriptorProto.Type;
        exportType: string;
        isMapField: boolean;
        mapFieldInfo?: MessageMapField;
        isRepeatField: boolean;
        isOptionalValue: boolean;
        canBeUndefined: boolean;
        hasClearMethodCreated: boolean;
        hasFieldPresence: boolean;
    }

    export const defaultMessageFieldType = JSON.stringify({
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
    } as MessageFieldType);

    export interface MessageMapField {
        keyType: FieldDescriptorProto.Type;
        keyTypeName: string;
        valueType: FieldDescriptorProto.Type;
        valueTypeName: string;
    }

    function hasFieldPresence(field: FieldDescriptorProto, descriptor: FileDescriptorProto): boolean {
        if (field.getLabel() === FieldDescriptorProto.Label.LABEL_REPEATED) {
            return false;
        }

        if (field.hasOneofIndex()) {
            return true;
        }

        if (field.getType() === MESSAGE_TYPE) {
            return true;
        }

        return Utility.isProto2(descriptor);
    }

    export function format(fileName: string,
                           exportMap: ExportMap,
                           descriptor: DescriptorProto,
                           indentLevel: number,
                           fileDescriptor: FileDescriptorProto): string {

        let messageData = JSON.parse(defaultMessageType) as MessageType;

        messageData.messageName = descriptor.getName();
        messageData.oneofDeclList = descriptor.getOneofDeclList();
        let messageOptions = descriptor.getOptions();
        if (messageOptions !== undefined && messageOptions.getMapEntry()) {
            // this message type is the entry tuple for a map - don't output it
            return "";
        }

        let oneofGroups: Array<Array<FieldDescriptorProto>> = [];

        descriptor.getFieldList().forEach((field: FieldDescriptorProto) => {

            let fieldData = JSON.parse(defaultMessageFieldType) as MessageFieldType;

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
            fieldData.camelCaseName = Utility.snakeToCamel(fieldData.snakeCaseName);
            fieldData.camelUpperName = Utility.uppercaseFirst(fieldData.camelCaseName);
            // handle reserved keywords in field names like Javascript generator
            // see: https://github.com/google/protobuf/blob/ed4321d1cb33199984118d801956822842771e7e/src/google/protobuf/compiler/js/js_generator.cc#L508-L510
            if (Utility.isReserved(fieldData.camelCaseName)) {
                fieldData.camelCaseName = `pb_${fieldData.camelCaseName}`;
            }
            fieldData.type = field.getType();
            fieldData.isMapField = false;
            fieldData.canBeUndefined = false;

            let exportType;

            let fullTypeName = field.getTypeName().slice(1);
            if (fieldData.type === MESSAGE_TYPE) {

                const fieldMessageType = exportMap.getMessage(fullTypeName);
                if (fieldMessageType === undefined) {
                    throw new Error("No message export for: " + fullTypeName);
                }

                fieldData.isMapField = fieldMessageType.messageOptions !== undefined
                    && fieldMessageType.messageOptions.getMapEntry();
                if (fieldData.isMapField) {
                    let mapData = {} as MessageMapField;
                    let keyTuple = fieldMessageType.mapFieldOptions!.key;
                    let keyType = keyTuple[0];
                    let keyTypeName = FieldTypesFormatter.getFieldType(keyType, keyTuple[1] as string, fileName, exportMap);
                    let valueTuple = fieldMessageType.mapFieldOptions!.value;
                    let valueType = valueTuple[0];
                    let valueTypeName = FieldTypesFormatter.getFieldType(valueType, valueTuple[1] as string, fileName, exportMap);
                    if (valueType === BYTES_TYPE) {
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

                let withinNamespace = Utility.withinNamespaceFromExportEntry(fullTypeName, fieldMessageType);
                if (fieldMessageType.fileName === fileName) {
                    exportType = withinNamespace;
                } else {
                    exportType = Utility.filePathToPseudoNamespace(fieldMessageType.fileName) + "." + withinNamespace;
                }
                fieldData.exportType = exportType;

            } else if (fieldData.type === ENUM_TYPE) {

                let fieldEnumType = exportMap.getEnum(fullTypeName);
                if (fieldEnumType === undefined) {
                    throw new Error("No enum export for: " + fullTypeName);
                }
                let withinNamespace = Utility.withinNamespaceFromExportEntry(fullTypeName, fieldEnumType);
                if (fieldEnumType.fileName === fileName) {
                    exportType = withinNamespace;
                } else {
                    exportType = Utility.filePathToPseudoNamespace(fieldEnumType.fileName) + "." + withinNamespace;
                }
                fieldData.exportType = exportType;

            } else {

                let type = FieldTypesFormatter.getTypeName(fieldData.type);

                // Check for [jstype = JS_STRING] overrides
                const options = field.getOptions();
                if (options && options.hasJstype()) {
                    const jstype = FieldTypesFormatter.getJsTypeName(options.getJstype());
                    if (jstype) {
                        type = jstype;
                    }
                }

                exportType = fieldData.exportType = type;

            }

            fieldData.isOptionalValue = field.getType() === MESSAGE_TYPE;
            fieldData.isRepeatField = field.getLabel() === FieldDescriptorProto.Label.LABEL_REPEATED;
            if (!fieldData.isRepeatField && fieldData.type !== BYTES_TYPE) {
                let fieldObjectType = exportType;
                let canBeUndefined = false;
                if (fieldData.type === MESSAGE_TYPE) {
                    fieldObjectType += ".AsObject";
                    if (!Utility.isProto2(fileDescriptor) || (field.getLabel() === FieldDescriptorProto.Label.LABEL_OPTIONAL)) {
                        canBeUndefined = true;
                    }
                } else {
                    if (Utility.isProto2(fileDescriptor)) {
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
            messageData.formattedEnumListStr.push(EnumFormatter.format(enumType, indentLevel + 1));
        });
        descriptor.getOneofDeclList().forEach((oneOfDecl, index) => {
            messageData.formattedOneofListStr.push(OneofFormatter.format(oneOfDecl, oneofGroups[index] || [], indentLevel + 1));
        });
        descriptor.getExtensionList().forEach(extension => {
            messageData.formattedExtListStr.push(ExtensionFormatter.format(fileName, exportMap, extension, indentLevel + 1));
        });

        TplEngine.registerHelper('printClearIfNotPresent', function (fieldData: MessageFieldType) {
            if (!fieldData.hasClearMethodCreated) {
                fieldData.hasClearMethodCreated = true;
                return `clear${fieldData.camelUpperName}${fieldData.isRepeatField ? "List" : ""}(): void;`;
            }
        });
        TplEngine.registerHelper('printRepeatedAddMethod', function (fieldData: MessageFieldType, valueType: string) {
            return `add${fieldData.camelUpperName}(value${fieldData.isOptionalValue ? "?" : ""}: ${valueType}, index?: number): ${valueType};`;
        });
        TplEngine.registerHelper('oneOfName', function (oneOfDecl: OneofDescriptorProto) {
            return Utility.oneOfName(oneOfDecl.getName());
        });

        return TplEngine.render('partial/message', {
            indent: Utility.generateIndent(indentLevel),
            objectTypeName: OBJECT_TYPE_NAME,
            BYTES_TYPE: BYTES_TYPE,
            MESSAGE_TYPE: MESSAGE_TYPE,
            message: messageData,
        });
    }

}
