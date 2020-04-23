import {FieldDescriptorProto, OneofDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {Utility} from "../../Utility";

export namespace OneofFormatter {

    export interface IOneofModel {
        indent: string;
        oneofName: string;
        oneofNameUpper: string;
        fields: { [key: string]: number };
    }

    export function format(oneofDecl: OneofDescriptorProto,
                           oneofFields: FieldDescriptorProto[],
                           indent: string): IOneofModel {

        const oneofName = Utility.oneOfName(oneofDecl.getName());
        const oneofNameUpper = oneofDecl.getName().toUpperCase();
        const fields: { [key: string]: number } = {};

        oneofFields.forEach((field) => {
            fields[field.getName().toUpperCase()] = field.getNumber();
        });

        return {
            indent,
            oneofName,
            oneofNameUpper,
            fields,
        };

    }

}
