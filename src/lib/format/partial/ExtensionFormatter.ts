import {FieldDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {TplEngine} from "../../TplEngine";
import {Utility} from "../../Utility";
import {ExportMap} from "../../ExportMap";
import {FieldTypesFormatter} from "./FieldTypesFormatter";

export namespace ExtensionFormatter {

    export interface ExtensionModel {
        indent: string,
        extensionName: string,
        fieldType: string,
    }

    export function format(fileName: string,
                           exportMap: ExportMap,
                           extension: FieldDescriptorProto,
                           indent: string): ExtensionModel {

        let extensionName = Utility.snakeToCamel(extension.getName());
        let fieldType = FieldTypesFormatter.getFieldType(
            extension.getType(), extension.getTypeName().slice(1), fileName, exportMap
        );

        return {
            indent,
            extensionName: extensionName,
            fieldType: fieldType,
        };
    }

}