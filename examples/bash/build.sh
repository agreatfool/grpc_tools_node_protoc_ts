#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

mkdir -p ./src/grpc/proto
mkdir -p ./src/grpcjs/proto

# grpc
# JavaScript code generating
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:./src/grpc/proto \
--grpc_out=./src/grpc/proto \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I ./proto \
proto/*.proto

grpc_tools_node_protoc \
--plugin=protoc-gen-ts=../bin/protoc-gen-ts \
--ts_out=./src/grpc/proto \
-I ./proto \
proto/*.proto

# grpc-js
# JavaScript code generating
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:./src/grpcjs/proto \
--grpc_out=generate_package_definition:./src/grpcjs/proto \
-I ./proto \
proto/*.proto

grpc_tools_node_protoc \
--plugin=protoc-gen-ts=../bin/protoc-gen-ts \
--ts_out=generate_package_definition:./src/grpcjs/proto \
-I ./proto \
proto/*.proto

# TypeScript compiling
mkdir -p build/grpc/proto
cp -r ./src/grpc/proto/* build/grpc/proto

mkdir -p build/grpcjs/proto
cp -r ./src/grpcjs/proto/* build/grpcjs/proto

tsc
