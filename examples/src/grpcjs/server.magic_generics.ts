#!/usr/bin/env node

import * as debug from "debug";
import * as grpc from "@grpc/grpc-js";

import {BookServiceService, IBookServiceServer} from "./proto/book_grpc_pb";
import { Book, GetBookRequest, GetBookViaAuthor } from "./proto/book_pb";

const log = debug("SampleServer");

type KnownKeys<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends { [_ in keyof T]: infer U } ? U : never;

type KnownOnly<T extends Record<any, any>> = Pick<T, KnownKeys<T>>;

type ITypedBookServer = KnownOnly<IBookServiceServer>;

class TypedServerOverride extends grpc.Server {
    public addTypedService<TypedServiceImplementation extends Record<any, any>>(
      service: grpc.ServiceDefinition, implementation: TypedServiceImplementation,
    ): void {
        this.addService(service, implementation);
    }
}

// tslint:disable-next-line:max-classes-per-file
class ServerImpl implements ITypedBookServer {
    public attr: string;

    constructor(attr: string) {
        this.attr = attr;
    }

    public getBook(call: grpc.ServerUnaryCall<GetBookRequest, Book>, callback: grpc.sendUnaryData<Book>): void {
        const book = new Book();

        book.setTitle("DefaultBook");
        book.setAuthor("DefaultAuthor");

        log(`[getBook] Done: ${JSON.stringify(book.toObject())}`);
        callback(null, book);
    }

    public getBooks(call: grpc.ServerDuplexStream<GetBookRequest, Book>): void {
        call.on("data", (request: GetBookRequest) => {
            const reply = new Book();
            reply.setTitle(`Book${request.getIsbn()}`);
            reply.setAuthor(`Author${request.getIsbn()}`);
            reply.setIsbn(request.getIsbn());
            log(`[getBooks] Write: ${JSON.stringify(reply.toObject())}`);
            call.write(reply);
        });
        call.on("end", () => {
            log("[getBooks] Done.");
            call.end();
        });
    }

    public getBooksViaAuthor(call: grpc.ServerWritableStream<GetBookViaAuthor, Book>): void {
        log(`[getBooksViaAuthor] Request: ${JSON.stringify(call.request.toObject())}`);
        for (let i = 1; i <= 10; i++) {
            const reply = new Book();
            reply.setTitle(`Book${i}`);
            reply.setAuthor(call.request.getAuthor());
            reply.setIsbn(i);
            log(`[getBooksViaAuthor] Write: ${JSON.stringify(reply.toObject())}`);
            call.write(reply);
        }
        log("[getBooksViaAuthor] Done.");
        call.end();
    }

    public getGreatestBook(call: grpc.ServerReadableStream<GetBookRequest, Book>, callback: grpc.sendUnaryData<Book>): void {
        let lastOne: GetBookRequest;
        call.on("data", (request: GetBookRequest) => {
            log(`[getGreatestBook] Request: ${JSON.stringify(request.toObject())}`);
            lastOne = request;
        });
        call.on("end", () => {
            const reply = new Book();
            reply.setIsbn(lastOne.getIsbn());
            reply.setTitle("LastOne");
            reply.setAuthor("LastOne");
            log(`[getGreatestBook] Done: ${JSON.stringify(reply.toObject())}`);
            callback(null, reply);
        });
    }
}

function startServer() {
    const server = new TypedServerOverride();

    server.addTypedService<ITypedBookServer>(BookServiceService, new ServerImpl("hello world"));
    server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            throw err;
        }
        log(`Server started, listening: 127.0.0.1:${port}`);
        server.start();
    });
}

startServer();

process.on("uncaughtException", (err) => {
    log(`process on uncaughtException error: ${err}`);
});

process.on("unhandledRejection", (err) => {
    log(`process on unhandledRejection error: ${err}`);
});
