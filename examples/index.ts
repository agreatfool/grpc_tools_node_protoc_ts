import * as service from "../proto/book_grpc_pb";
import * as messages from "../proto/book_pb"
import * as grpc from 'grpc';

const client = new service.BookServiceClient('localhost', grpc.credentials.createInsecure());

const fetchBooks = () => {
    const stream = client.getBooks();

    stream.on('data', (data: messages.Book) => {
        console.log(data.getIsbn())
    });
};

const fetchBook = (isbn: number) => {
    const request = new messages.GetBookRequest();
    request.setIsbn(isbn);


    client.getBook(request, (err, book) => {
        if (err != null) {
            console.error(err);
        }

        console.log(book.getTitle());
    });
};

const fetchBooksViaAuthor = (author: string) => {
    const request = new messages.GetBookViaAuthor();
    request.setAuthor(author);

    const stream = client.getBooksViaAuthor(request);
    stream.on('data', (data: messages.Book) => {
        console.log(data.getTitle())
    })
};

const fetchGreatestBook = () => {
    client.getGreatestBook((err, data) => {
        if (err != null) {
            console.error(err);
        }

        console.log(data);
    })
};
