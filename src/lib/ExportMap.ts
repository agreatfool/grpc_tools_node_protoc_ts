import {
    DescriptorProto,
    EnumOptions,
    FieldDescriptorProto,
    FileDescriptorProto,
    MessageOptions,
} from "google-protobuf/google/protobuf/descriptor_pb";
import Type = FieldDescriptorProto.Type;

export interface IExportMessageEntry {
    pkg: string;
    fileName: string;
    messageOptions: MessageOptions;
    mapFieldOptions?: {
        key: [Type, string],    // Type, StringTypeName
        value: [Type, string],  // Type, StringTypeName
    };
}

export interface IExportEnumEntry {
    pkg: string;
    fileName: string;
    enumOptions: EnumOptions;
}

export class ExportMap {
    protected messageMap: { [key: string]: IExportMessageEntry } = {};
    protected enumMap: { [key: string]: IExportEnumEntry } = {};

    public exportNested(scope: string, fileDescriptor: FileDescriptorProto, message: DescriptorProto) {
        const messageEntry: IExportMessageEntry = {
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

        message.getNestedTypeList().forEach((nested) => {
            this.exportNested(entryName, fileDescriptor, nested);
        });

        message.getEnumTypeList().forEach((enumType) => {
            const identifier = entryName + "." + enumType.getName();
            this.enumMap[identifier] = {
                pkg: fileDescriptor.getPackage(),
                fileName: fileDescriptor.getName(),
                enumOptions: enumType.getOptions(),
            };
        });
    }

    public addFileDescriptor(fileDescriptor: FileDescriptorProto) {
        const scope = fileDescriptor.getPackage();
        fileDescriptor.getMessageTypeList().forEach((messageType) => {
            this.exportNested(scope, fileDescriptor, messageType);
        });

        fileDescriptor.getEnumTypeList().forEach((enumType) => {
            const entryName = `${scope ? scope + "." : ""}${enumType.getName()}`;
            this.enumMap[entryName] = {
                pkg: fileDescriptor.getPackage(),
                fileName: fileDescriptor.getName(),
                enumOptions: enumType.getOptions(),
            };
        });
    }

    public getMessage(str: string): IExportMessageEntry | undefined {
        return this.messageMap[str];
    }

    public getEnum(str: string): IExportEnumEntry | undefined {
        return this.enumMap[str];
    }
}
