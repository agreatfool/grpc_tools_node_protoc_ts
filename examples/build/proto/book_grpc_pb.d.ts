// package: com.book
// file: book.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as book_pb from "./book_pb";

interface IBookServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getBook: IGetBook;
    getBooksViaAuthor: IGetBooksViaAuthor;
    getGreatestBook: IGetGreatestBook;
    getBooks: IGetBooks;
}

interface IGetBook {
    path: string; // "/com.book.BookService/GetBook"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: book_pb.GetBookRequest;
    responseType: book_pb.Book;
    requestSerialize: (arg: book_pb.GetBookRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => book_pb.GetBookRequest;
    responseSerialize: (arg: book_pb.Book) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => book_pb.Book;
}
interface IGetBooksViaAuthor {
    path: string; // "/com.book.BookService/GetBooksViaAuthor"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestType: book_pb.GetBookViaAuthor;
    responseType: book_pb.Book;
    requestSerialize: (arg: book_pb.GetBookViaAuthor) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => book_pb.GetBookViaAuthor;
    responseSerialize: (arg: book_pb.Book) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => book_pb.Book;
}
interface IGetGreatestBook {
    path: string; // "/com.book.BookService/GetGreatestBook"
    requestStream: boolean; // true
    responseStream: boolean; // false
    requestType: book_pb.GetBookRequest;
    responseType: book_pb.Book;
    requestSerialize: (arg: book_pb.GetBookRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => book_pb.GetBookRequest;
    responseSerialize: (arg: book_pb.Book) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => book_pb.Book;
}
interface IGetBooks {
    path: string; // "/com.book.BookService/GetBooks"
    requestStream: boolean; // true
    responseStream: boolean; // true
    requestType: book_pb.GetBookRequest;
    responseType: book_pb.Book;
    requestSerialize: (arg: book_pb.GetBookRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => book_pb.GetBookRequest;
    responseSerialize: (arg: book_pb.Book) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => book_pb.Book;
}

export interface IBookServiceClient {
    getBook(request: book_pb.GetBookRequest, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    getBook(request: book_pb.GetBookRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    getBook(request: book_pb.GetBookRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    getBooksViaAuthor(request: book_pb.GetBookViaAuthor, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<book_pb.GetBookViaAuthor>;
    getBooksViaAuthor(request: book_pb.GetBookViaAuthor, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<book_pb.GetBookViaAuthor>;
    getGreatestBook(callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    getGreatestBook(metadata: grpc.Metadata, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    getGreatestBook(options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    getGreatestBook(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    getBooks(): grpc.ClientDuplexStream<book_pb.GetBookRequest, book_pb.Book>;
    getBooks(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<book_pb.GetBookRequest, book_pb.Book>;
    getBooks(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<book_pb.GetBookRequest, book_pb.Book>;
}

export const BookServiceService: IBookServiceService;
export class BookServiceClient extends grpc.Client implements IBookServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getBook(request: book_pb.GetBookRequest, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    public getBook(request: book_pb.GetBookRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    public getBook(request: book_pb.GetBookRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    public getBooksViaAuthor(request: book_pb.GetBookViaAuthor, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<book_pb.GetBookViaAuthor>;
    public getBooksViaAuthor(request: book_pb.GetBookViaAuthor, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<book_pb.GetBookViaAuthor>;
    public getGreatestBook(callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    public getGreatestBook(metadata: grpc.Metadata, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    public getGreatestBook(options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    public getGreatestBook(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    public getBooks(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<book_pb.GetBookRequest, book_pb.Book>;
    public getBooks(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<book_pb.GetBookRequest, book_pb.Book>;
}
