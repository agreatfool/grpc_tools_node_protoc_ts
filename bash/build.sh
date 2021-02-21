#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

rm -rf ./build
tsc -p tsconfig.json
cp -r src/lib/template ./build/lib
