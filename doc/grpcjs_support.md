# @grpc/grpc-js support

## Changes
Current document is published along with grpc_tools_node_protoc_ts@5.0.0 and binds to [grpc-tools](https://www.npmjs.com/package/grpc-tools) version equal to or greater than `1.9.0`.

If you are still using grpc-tools version `1.8.1`, please read the doc of previous version: [doc/grpcjs_support.md@3.0.0](https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v3.0.0/doc/grpcjs_support.md).

## Difference between grpc-tools v1.8.1 and v1.9.0
Difference of codes generated from `grpc-tools` between v1.8.1 and v1.9.0:

Commands changed:
```bash
# v1.8.1
grpc_tools_node_protoc \
... \
--grpc_out=generate_package_definition:... \
...

# v1.9.0, new added option grpc_js
grpc_tools_node_protoc \
... \
--grpc_out=grpc_js:... \
...
```

Generated codes changed:
```javascript
'use strict';
+ var grpc = require('@grpc/grpc-js');
var book_pb = require('./book_pb.js');

- var BookServiceService = exports['com.book.BookService'] = {
+ var BookServiceService = exports.BookServiceService = {
  getBook: {
    // ...
  }
};

+ exports.BookServiceClient = grpc.makeGenericClientConstructor(BookServiceService);
```

As you can see:

* `@grpc/grpc-js` imported at beginning
* `exports['com.book.BookService']` changed to `exports.BookServiceService`
* `exports.BookServiceClient = grpc.makeGenericClientConstructor(BookServiceService);` added

This looks like traditional `grpc_tools_node_protoc ...  --plugin=protoc-gen-grpc=which grpc_tools_node_protoc_plugin`.

---

## Why
[@grpc/grpc-js](https://www.npmjs.com/package/@grpc/grpc-js) is a great project. it's pure js implementation, this makes it's easy to build docker images & cooperation with electron, etc.

Recently grpc-js has published it's `1.0.1` version, means it's no longer `beta`. So it's a good time to support it.

## Some information

* grpc: [github](https://github.com/grpc/grpc-node/tree/master/packages/grpc-native-core) | [npm](https://www.npmjs.com/package/grpc)
* grpc-js: [github](https://github.com/grpc/grpc-node/tree/master/packages/grpc-js) | [npm](https://www.npmjs.com/package/@grpc/grpc-js)
* [[question] How to generate `require('@grpc/grpc-js')` instead of `require('grpc')` #931](https://github.com/grpc/grpc-node/issues/931)
* [Add support for generate_package_definition #56](https://github.com/agreatfool/grpc_tools_node_protoc_ts/issues/56)
* [Broken typescript exports after moving to @grpc/grpc-js #1600](https://github.com/grpc/grpc-node/issues/1600)

## Migrating from [grpc](https://www.npmjs.com/package/grpc) to [@grpc/grpc-js](https://www.npmjs.com/package/@grpc/grpc-js)
### Code generation
Want to use grpc-js, [grpc-tools](https://www.npmjs.com/package/grpc-tools) version `1.9.0` is **REQUIRED**.

Change your bash script from:

```bash
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:./src/grpc/proto \
--grpc_out=./src/grpc/proto \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I ./proto \
proto/*.proto
```

to:

```bash
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:./src/grpcjs/proto \
--grpc_out=grpc_js:./src/grpcjs/proto \
-I ./proto \
proto/*.proto
```

`--plugin` is no longer necessary and add `grpc_js` in `--grpc-out`.

There are two generated files: 

* `*_pb.js`: Message codes have **NO** changes
* `*_grpc_pb.js`: Service codes have some changes

```js
- var grpc = require('grpc');
+ var grpc = require('@grpc/grpc-js');
```

* `grpc` is switched to `@grpc/grpc-js`

### Typings
grpc has it's official typings: [index.d.ts](https://github.com/grpc/grpc-node/blob/master/packages/grpc-native-core/index.d.ts). Also grpc-js has an official typings itself (it's not included in github's online source codes), it's in the dir `node_modules/@grpc/grpc-js/build/src/index.d.ts`, and online source codes may give some hint: [index.ts](https://github.com/grpc/grpc-node/blob/master/packages/grpc-js/src/index.ts).  

There are several differences between them:

All the `call`s in grpc-js has both request & response definition: `grpc.ServerUnaryCall<GetBookRequest, Book>` while grpc only needs the request part: `grpc.ServerUnaryCall<GetBookRequest>`. This is the biggest change.

And in version `1.0.1` grpc-js has two useful typings not exported in typings index, you need to manually import them:

```js
import {sendUnaryData} from "@grpc/grpc-js/build/src/server-call";
import {handleClientStreamingCall} from "@grpc/grpc-js/build/src/server-call";
```

I guess it shall be a bug, maybe would be fixed later.

### Usage
See full examples here:

* [server.ts](https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts)
* [client.ts](https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts)

Most changes:

**server.ts**

start server part, changed to async:

```typescript
// grpc
server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
server.start();

// =>

// grpc-js
server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        throw err;
    }
    server.start();
});
```

**client.ts**

client has no change.

## What [grpc_tools_node_protoc_ts](https://www.npmjs.com/package/grpc_tools_node_protoc_ts) changed 
`d.ts` generating bash script change, from:

```bash
grpc_tools_node_protoc \
--plugin=protoc-gen-ts=../bin/protoc-gen-ts \
--ts_out=./src/grpc/proto \
-I ./proto \
proto/*.proto
```

to:

```bash
grpc_tools_node_protoc \
--plugin=protoc-gen-ts=../bin/protoc-gen-ts \
--ts_out=grpc_js:./src/grpcjs/proto \
-I ./proto \
proto/*.proto
```

Add `grpc_js` in `--ts-out`, be consistent with grpc-js.

There is no changes in `*_pb.d.ts`, and some changes in `*_grpc_pb.d.ts`:

```typescript
- import * as grpc from "grpc";

+ import * as grpc from "@grpc/grpc-js";
+ import {handleClientStreamingCall} from "@grpc/grpc-js/build/src/server-call";

export interface IBookServiceServer {
    getBook: grpc.handleUnaryCall<book_pb.GetBookRequest, book_pb.Book>;
    getBooksViaAuthor: grpc.handleServerStreamingCall<book_pb.GetBookViaAuthor, book_pb.Book>;
-    getGreatestBook: grpc.handleClientStreamingCall<book_pb.GetBookRequest, book_pb.Book>;
+    getGreatestBook: handleClientStreamingCall<book_pb.GetBookRequest, book_pb.Book>;
    getBooks: grpc.handleBidiStreamingCall<book_pb.GetBookRequest, book_pb.Book>;
}
```

That's all.

If you are still using grpc, just do nothing, new version would not affect existing grpc users.
