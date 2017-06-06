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
Utility_1.Utility.withAllStdIn((inputBuff) => {
    try {
        let typedInputBuff = new Uint8Array(inputBuff.length);
        //noinspection TypeScriptValidateTypes
        typedInputBuff.set(inputBuff);
        let codeGenRequest = plugin_pb_1.CodeGeneratorRequest.deserializeBinary(typedInputBuff);
        let codeGenResponse = new plugin_pb_1.CodeGeneratorResponse();
        let exportMap = new ExportMap_1.ExportMap();
        let fileNameToDescriptor = {};
        codeGenRequest.getProtoFileList().forEach(protoFileDescriptor => {
            fileNameToDescriptor[protoFileDescriptor.getName()] = protoFileDescriptor;
            exportMap.addFileDescriptor(protoFileDescriptor);
        });
        codeGenRequest.getFileToGenerateList().forEach(fileName => {
            // message part
            let msgFileName = Utility_1.Utility.filePathFromProtoWithoutExt(fileName);
            let msgTsdFile = new plugin_pb_1.CodeGeneratorResponse.File();
            msgTsdFile.setName(msgFileName + ".d.ts");
            msgTsdFile.setContent(ProtoMsgTsdFormatter_1.ProtoMsgTsdFormatter.format(fileNameToDescriptor[fileName], exportMap));
            codeGenResponse.addFile(msgTsdFile);
            // service part
            let fileDescriptorOutput = ProtoSvcTsdFormatter_1.ProtoSvcTsdFormatter.format(fileNameToDescriptor[fileName], exportMap);
            if (fileDescriptorOutput != '') {
                let svcFileName = Utility_1.Utility.svcFilePathFromProtoWithoutExt(fileName);
                let svtTsdFile = new plugin_pb_1.CodeGeneratorResponse.File();
                svtTsdFile.setName(svcFileName + ".d.ts");
                svtTsdFile.setContent(fileDescriptorOutput);
                codeGenResponse.addFile(svtTsdFile);
            }
        });
        process.stdout.write(new Buffer(codeGenResponse.serializeBinary()));
    }
    catch (err) {
        console.error("protoc-gen-ts error: " + err.stack + "\n");
        process.exit(1);
    }
});
//# sourceMappingURL=index.js.map