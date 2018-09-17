"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExportMap {
    constructor() {
        this.messageMap = {};
        this.enumMap = {};
    }
    exportNested(scope, fileDescriptor, message) {
        const messageEntry = {
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
    addFileDescriptor(fileDescriptor) {
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
    getMessage(str) {
        return this.messageMap[str];
    }
    getEnum(str) {
        return this.enumMap[str];
    }
}
exports.ExportMap = ExportMap;
//# sourceMappingURL=ExportMap.js.map