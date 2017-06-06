import {FieldDescriptorProto, OneofDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";
import {TplEngine} from "../../TplEngine";
import {Utility} from "../../Utility";

export namespace OneofFormatter {

    export function format(oneofDecl: OneofDescriptorProto,
                           oneofFields: Array<FieldDescriptorProto>,
                           indentLevel: number): string {

        let oneofName = Utility.oneOfName(oneofDecl.getName());
        let oneofNameUpper = oneofName.toUpperCase();
        let fields: { [key: string]: number } = {};

        oneofFields.forEach(field => {
            fields[field.getName().toUpperCase()] = field.getNumber();
        });

        return TplEngine.render('partial/oneof', {
            indent: Utility.generateIndent(indentLevel),
            oneofName: oneofName,
            oneofNameUpper: oneofNameUpper,
            fields: fields,
        });

    }

}