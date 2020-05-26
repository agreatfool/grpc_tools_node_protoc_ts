#!/usr/bin/env node

import * as debug from "debug";
import * as grpc from "grpc";

import { BookServiceClient } from "./proto/book_grpc_pb";
import { Book, GetBookRequest, GetBookViaAuthor } from "./proto/book_pb";

const log = debug("SampleClient");

const client = new BookServiceClient("127.0.0.1:50051", grpc.credentials.createInsecure());

const getBook = async (isbn: number) => {
  return new Promise((resolve, reject) => {
    const request = new GetBookRequest();
    request.setIsbn(isbn);

    log(`[getBook] Request: ${JSON.stringify(request.toObject())}`);

    client.getBook(request, (err, book: Book) => {
      if (err != null) {
        debug(`[getBook] err:\nerr.message: ${err.message}\nerr.stack:\n${err.stack}`);
        reject(err); return;
      }
      log(`[getBook] Book: ${JSON.stringify(book.toObject())}`);
      resolve(book);
    });
  });
};

const getBooks = () => {
  return new Promise((resolve) => {
    const stream: grpc.ClientDuplexStream<GetBookRequest, Book> = client.getBooks();

    stream.on("data", (data: Book) => {
      log(`[getBooks] Book: ${JSON.stringify(data.toObject())}`);
    });
    stream.on("end", () => {
      log("[getBooks] Done.");
      resolve();
    });

    for (let i = 0; i < 10; i++) {
      const req = new GetBookRequest();
      req.setIsbn(i);
      log(`[getBooks] Request: ${JSON.stringify(req.toObject())}`);
      stream.write(req);
    }
    stream.end();
  });
};

const getBooksViaAuthor = (author: string) => {
  return new Promise((resolve) => {
    const request = new GetBookViaAuthor();
    request.setAuthor(author);

    log(`[getBooksViaAuthor] Request: ${JSON.stringify(request.toObject())}`);

    const stream: grpc.ClientReadableStream<Book> = client.getBooksViaAuthor(request);
    stream.on("data", (data: Book) => {
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
    const stream: grpc.ClientWritableStream<GetBookRequest> = client.getGreatestBook((err, data: Book) => {
      if (err != null) {
        log(`[getGreatestBook] err:\nerr.message: ${err.message}\nerr.stack:\n${err.stack}`);
      }
      log(`[getGreatestBook] Book: ${JSON.stringify(data.toObject())}`);
      resolve();
    });

    for (let i = 0; i < 10; i++) {
      const req = new GetBookRequest();
      req.setIsbn(i);
      log(`[getGreatestBook] Request: ${JSON.stringify(req.toObject())}`);
      stream.write(req);
    }
    stream.end();
  });
};

async function main() {
  await getBook(1);
  await getBooks();
  await getBooksViaAuthor("DefaultAuthor");
  await getGreatestBook();
}

main().then((_) => _);

process.on("uncaughtException", (err) => {
  log(`process on uncaughtException error: ${err}`);
});

process.on("unhandledRejection", (err) => {
  log(`process on unhandledRejection error: ${err}`);
});
