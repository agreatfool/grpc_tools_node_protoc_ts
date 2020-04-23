#!/usr/bin/env node

import * as debug from "debug";
import * as grpc from "@grpc/grpc-js";
import {sendUnaryData} from "@grpc/grpc-js/build/src/server-call";

import * as grpcPb from "./proto/book_grpc_pb";
import { BookServiceService, IBookServiceServer } from "./proto/book_grpc_pb";
import { Book, GetBookRequest, GetBookViaAuthor } from "./proto/book_pb";

const log = debug("SampleServer");

// FIXME remove later
import * as LibPath from "path";
import * as loader from "@grpc/proto-loader";
const protoLoaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};
function loadProtoFile(file: string): grpc.GrpcObject {
    const packageDefinition = loader.loadSync(file, protoLoaderOptions);
    return grpc.loadPackageDefinition(packageDefinition);
}
// FIXME remove later

class ServerImpl implements IBookServiceServer {

    public getBook(call: grpc.ServerUnaryCall<GetBookRequest, Book>, callback: sendUnaryData<Book>) {
        const book = new Book();

        book.setTitle("DefaultBook");
        book.setAuthor("DefaultAuthor");

        log(`[getBook] Done: ${JSON.stringify(book.toObject())}`);
        callback(null, book);
    }

    public getBooks(call: grpc.ServerDuplexStream<GetBookRequest, Book>) {
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

    public getBooksViaAuthor(call: grpc.ServerWritableStream<GetBookViaAuthor, Book>) {
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

    public getGreatestBook(call: grpc.ServerReadableStream<GetBookRequest, Book>, callback: sendUnaryData<Book>) {
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
    const server = new grpc.Server();

    // const service = grpcPb["com.book.BookService"];
    // const impl = { ...(new ServerImpl()) };

    // console.log(service === null);
    // console.log(typeof service !== "object", typeof service, BookServiceService);
    // console.log(typeof impl !== "object");
    //
    // console.log(service);

    // if (service === null ||
    //     typeof service !== "object" ||
    //     typeof impl !== "object") {
    //     throw new Error("here");
    // }
    // const proto = loadProtoFile(LibPath.join(__dirname, "../../proto/book.proto"));
    // console.log(proto);
    // console.log((proto.com as any).book.BookService);
    // console.log((proto.com as any).book.BookService.service.GetBook.requestSerialize.toString());
    // console.log((proto.com as any).book.BookService.service.GetBook.requestType.toString());

    server.addService(grpcPb["com.book.BookService"], { ...(new ServerImpl()) });
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
