import * as grpc from "grpc";

import { BookServiceClient } from "../proto/book_grpc_pb";
import { Book, GetBookRequest, GetBookViaAuthor } from "../proto/book_pb";

const client = new BookServiceClient("127.0.0.1:50051", grpc.credentials.createInsecure());

const fetchBooks = () => {
  const stream:grpc.ClientDuplexStream = client.getBooks();

  stream.on("data", (data: Book) => {
    console.log(data.getIsbn());
  });
  stream.on("end", () => {
    console.log("getBooks done.");
  });

  for (let i = 0; i < 10; i++) {
    let req = new GetBookRequest();
    req.setIsbn(i);
    stream.write(req);
  }
  stream.end();
};

const fetchBook = (isbn: number) => {
  const request = new GetBookRequest();
  request.setIsbn(isbn);


  client.getBook(request, (err, book) => {
    if (err != null) {
      console.error(err);
    }

    console.log(`getBook's Title is ${book.getTitle()}`);
  });
};

const fetchBooksViaAuthor = (author: string) => {
  const request = new GetBookViaAuthor();
  request.setAuthor(author);

  const stream = client.getBooksViaAuthor(request);
  stream.on("data", (data: Book) => {
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
    const req = new GetBookRequest();
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