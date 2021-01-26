# @grpc/grpc-js server implementation signature issue

## Status
Issue: [Issue#79](https://github.com/agreatfool/grpc_tools_node_protoc_ts/issues/79).

This one is fixed in version `v5.1.0`, and there should be some document to explain more.

## Issue
If you are using this tool of version `v5.0.1`, you may have already noticed a signature issue here: [examples/src/grpcjs/server.ts#L74-L75](https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.1/examples/src/grpcjs/server.ts#L74-L75). Note the `// @ts-ignore`:

```typescript
// @ts-ignore
server.addService(BookServiceService, new ServerImpl());
```

The signature of implementation class looks like:

```typescript
export const BookServiceService: IBookServiceService;

export interface IBookServiceServer {
  getBook: grpc.handleUnaryCall<book_pb.GetBookRequest, book_pb.Book>;
  getBooksViaAuthor: grpc.handleServerStreamingCall<book_pb.GetBookViaAuthor, book_pb.Book>;
  getGreatestBook: handleClientStreamingCall<book_pb.GetBookRequest, book_pb.Book>;
  getBooks: grpc.handleBidiStreamingCall<book_pb.GetBookRequest, book_pb.Book>;
}

class ServerImpl implements IBookServiceServer {
}
```

The signature of `addService` is:

```typescript
export class Server {
  addService(
    service: ServiceDefinition,
    implementation: UntypedServiceImplementation
  ): void {}
}
```

As you can see the type of implementation need to be `UntypedServiceImplementation`. So it's inconsistent.

## Fixing
The way of fixing is to define IBookServiceServer to extends `UntypedServiceImplementation`.

```typescript
export interface IBookServiceServer extends grpc.UntypedServiceImplementation {
}
```

Though this fixing solved the issue of signature issue here (the original one):

```typescript
// @ts-ignore
server.addService(BookServiceService, new ServerImpl());
```

It brings the new issue. 

Because `UntypedServiceImplementation` is defined like:

```typescript
export interface UntypedServiceImplementation {
  [name: string]: UntypedHandleCall;
}
```

This means all the attributes inside the `UntypedServiceImplementation` (and any derived implementation, like `class ServerImpl implements IBookServiceServer extends grpc.UntypedServiceImplementation`) have to be type of `UntypedHandleCall`.

So when you define a class to implement `IBookServiceServer`, you have to add a line of code, like:

```typescript
class Impl implements IBookServiceServer {
    [name: string]: grpc.UntypedHandleCall;
}
```

Otherwise, tsc would throw errors: [Typescript: Index signature is missing in type](https://stackoverflow.com/questions/37006008/typescript-index-signature-is-missing-in-type).

## Implementation
According to this breaking change, there could be two styles of server side implementation. One is `Object style`, the other is `Class style`.

### Object Style

```typescript
const Impl: IBookServiceServer = {
    getBook: (call: grpc.ServerUnaryCall<GetBookRequest, Book>, callback: sendUnaryData<Book>): void => {},

    getBooks: (call: grpc.ServerDuplexStream<GetBookRequest, Book>): void => {},

    getBooksViaAuthor: (call: grpc.ServerWritableStream<GetBookViaAuthor, Book>): void => {},

    getGreatestBook: (call: grpc.ServerReadableStream<GetBookRequest, Book>, callback: sendUnaryData<Book>): void => {},
};

const server = new grpc.Server();
server.addService(BookServiceService, Impl);
```

This style is `recommended`. Since you can append more attributes in the `Impl` object, though they are not defined in `IBookServiceServer`, and you don't need to add `[name: string]: grpc.UntypedHandleCall` in your codes.

### Class Style

```typescript
class Impl implements IBookServiceServer {
    [name: string]: grpc.UntypedHandleCall;

    public getBook(call: grpc.ServerUnaryCall<GetBookRequest, Book>, callback: sendUnaryData<Book>): void {}

    public getBooks(call: grpc.ServerDuplexStream<GetBookRequest, Book>) {}

    public getBooksViaAuthor(call: grpc.ServerWritableStream<GetBookViaAuthor, Book>) {}

    public getGreatestBook(call: grpc.ServerReadableStream<GetBookRequest, Book>, callback: sendUnaryData<Book>) {}
}

const server = new grpc.Server();
server.addService(BookServiceService, new Impl());
```

This style is `NOT` recommended. Since only those already defined in the `IBookServiceServer` can be existing in this `Impl` class, and `[name: string]: grpc.UntypedHandleCall` is required for Class style.