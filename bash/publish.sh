#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

cp -r src/lib/template ./build/lib
git add .
git commit -m "Update."

npm version patch
npm publish
git push origin master --verbose