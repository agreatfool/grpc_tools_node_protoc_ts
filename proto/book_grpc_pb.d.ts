// package: com.book
// file: book.proto

import * as grpc from "grpc";
import * as book_pb from "./book_pb";

interface IBookServiceService {
    getBook: IGetBook;
}

interface IGetBook {
    path: string; // "/com.book.BookService/GetBook"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: book_pb.GetBookRequest,
    responseType: book_pb.Book,
    requestSerialize: (arg: book_pb.GetBookRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => book_pb.GetBookRequest;
    responseSerialize: (arg: book_pb.Book) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => book_pb.Book;
}

export const BookServiceService: IBookServiceService;
export class BookServiceClient extends grpc.Client {
    getBook(request: book_pb.GetBookRequest, callback: (error: Error | null, response: book_pb.GetBookRequest) => void);
}
