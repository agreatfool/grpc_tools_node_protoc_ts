// package: com.book
// file: book.proto

import * as grpc from "grpc";
import * as book_pb from "./book_pb";

interface IBookServiceService extends grpc.IMethodsMap {
    getBook: IGetBook;
    getBooksViaAuthor: IGetBooksViaAuthor;
    getGreatestBook: IGetGreatestBook;
    getBooks: IGetBooks;
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
interface IGetBooksViaAuthor {
    path: string; // "/com.book.BookService/GetBooksViaAuthor"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestType: book_pb.GetBookViaAuthor,
    responseType: book_pb.Book,
    requestSerialize: (arg: book_pb.GetBookViaAuthor) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => book_pb.GetBookViaAuthor;
    responseSerialize: (arg: book_pb.Book) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => book_pb.Book;
}
interface IGetGreatestBook {
    path: string; // "/com.book.BookService/GetGreatestBook"
    requestStream: boolean; // true
    responseStream: boolean; // false
    requestType: book_pb.GetBookRequest,
    responseType: book_pb.Book,
    requestSerialize: (arg: book_pb.GetBookRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => book_pb.GetBookRequest;
    responseSerialize: (arg: book_pb.Book) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => book_pb.Book;
}
interface IGetBooks {
    path: string; // "/com.book.BookService/GetBooks"
    requestStream: boolean; // true
    responseStream: boolean; // true
    requestType: book_pb.GetBookRequest,
    responseType: book_pb.Book,
    requestSerialize: (arg: book_pb.GetBookRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => book_pb.GetBookRequest;
    responseSerialize: (arg: book_pb.Book) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => book_pb.Book;
}

export const BookServiceService: IBookServiceService;
export class BookServiceClient extends grpc.Client {
    constructor(address: string, credentials: any, options?: grpc.IClientOptions);
    getBook(request: book_pb.GetBookRequest, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    getBooksViaAuthor(request: book_pb.GetBookViaAuthor): grpc.ClientReadableStream;
    getGreatestBook(callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientWritableStream;
    getBooks(): grpc.ClientDuplexStream;
}
