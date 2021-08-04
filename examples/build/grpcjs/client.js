#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const grpc = require("@grpc/grpc-js");
const book_pb_1 = require("./proto/book_pb");
const book_grpc_pb_1 = require("./proto/book_grpc_pb");
const log = debug("SampleClient");
const client = new book_grpc_pb_1.BookServiceClient("127.0.0.1:50051", grpc.credentials.createInsecure());
const getBook = async (isbn) => {
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
};
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
const getBookList = async (author) => {
    return new Promise((resolve, reject) => {
        const request = new book_pb_1.GetBookListRequest();
        request.setAuthor(author);
        log(`[getBookList] Request: ${JSON.stringify(request.toObject())}`);
        client.getBookList(request, (err, books) => {
            if (err != null) {
                debug(`[getBookList] err:\nerr.message: ${err.message}\nerr.stack:\n${err.stack}`);
                reject(err);
                return;
            }
            log(`[getBookList] Books: ${JSON.stringify(books.toObject())}`);
            resolve(books);
        });
    });
};
async function main() {
    await getBook(1);
    await getBooks();
    await getBooksViaAuthor("DefaultAuthor");
    await getGreatestBook();
    await getBookList("ListBooksWithAuthor");
}
main().then((_) => _);
process.on("uncaughtException", (err) => {
    log(`process on uncaughtException error: ${err}`);
});
process.on("unhandledRejection", (err) => {
    log(`process on unhandledRejection error: ${err}`);
});
//# sourceMappingURL=client.js.map