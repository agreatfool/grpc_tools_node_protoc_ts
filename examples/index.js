"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service = require("../proto/book_grpc_pb");
const messages = require("../proto/book_pb");
const grpc = require("grpc");
const client = new service.BookServiceClient('localhost', grpc.credentials.createInsecure());
const fetchBooks = () => {
    const stream = client.getBooks();
    stream.on('data', (data) => {
        console.log(data.getIsbn());
    });
};
const fetchBook = (isbn) => {
    const request = new messages.GetBookRequest();
    request.setIsbn(isbn);
    client.getBook(request, (err, book) => {
        if (err != null) {
            console.error(err);
        }
        console.log(book.getTitle());
    });
};
const fetchBooksViaAuthor = (author) => {
    const request = new messages.GetBookViaAuthor();
    request.setAuthor(author);
    const stream = client.getBooksViaAuthor(request);
    stream.on('data', (data) => {
        console.log(data.getTitle());
    });
};
const fetchGreatestBook = () => {
    client.getGreatestBook((err, data) => {
        if (err != null) {
            console.error(err);
        }
        console.log(data);
    });
};
