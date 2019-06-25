import {FieldDescriptorProto, OneofDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {TplEngine} from "../../TplEngine";
import {Utility} from "../../Utility";

export namespace OneofFormatter {

    export interface OneofModel {
        indent: string;
        oneofName: string;
        oneofNameUpper: string;
        fields: { [key: string]: number };
    }

    export function format(oneofDecl: OneofDescriptorProto,
                           oneofFields: Array<FieldDescriptorProto>,
                           indent: string): OneofModel {

        let oneofName = Utility.oneOfName(oneofDecl.getName());
        let oneofNameUpper = oneofName.toUpperCase();
        let fields: { [key: string]: number } = {};

        oneofFields.forEach(field => {
            fields[field.getName().toUpperCase()] = field.getNumber();
        });

        return {
            indent,
            oneofName: oneofName,
            oneofNameUpper: oneofNameUpper,
            fields: fields,
        };

    }

}