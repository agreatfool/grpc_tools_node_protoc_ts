import {EnumDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";

export namespace EnumFormatter {

    export interface IEnumModel {
        indent: string;
        enumName: string;
        values: { [key: string]: number };
    }

    export function format(enumDescriptor: EnumDescriptorProto, indent: string): IEnumModel {
        const enumName = enumDescriptor.getName();
        const values: { [key: string]: number } = {};
        enumDescriptor.getValueList().forEach((value) => {
            values[value.getName().toUpperCase()] = value.getNumber();
        });

        return {
            indent,
            enumName,
            values,
        };
    }

}
