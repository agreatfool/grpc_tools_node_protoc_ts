// These imports are required for definitions to be properly loaded
import * as _1 from "google-protobuf/google/protobuf/compiler/plugin_pb";
import * as _2 from "google-protobuf/google/protobuf/descriptor_pb";

// This is a temporary fix due to @types/google-protobuf being out of date

declare module "google-protobuf/google/protobuf/compiler/plugin_pb" {
    export interface CodeGeneratorResponse {
        getSupportedFeatures(): number
        setSupportedFeatures(value: number): CodeGeneratorResponse
        hasSupportedFeatures(): boolean
        clearRequiredFeatures(): CodeGeneratorResponse
    }
    
    export namespace CodeGeneratorResponse {
        export enum Feature {
            FEATURE_NONE,
            FEATURE_PROTO3_OPTIONAL
        }
    }
}

declare module "google-protobuf/google/protobuf/descriptor_pb" {
    export interface FieldDescriptorProto {
        getProto3Optional(): boolean;
        setProto3Optional(value: boolean): FieldDescriptorProto;
        clearProto3Optional(): FieldDescriptorProto;
        hasProto3Optional(): boolean;
    }
}