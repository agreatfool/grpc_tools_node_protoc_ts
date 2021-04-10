import {
    DescriptorProto,
    FieldDescriptorProto,
    FileDescriptorProto,
    OneofDescriptorProto,
} from "google-protobuf/google/protobuf/descriptor_pb";
import {ExportMap} from "../../ExportMap";
import {Utility} from "../../Utility";
import {BYTES_TYPE, ENUM_TYPE, FieldTypesFormatter, MESSAGE_TYPE} from "./FieldTypesFormatter";
import {EnumFormatter} from "./EnumFormatter";
import {ExtensionFormatter} from "./ExtensionFormatter";
import {OneofFormatter} from "./OneofFormatter";
import {TplEngine} from "../../TplEngine";

export const OBJECT_TYPE_NAME = "AsObject";

export namespace MessageFormatter {

    export interface IMessageType {
        messageName: string;
        oneofGroups: FieldDescriptorProto[][];
        oneofDeclList: OneofDescriptorProto[];
        fields: IMessageFieldType[];
        nestedTypes: MessageFormatter.IMessageModel[];
        formattedEnumListStr: EnumFormatter.IEnumModel[];
        formattedOneofListStr: OneofFormatter.IOneofModel[];
        formattedExtListStr: ExtensionFormatter.IExtensionModel[];
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
    } as IMessageType);

    export interface IMessageFieldType {
        snakeCaseName: string;
        camelCaseName: string;
        camelUpperName: string;
        fieldObjectType: string;
        type: FieldDescriptorProto.Type;
        exportType: string;
        isMapField: boolean;
        mapFieldInfo?: IMessageMapField;
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
    } as IMessageFieldType);

    export interface IMessageMapField {
        keyType: FieldDescriptorProto.Type;
        keyTypeName: string;
        valueType: FieldDescriptorProto.Type;
        valueTypeName: string;
    }

    export interface IMessageModel {
        indent: string;
        objectTypeName: string;
        BYTES_TYPE: number;
        MESSAGE_TYPE: number;
        message: IMessageType;
    }

    function hasFieldPresence(field: FieldDescriptorProto, descriptor: FileDescriptorProto): boolean {
        if (field.getLabel() === FieldDescriptorProto.Label.LABEL_REPEATED) {
            return false;
        }

        if (field.hasProto3Optional()) {
            return true;
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
                           indent: string,
                           fileDescriptor: FileDescriptorProto): IMessageModel {

        const nextIndent = `${indent}    `;
        const messageData = JSON.parse(defaultMessageType) as IMessageType;

        const proto3OptionalFields = new Set<string>();
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

        const oneofGroups: FieldDescriptorProto[][] = [];

        descriptor.getFieldList().forEach((field: FieldDescriptorProto) => {

            const fieldData = JSON.parse(defaultMessageFieldType) as IMessageFieldType;

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

            const fullTypeName = field.getTypeName().slice(1);
            if (fieldData.type === MESSAGE_TYPE) {

                const fieldMessageType = exportMap.getMessage(fullTypeName);
                if (fieldMessageType === undefined) {
                    throw new Error("No message export for: " + fullTypeName);
                }

                fieldData.isMapField = fieldMessageType.messageOptions !== undefined
                    && fieldMessageType.messageOptions.getMapEntry();
                if (fieldData.isMapField) {
                    const mapData = {} as IMessageMapField;
                    const keyTuple = fieldMessageType.mapFieldOptions!.key;
                    const keyType = keyTuple[0];
                    const keyTypeName = FieldTypesFormatter.getFieldType(keyType, keyTuple[1] as string, fileName, exportMap);
                    const valueTuple = fieldMessageType.mapFieldOptions!.value;
                    const valueType = valueTuple[0];
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

                const withinNamespace = Utility.withinNamespaceFromExportEntry(fullTypeName, fieldMessageType);
                if (fieldMessageType.fileName === fileName) {
                    exportType = withinNamespace;
                } else {
                    exportType = Utility.filePathToPseudoNamespace(fieldMessageType.fileName) + "." + withinNamespace;
                }
                fieldData.exportType = exportType;

            } else if (fieldData.type === ENUM_TYPE) {

                const fieldEnumType = exportMap.getEnum(fullTypeName);
                if (fieldEnumType === undefined) {
                    throw new Error("No enum export for: " + fullTypeName);
                }
                const withinNamespace = Utility.withinNamespaceFromExportEntry(fullTypeName, fieldEnumType);
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
                } else if (field.getProto3Optional()) {
                    canBeUndefined = true;
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

        descriptor.getNestedTypeList().forEach((nested) => {
            const msgOutput = format(fileName, exportMap, nested, nextIndent, fileDescriptor);
            if (msgOutput !== null) {
                // If the message class is a Map entry then it isn't output, so don't print the namespace block
                messageData.nestedTypes.push(msgOutput);
            }
        });
        descriptor.getEnumTypeList().forEach((enumType) => {
            messageData.formattedEnumListStr.push(EnumFormatter.format(enumType, nextIndent));
        });
        descriptor.getOneofDeclList().forEach((oneOfDecl, index) => {
            const name = oneOfDecl.getName();
            if (name && name.length > 1 && proto3OptionalFields.has(name.substring(1))) {
                // Skip synthetic one-ofs for proto3 optional fields
                return;
            }
            messageData.formattedOneofListStr.push(OneofFormatter.format(oneOfDecl, oneofGroups[index] || [], nextIndent));
        });
        descriptor.getExtensionList().forEach((extension) => {
            messageData.formattedExtListStr.push(ExtensionFormatter.format(fileName, exportMap, extension, nextIndent));
        });

        TplEngine.registerHelper("printClearIfNotPresent", (fieldData: IMessageFieldType) => {
            if (!fieldData.hasClearMethodCreated) {
                fieldData.hasClearMethodCreated = true;

                if (fieldData.isRepeatField) {
                    return `clear${fieldData.camelUpperName}List(): void;`;
                } else {
                    return `clear${Utility.formatOccupiedName(fieldData.camelUpperName)}(): void;`;
                }
            }
        });
        TplEngine.registerHelper("printRepeatedAddMethod", (fieldData: IMessageFieldType, valueType: string) => {
            return `add${Utility.formatOccupiedName(fieldData.camelUpperName)}(value${fieldData.isOptionalValue ? "?" : ""}: ${valueType}, index?: number): ${valueType};`;
        });
        TplEngine.registerHelper("oneOfName", (oneOfDecl: OneofDescriptorProto) => {
            return Utility.oneOfName(oneOfDecl.getName());
        });

        return {
            indent,
            objectTypeName: OBJECT_TYPE_NAME,
            BYTES_TYPE,
            MESSAGE_TYPE,
            message: messageData,
        };
    }

}
