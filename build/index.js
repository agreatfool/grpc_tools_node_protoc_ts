"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is the ProtoC compiler plugin.
 *
 * It only accepts stdin/stdout output according to the protocol
 * specified in [plugin.proto](https://github.com/google/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto).
 */
const ExportMap_1 = require("./lib/ExportMap");
const Utility_1 = require("./lib/Utility");
const plugin_pb_1 = require("google-protobuf/google/protobuf/compiler/plugin_pb");
const ProtoMsgTsdFormatter_1 = require("./lib/format/ProtoMsgTsdFormatter");
const ProtoSvcTsdFormatter_1 = require("./lib/format/ProtoSvcTsdFormatter");
const TplEngine_1 = require("./lib/TplEngine");
Utility_1.Utility.withAllStdIn((inputBuff) => {
    try {
        const typedInputBuff = new Uint8Array(inputBuff.length);
        typedInputBuff.set(inputBuff);
        const codeGenRequest = plugin_pb_1.CodeGeneratorRequest.deserializeBinary(typedInputBuff);
        const codeGenResponse = new plugin_pb_1.CodeGeneratorResponse();
        const exportMap = new ExportMap_1.ExportMap();
        const fileNameToDescriptor = {};
        codeGenResponse.setSupportedFeatures(plugin_pb_1.CodeGeneratorResponse.Feature.FEATURE_PROTO3_OPTIONAL);
        const isGrpcJs = ["generate_package_definition", "grpc_js"].indexOf(codeGenRequest.getParameter()) !== -1;
        codeGenRequest.getProtoFileList().forEach((protoFileDescriptor) => {
            fileNameToDescriptor[protoFileDescriptor.getName()] = protoFileDescriptor;
            exportMap.addFileDescriptor(protoFileDescriptor);
        });
        codeGenRequest.getFileToGenerateList().forEach((fileName) => {
            // message part
            const msgFileName = Utility_1.Utility.filePathFromProtoWithoutExt(fileName);
            const msgTsdFile = new plugin_pb_1.CodeGeneratorResponse.File();
            msgTsdFile.setName(msgFileName + ".d.ts");
            const msgModel = ProtoMsgTsdFormatter_1.ProtoMsgTsdFormatter.format(fileNameToDescriptor[fileName], exportMap);
            msgTsdFile.setContent(TplEngine_1.TplEngine.render("msg_tsd", msgModel));
            codeGenResponse.addFile(msgTsdFile);
            // service part
            const fileDescriptorModel = ProtoSvcTsdFormatter_1.ProtoSvcTsdFormatter.format(fileNameToDescriptor[fileName], exportMap, isGrpcJs);
            if (fileDescriptorModel != null) {
                const svcFileName = Utility_1.Utility.svcFilePathFromProtoWithoutExt(fileName);
                const svtTsdFile = new plugin_pb_1.CodeGeneratorResponse.File();
                svtTsdFile.setName(svcFileName + ".d.ts");
                svtTsdFile.setContent(TplEngine_1.TplEngine.render("svc_tsd", fileDescriptorModel));
                codeGenResponse.addFile(svtTsdFile);
            }
        });
        process.stdout.write(Buffer.from(codeGenResponse.serializeBinary()));
    }
    catch (err) {
        console.error("protoc-gen-ts error: " + err.stack + "\n");
        process.exit(1);
    }
});
//# sourceMappingURL=index.js.map