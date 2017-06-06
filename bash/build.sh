#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

cp -r src/lib/template ./build/lib

tsc -p tsconfig.json --watch