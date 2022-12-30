@echo off

setlocal

cd "%~dp0"
node.exe -e "var LibPath = require('path'); require(LibPath.join(__dirname, '../build/index'));"

endlocal
