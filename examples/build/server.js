"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const book_grpc_pb_1 = require("../proto/book_grpc_pb");
const book_pb_1 = require("../proto/book_pb");
function startServer() {
    const server = new grpc.Server();
    server.addService(book_grpc_pb_1.BookServiceService, {
        getBooks: (call) => {
            call.on("data", (request) => {
                const reply = new book_pb_1.Book();
                reply.setTitle(`Book${request.getIsbn()}`);
                reply.setAuthor(`Author${request.getIsbn()}`);
                reply.setIsbn(request.getIsbn());
                call.write(reply);
            });
            call.on("end", () => {
                console.log("getBooks done.");
                call.end();
            });
        },
        getBook: (call, callback) => {
            const book = new book_pb_1.Book();
            book.setTitle("DefaultBook");
            book.setAuthor("DefaultAuthor");
            callback(null, book);
        },
        getBooksViaAuthor: (call) => {
            const request = call.request;
            console.log("getBooksViaAuthor request:", request.toObject());
            for (let i = 1; i <= 10; i++) {
                const reply = new book_pb_1.Book();
                reply.setTitle(`Book${i}`);
                reply.setAuthor(request.getAuthor());
                reply.setIsbn(i);
                console.log("getBooksViaAuthor write:", reply.toObject());
                call.write(reply);
            }
            console.log("getBooksViaAuthor done.");
            call.end();
        },
        getGreatestBook: (call, callback) => {
            let lastOne;
            call.on("data", (request) => {
                console.log("getGreatestBook:", request.toObject());
                lastOne = request;
            });
            call.on("end", () => {
                const reply = new book_pb_1.Book();
                reply.setIsbn(lastOne.getIsbn());
                reply.setTitle("LastOne");
                reply.setAuthor("LastOne");
                console.log("getGreatestBook done:", reply.toObject());
                callback(null, reply);
            });
        }
    });
    server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
    server.start();
}
startServer();
//# sourceMappingURL=server.js.map