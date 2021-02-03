NPM := npm
FLAG := run

INPUT_DIR := ${realpath src/protos}
OUTPUT_DIR := ${realpath src/typedefs}
FIND_FILE := ${wildcard ${OUTPUT_DIR}/*.ts}
GRPC_TOOLS = npx grpc_tools_node_protoc
PROTOC_GEN_TS_PATH_WINDOWS := ${realpath node_modules/.bin/protoc-gen-ts.cmd}
PROTOC_GEN_TS_PATH_LINMAC := ${realpath node_modules/.bin/protoc-gen-ts}

###############################
## RUNNING PROD APP ENVIRONMENT
################################

prod:

ifdef type
	${NPM} ${FLAG} ${type}:start
endif

###############################
## RUNNING DEV APP ENVIRONMENT
################################

dev:

ifdef type
	${NPM} ${FLAG} ${type}:dev
endif

###############################
## GITHUB AUTOMATION
################################

GIT := git

gh: add.o commit.o push.o

add.o:
	${GIT} add .

commit.o:

ifdef msg
	${GIT} commit -m ${msg}
endif

push.o:
	${GIT} push origin main

#################################################################################
##===============================================================================
## GENERATE PROTO FILE FOR WINDOWS USING grpc_tools_node_protoc FOR @grpc/grpc-js
##===============================================================================
#################################################################################

grpcwin:
ifneq (${FIND_FILE}, )
#remove old all file typedefs
	rm ${OUTPUT_DIR}/**.{ts,js}

#generate protofile typedefs
	${shell exec} ${GRPC_TOOLS} \
	--plugin=protoc-gen-ts=${PROTOC_GEN_TS_PATH_WINDOWS} \
	--grpc_out=grpc_js:${OUTPUT_DIR} \
	--js_out=import_style=commonjs,binary:${OUTPUT_DIR} \
	--ts_out=grpc_js:${OUTPUT_DIR} \
	--proto_path ${INPUT_DIR} ${INPUT_DIR}/*.proto
else
#generate protofile typedefs if file not exist
	${shell exec} ${GRPC_TOOLS} \
	--plugin=protoc-gen-ts=${PROTOC_GEN_TS_PATH_WINDOWS} \
	--grpc_out=grpc_js:${OUTPUT_DIR} \
	--js_out=import_style=commonjs,binary:${OUTPUT_DIR} \
	--ts_out=grpc_js:${OUTPUT_DIR} \
	--proto_path ${INPUT_DIR} ${INPUT_DIR}/*.proto
endif

####################################################################################
##==================================================================================
## GENERATE PROTO FILE FOR LINUX/MAC USING grpc_tools_node_protoc FOR @grpc/grpc-js
##==================================================================================
####################################################################################

grpclinmac:
ifneq (${FIND_FILE}, )
#remove old all file typedefs
	rm ${OUTPUT_DIR}/**.{ts,js}

#generate protofile typedefs
	${shell exec} ${GRPC_TOOLS} \
	--plugin=protoc-gen-ts=${PROTOC_GEN_TS_PATH_LINMAC} \
	--grpc_out=grpc_js:${OUTPUT_DIR} \
	--js_out=import_style=commonjs,binary:${OUTPUT_DIR} \
	--ts_out=grpc_js:${OUTPUT_DIR} \
	--proto_path ${INPUT_DIR} ${INPUT_DIR}/*.proto
else
#generate protofile typedefs if file not exist
	${shell exec} ${GRPC_TOOLS} \
	--plugin=protoc-gen-ts=${PROTOC_GEN_TS_PATH_LINMAC} \
	--grpc_out=grpc_js:${OUTPUT_DIR} \
	--js_out=import_style=commonjs,binary:${OUTPUT_DIR} \
	--ts_out=grpc_js:${OUTPUT_DIR} \
	--proto_path ${INPUT_DIR} ${INPUT_DIR}/*.proto
endif


###############################
## BUILD AUTOMATION
################################

build:
	${NPM} ${FLAG} build

###############################
## BUILD AUTOMATION AND LINT FIX
################################

buildfix: linfix.o  build.o

linfix.o:

	${NPM} ${FLAG} lint:fix

build.o:
	${NPM} ${FLAG} build