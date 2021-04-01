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
import {TplEngine} from "./lib/TplEngine";

Utility.withAllStdIn((inputBuff: Buffer) => {

    try {
        const typedInputBuff = new Uint8Array((inputBuff as any).length);
        typedInputBuff.set(inputBuff);

        const codeGenRequest = CodeGeneratorRequest.deserializeBinary(typedInputBuff);
        const codeGenResponse = new CodeGeneratorResponse();
        const exportMap = new ExportMap();
        const fileNameToDescriptor: { [key: string]: FileDescriptorProto } = {};

        codeGenResponse.setSupportedFeatures(CodeGeneratorResponse.Feature.FEATURE_PROTO3_OPTIONAL);

        const isGrpcJs = ["generate_package_definition", "grpc_js"].indexOf(codeGenRequest.getParameter()) !== -1;

        codeGenRequest.getProtoFileList().forEach((protoFileDescriptor) => {
            fileNameToDescriptor[protoFileDescriptor.getName()] = protoFileDescriptor;
            exportMap.addFileDescriptor(protoFileDescriptor);
        });

        codeGenRequest.getFileToGenerateList().forEach((fileName) => {
            // message part
            const msgFileName = Utility.filePathFromProtoWithoutExt(fileName);
            const msgTsdFile = new CodeGeneratorResponse.File();
            msgTsdFile.setName(msgFileName + ".d.ts");
            const msgModel = ProtoMsgTsdFormatter.format(fileNameToDescriptor[fileName], exportMap);
            msgTsdFile.setContent(TplEngine.render("msg_tsd", msgModel));
            codeGenResponse.addFile(msgTsdFile);

            // service part
            const fileDescriptorModel = ProtoSvcTsdFormatter.format(fileNameToDescriptor[fileName], exportMap, isGrpcJs);
            if (fileDescriptorModel != null) {
                const svcFileName = Utility.svcFilePathFromProtoWithoutExt(fileName);
                const svtTsdFile = new CodeGeneratorResponse.File();
                svtTsdFile.setName(svcFileName + ".d.ts");
                svtTsdFile.setContent(TplEngine.render("svc_tsd", fileDescriptorModel));
                codeGenResponse.addFile(svtTsdFile);
            }
        });

        process.stdout.write(Buffer.from(codeGenResponse.serializeBinary()));
    } catch (err) {
        console.error("protoc-gen-ts error: " + err.stack + "\n");
        process.exit(1);
    }

});
