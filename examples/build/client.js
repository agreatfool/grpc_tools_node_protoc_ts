#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const grpc = require("grpc");
const book_grpc_pb_1 = require("./proto/book_grpc_pb");
const book_pb_1 = require("./proto/book_pb");
const log = debug("SampleClient");
const client = new book_grpc_pb_1.BookServiceClient("127.0.0.1:50051", grpc.credentials.createInsecure());
const getBook = (isbn) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const request = new book_pb_1.GetBookRequest();
        request.setIsbn(isbn);
        log(`[getBook] Request: ${JSON.stringify(request.toObject())}`);
        client.getBook(request, (err, book) => {
            if (err != null) {
                debug(`[getBook] err:\nerr.message: ${err.message}\nerr.stack:\n${err.stack}`);
                reject(err);
                return;
            }
            log(`[getBook] Book: ${JSON.stringify(book.toObject())}`);
            resolve(book);
        });
    });
});
const getBooks = () => {
    return new Promise((resolve) => {
        const stream = client.getBooks();
        stream.on("data", (data) => {
            log(`[getBooks] Book: ${JSON.stringify(data.toObject())}`);
        });
        stream.on("end", () => {
            log("[getBooks] Done.");
            resolve();
        });
        for (let i = 0; i < 10; i++) {
            const req = new book_pb_1.GetBookRequest();
            req.setIsbn(i);
            log(`[getBooks] Request: ${JSON.stringify(req.toObject())}`);
            stream.write(req);
        }
        stream.end();
    });
};
const getBooksViaAuthor = (author) => {
    return new Promise((resolve) => {
        const request = new book_pb_1.GetBookViaAuthor();
        request.setAuthor(author);
        log(`[getBooksViaAuthor] Request: ${JSON.stringify(request.toObject())}`);
        const stream = client.getBooksViaAuthor(request);
        stream.on("data", (data) => {
            log(`[getBooksViaAuthor] Book: ${JSON.stringify(data.toObject())}`);
        });
        stream.on("end", () => {
            log("[getBooksViaAuthor] Done.");
            resolve();
        });
    });
};
const getGreatestBook = () => {
    return new Promise((resolve) => {
        const stream = client.getGreatestBook((err, data) => {
            if (err != null) {
                log(`[getGreatestBook] err:\nerr.message: ${err.message}\nerr.stack:\n${err.stack}`);
            }
            log(`[getGreatestBook] Book: ${JSON.stringify(data.toObject())}`);
            resolve();
        });
        for (let i = 0; i < 10; i++) {
            const req = new book_pb_1.GetBookRequest();
            req.setIsbn(i);
            log(`[getGreatestBook] Request: ${JSON.stringify(req.toObject())}`);
            stream.write(req);
        }
        stream.end();
    });
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield getBook(1);
        yield getBooks();
        yield getBooksViaAuthor("DefaultAuthor");
        yield getGreatestBook();
    });
}
main().then((_) => _);
process.on("uncaughtException", (err) => {
    log(`process on uncaughtException error: ${err}`);
});
process.on("unhandledRejection", (err) => {
    log(`process on unhandledRejection error: ${err}`);
});
//# sourceMappingURL=client.js.map