import {
    DescriptorProto,
    EnumOptions,
    FieldDescriptorProto,
    FileDescriptorProto,
    MessageOptions
} from "google-protobuf/google/protobuf/descriptor_pb";

import Type = FieldDescriptorProto.Type;

export type ExportMessageEntry = {
    pkg: string,
    fileName: string,
    messageOptions: MessageOptions,
    mapFieldOptions?: {
        key: [Type, string],    // Type, StringTypeName
        value: [Type, string],  // Type, StringTypeName
    }
}

export type ExportEnumEntry = {
    pkg: string,
    fileName: string,
    enumOptions: EnumOptions,
}

export class ExportMap {
    messageMap: { [key: string]: ExportMessageEntry } = {};
    enumMap: { [key: string]: ExportEnumEntry } = {};

    exportNested(scope: string, fileDescriptor: FileDescriptorProto, message: DescriptorProto) {
        const messageEntry: ExportMessageEntry = {
            pkg: fileDescriptor.getPackage(),
            fileName: fileDescriptor.getName(),
            messageOptions: message.getOptions(),
            mapFieldOptions: message.getOptions() && message.getOptions().getMapEntry() ? {
                key: [message.getFieldList()[0].getType(), message.getFieldList()[0].getTypeName().slice(1)],
                value: [message.getFieldList()[1].getType(), message.getFieldList()[1].getTypeName().slice(1)],
            } : undefined,
        };

        const entryName = `${scope ? scope + "." : ""}${message.getName()}`;
        this.messageMap[entryName] = messageEntry;

        message.getNestedTypeList().forEach(nested => {
            this.exportNested(entryName, fileDescriptor, nested);
        });

        message.getEnumTypeList().forEach(enumType => {
            const identifier = entryName + "." + enumType.getName();
            this.enumMap[identifier] = {
                pkg: fileDescriptor.getPackage(),
                fileName: fileDescriptor.getName(),
                enumOptions: enumType.getOptions(),
            };
        });
    }

    addFileDescriptor(fileDescriptor: FileDescriptorProto) {
        const scope = fileDescriptor.getPackage();
        fileDescriptor.getMessageTypeList().forEach(messageType => {
            this.exportNested(scope, fileDescriptor, messageType);
        });

        fileDescriptor.getEnumTypeList().forEach(enumType => {
            const entryName = `${scope ? scope + "." : ""}${enumType.getName()}`;
            this.enumMap[entryName] = {
                pkg: fileDescriptor.getPackage(),
                fileName: fileDescriptor.getName(),
                enumOptions: enumType.getOptions(),
            };
        });
    }

    getMessage(str: string): ExportMessageEntry | undefined {
        return this.messageMap[str];
    }

    getEnum(str: string): ExportEnumEntry | undefined {
        return this.enumMap[str];
    }
}