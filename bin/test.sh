#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

PROTO_DEST=./proto
BUILD_DEST=./proto

mkdir -p ${PROTO_DEST}

grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:./ \
--grpc_out=./ \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
proto/*.proto

protoc \
--plugin=protoc-gen-ts=./bin/protoc-gen-ts \
--ts_out=service=true:${PROTO_DEST} \
-I ./proto \
proto/*.proto