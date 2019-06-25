import {EnumDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {TplEngine} from "../../TplEngine";
import {Utility} from "../../Utility";

export namespace EnumFormatter {

    export interface EnumModel {
        indent: string;
        enumName: string;
        values: { [key: string]: number };
    }

    export function format(enumDescriptor: EnumDescriptorProto, indent: string): EnumModel {
        let enumName = enumDescriptor.getName();
        let values: { [key: string]: number } = {};
        enumDescriptor.getValueList().forEach(value => {
            values[value.getName().toUpperCase()] = value.getNumber();
        });

        return {
            indent,
            enumName: enumName,
            values: values,
        };
    }

}