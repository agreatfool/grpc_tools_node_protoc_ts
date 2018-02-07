import * as grpc from "grpc";
import { BookServiceService } from "./proto/book_grpc_pb";
import { Book, GetBookRequest, GetBookViaAuthor } from "./proto/book_pb";

function startServer() {

  const server = new grpc.Server();

  server.addService(BookServiceService, {
    getBooks: (call: grpc.ServerDuplexStream) => {
      call.on("data", (request: GetBookRequest) => {
        const reply = new Book();
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
    getBook: (call: grpc.ServerUnaryCall, callback: grpc.sendUnaryData) => {
      const book = new Book();

      book.setTitle("DefaultBook");
      book.setAuthor("DefaultAuthor");

      callback(null, book);
    },
    getBooksViaAuthor: (call: grpc.ServerWriteableStream) => {
      const request = call.request as GetBookViaAuthor;

      console.log("getBooksViaAuthor request:", request.toObject());
      for (let i = 1; i <= 10; i++) {
        const reply = new Book();
        reply.setTitle(`Book${i}`);
        reply.setAuthor(request.getAuthor());
        reply.setIsbn(i);
        console.log("getBooksViaAuthor write:", reply.toObject());
        call.write(reply);
      }
      console.log("getBooksViaAuthor done.");
      call.end();
    },
    getGreatestBook: (call: grpc.ServerReadableStream, callback: grpc.sendUnaryData) => {
      let lastOne: GetBookRequest;
      call.on("data", (request: GetBookRequest) => {
        console.log("getGreatestBook:", request.toObject());
        lastOne = request;
      });
      call.on("end", () => {
        const reply = new Book();
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