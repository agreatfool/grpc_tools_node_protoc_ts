"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = require("grpc");
const book_grpc_pb_1 = require("../proto/book_grpc_pb");
const book_pb_1 = require("../proto/book_pb");
const client = new book_grpc_pb_1.BookServiceClient("127.0.0.1:50051", grpc.credentials.createInsecure());
const fetchBooks = () => {
    const stream = client.getBooks();
    stream.on("data", (data) => {
        console.log(data.getIsbn());
    });
    stream.on("end", () => {
        console.log("getBooks done.");
    });
    for (let i = 0; i < 10; i++) {
        let req = new book_pb_1.GetBookRequest();
        req.setIsbn(i);
        stream.write(req);
    }
    stream.end();
};
const fetchBook = (isbn) => {
    const request = new book_pb_1.GetBookRequest();
    request.setIsbn(isbn);
    client.getBook(request, (err, book) => {
        if (err != null) {
            console.error(err);
        }
        console.log(`getBook's Title is ${book.getTitle()}`);
    });
};
const fetchBooksViaAuthor = (author) => {
    const request = new book_pb_1.GetBookViaAuthor();
    request.setAuthor(author);
    const stream = client.getBooksViaAuthor(request);
    stream.on("data", (data) => {
        console.log(data.getTitle());
    });
    stream.on("end", () => {
        console.log("fetchBooksViaAuthor done");
    });
};
const fetchGreatestBook = () => {
    const stream = client.getGreatestBook((err, data) => {
        if (err != null) {
            console.error(err);
        }
        console.log(data);
    });
    for (let i = 0; i < 10; i++) {
        const req = new book_pb_1.GetBookRequest();
        req.setIsbn(i);
        stream.write(req);
    }
    stream.end();
};
function main() {
    fetchBook(1);
    // fetchBooksViaAuthor("DefaultAuthor");
    // fetchGreatestBook();
    // fetchBooks();
}
main();
//# sourceMappingURL=client.js.map