#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../../

DEBUG=* node ./build/grpcjs/server.js
