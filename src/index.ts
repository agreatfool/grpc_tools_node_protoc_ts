/**
 * This is the ProtoC compiler plugin.
 *
 * It only accepts stdin/stdout output according to the protocol
 * specified in [plugin.proto](https://github.com/google/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto).
 */
import {ExportMap} from "./lib/ExportMap";
import {Utility} from "./lib/Utility";
import {CodeGeneratorRequest, CodeGeneratorResponse} from "google-protobuf/google/protobuf/compiler/plugin_pb";
import {FileDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";

import {ProtoMsgTsdFormatter} from "./lib/format/ProtoMsgTsdFormatter";
import {ProtoSvcTsdFormatter} from "./lib/format/ProtoSvcTsdFormatter";

Utility.withAllStdIn((inputBuff: Buffer) => {

    try {
        let typedInputBuff = new Uint8Array((inputBuff as any).length);
        //noinspection TypeScriptValidateTypes
        typedInputBuff.set(inputBuff);

        let codeGenRequest = CodeGeneratorRequest.deserializeBinary(typedInputBuff);
        let codeGenResponse = new CodeGeneratorResponse();
        let exportMap = new ExportMap();
        let fileNameToDescriptor: { [key: string]: FileDescriptorProto } = {};

        codeGenRequest.getProtoFileList().forEach(protoFileDescriptor => {
            fileNameToDescriptor[protoFileDescriptor.getName()] = protoFileDescriptor;
            exportMap.addFileDescriptor(protoFileDescriptor);
        });

        codeGenRequest.getFileToGenerateList().forEach(fileName => {
            // message part
            let msgFileName = Utility.filePathFromProtoWithoutExt(fileName);
            let msgTsdFile = new CodeGeneratorResponse.File();
            msgTsdFile.setName(msgFileName + ".d.ts");
            msgTsdFile.setContent(ProtoMsgTsdFormatter.format(fileNameToDescriptor[fileName], exportMap));
            codeGenResponse.addFile(msgTsdFile);

            // service part
            let fileDescriptorOutput = ProtoSvcTsdFormatter.format(fileNameToDescriptor[fileName], exportMap);
            if (fileDescriptorOutput != '') {
                let svcFileName = Utility.svcFilePathFromProtoWithoutExt(fileName);
                let svtTsdFile = new CodeGeneratorResponse.File();
                svtTsdFile.setName(svcFileName + ".d.ts");
                svtTsdFile.setContent(fileDescriptorOutput);
                codeGenResponse.addFile(svtTsdFile);
            }
        });

        process.stdout.write(new Buffer(codeGenResponse.serializeBinary()));
    } catch (err) {
        console.error("protoc-gen-ts error: " + err.stack + "\n");
        process.exit(1);
    }

});
