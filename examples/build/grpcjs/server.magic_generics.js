#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const grpc = require("@grpc/grpc-js");
const book_grpc_pb_1 = require("./proto/book_grpc_pb");
const book_pb_1 = require("./proto/book_pb");
const log = debug("SampleServer");
class TypedServerOverride extends grpc.Server {
    addTypedService(service, implementation) {
        this.addService(service, implementation);
    }
}
// tslint:disable-next-line:max-classes-per-file
class ServerImpl {
    constructor(attr) {
        this.attr = attr;
    }
    getBook(call, callback) {
        const book = new book_pb_1.Book();
        book.setTitle("DefaultBook");
        book.setAuthor("DefaultAuthor");
        log(`[getBook] Done: ${JSON.stringify(book.toObject())}`);
        callback(null, book);
    }
    getBooks(call) {
        call.on("data", (request) => {
            const reply = new book_pb_1.Book();
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
    getBooksViaAuthor(call) {
        log(`[getBooksViaAuthor] Request: ${JSON.stringify(call.request.toObject())}`);
        for (let i = 1; i <= 10; i++) {
            const reply = new book_pb_1.Book();
            reply.setTitle(`Book${i}`);
            reply.setAuthor(call.request.getAuthor());
            reply.setIsbn(i);
            log(`[getBooksViaAuthor] Write: ${JSON.stringify(reply.toObject())}`);
            call.write(reply);
        }
        log("[getBooksViaAuthor] Done.");
        call.end();
    }
    getGreatestBook(call, callback) {
        let lastOne;
        call.on("data", (request) => {
            log(`[getGreatestBook] Request: ${JSON.stringify(request.toObject())}`);
            lastOne = request;
        });
        call.on("end", () => {
            const reply = new book_pb_1.Book();
            reply.setIsbn(lastOne.getIsbn());
            reply.setTitle("LastOne");
            reply.setAuthor("LastOne");
            log(`[getGreatestBook] Done: ${JSON.stringify(reply.toObject())}`);
            callback(null, reply);
        });
    }
    getBookList(call, callback) {
        const author = call.request.getAuthor();
        const books = new book_pb_1.BookList();
        const book1 = new book_pb_1.Book();
        book1.setTitle("DefaultBook1").setAuthor(author);
        const book2 = new book_pb_1.Book();
        book2.setTitle("DefaultBook2").setAuthor(author);
        books.addBooks(book1);
        books.addBooks(book2);
        log(`[getBookList] Done: 1: ${JSON.stringify(book1.toObject())}, 2: ${JSON.stringify(book2.toObject())}`);
        callback(null, books);
    }
}
function startServer() {
    const server = new TypedServerOverride();
    server.addTypedService(book_grpc_pb_1.BookServiceService, new ServerImpl("hello world"));
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
//# sourceMappingURL=server.magic_generics.js.map