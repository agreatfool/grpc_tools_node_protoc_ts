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

    export function format(descriptor: FileDescriptorProto, exportMap: ExportMap): string {
        let fileName = descriptor.getName();
        let packageName = descriptor.getPackage();

        let imports: Array<string> = [];
        let messages: Array<string> = [];
        let extensions: Array<string> = [];
        let enums: Array<string> = [];

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
            messages.push(MessageFormatter.format(fileName, exportMap, enumType, 0, descriptor));
        });
        descriptor.getExtensionList().forEach(extension => {
            extensions.push(ExtensionFormatter.format(fileName, exportMap, extension, 0));
        });
        descriptor.getEnumTypeList().forEach(enumType => {
            enums.push(EnumFormatter.format(enumType, 0));
        });

        return TplEngine.render('msg_tsd', {
            packageName: packageName,
            fileName: fileName,
            imports: imports,
            messages: messages,
            extensions: extensions,
            enums: enums,
        });
    }

}