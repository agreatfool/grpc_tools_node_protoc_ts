import {FileDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {ExportMap} from "../ExportMap";
import {Utility} from "../Utility";
import {WellKnownTypesMap} from "../WellKnown";
import {TplEngine} from "../TplEngine";
import {MessageFormatter} from "./partial/MessageFormatter";
import {ExtensionFormatter} from "./partial/ExtensionFormatter";
import {EnumFormatter} from "./partial/EnumFormatter";
import {DependencyFilter} from "../DependencyFilter";

export namespace ProtoMsgTsdFormatter {

    export interface ProtoMsgTsdModel {
        packageName: string;
        fileName: string;
        imports: string[];
        messages: MessageFormatter.MessageModel[];
        extensions: ExtensionFormatter.ExtensionModel[];
        enums: EnumFormatter.EnumModel[];
    }

    export function format(descriptor: FileDescriptorProto, exportMap: ExportMap): ProtoMsgTsdModel {
        let fileName = descriptor.getName();
        let packageName = descriptor.getPackage();

        let imports: Array<string> = [];
        let messages: Array<MessageFormatter.MessageModel> = [];
        let extensions: Array<ExtensionFormatter.ExtensionModel> = [];
        let enums: Array<EnumFormatter.EnumModel> = [];

        let upToRoot = Utility.getPathToRoot(fileName);

        imports.push(`import * as jspb from "google-protobuf";`);
        descriptor.getDependencyList().forEach((dependency: string) => {
            if (DependencyFilter.indexOf(dependency) !== -1) {
                return; // filtered
            }
            let pseudoNamespace = Utility.filePathToPseudoNamespace(dependency);
            if (dependency in WellKnownTypesMap) {
                imports.push(`import * as ${pseudoNamespace} from "${WellKnownTypesMap[dependency]}";`);
            } else {
                let filePath = Utility.filePathFromProtoWithoutExt(dependency);
                imports.push(`import * as ${pseudoNamespace} from "${upToRoot}${filePath}";`);
            }
        });

        descriptor.getMessageTypeList().forEach(enumType => {
            messages.push(MessageFormatter.format(fileName, exportMap, enumType, "", descriptor));
        });
        descriptor.getExtensionList().forEach(extension => {
            extensions.push(ExtensionFormatter.format(fileName, exportMap, extension, ""));
        });
        descriptor.getEnumTypeList().forEach(enumType => {
            enums.push(EnumFormatter.format(enumType, ""));
        });

        return {
            packageName: packageName,
            fileName: fileName,
            imports: imports,
            messages: messages,
            extensions: extensions,
            enums: enums,
        };
    }

}