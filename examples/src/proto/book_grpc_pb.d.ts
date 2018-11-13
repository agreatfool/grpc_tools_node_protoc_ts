// package: com.book
// file: book.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as book_pb from "./book_pb";

interface IBookServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getBook: IBookServiceService_IGetBook;
    getBooksViaAuthor: IBookServiceService_IGetBooksViaAuthor;
    getGreatestBook: IBookServiceService_IGetGreatestBook;
    getBooks: IBookServiceService_IGetBooks;
}

interface IBookServiceService_IGetBook extends grpc.MethodDefinition<book_pb.GetBookRequest, book_pb.Book> {
    path: string; // "/com.book.BookService/GetBook"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<book_pb.GetBookRequest>;
    requestDeserialize: grpc.deserialize<book_pb.GetBookRequest>;
    responseSerialize: grpc.serialize<book_pb.Book>;
    responseDeserialize: grpc.deserialize<book_pb.Book>;
}
interface IBookServiceService_IGetBooksViaAuthor extends grpc.MethodDefinition<book_pb.GetBookViaAuthor, book_pb.Book> {
    path: string; // "/com.book.BookService/GetBooksViaAuthor"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<book_pb.GetBookViaAuthor>;
    requestDeserialize: grpc.deserialize<book_pb.GetBookViaAuthor>;
    responseSerialize: grpc.serialize<book_pb.Book>;
    responseDeserialize: grpc.deserialize<book_pb.Book>;
}
interface IBookServiceService_IGetGreatestBook extends grpc.MethodDefinition<book_pb.GetBookRequest, book_pb.Book> {
    path: string; // "/com.book.BookService/GetGreatestBook"
    requestStream: boolean; // true
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<book_pb.GetBookRequest>;
    requestDeserialize: grpc.deserialize<book_pb.GetBookRequest>;
    responseSerialize: grpc.serialize<book_pb.Book>;
    responseDeserialize: grpc.deserialize<book_pb.Book>;
}
interface IBookServiceService_IGetBooks extends grpc.MethodDefinition<book_pb.GetBookRequest, book_pb.Book> {
    path: string; // "/com.book.BookService/GetBooks"
    requestStream: boolean; // true
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<book_pb.GetBookRequest>;
    requestDeserialize: grpc.deserialize<book_pb.GetBookRequest>;
    responseSerialize: grpc.serialize<book_pb.Book>;
    responseDeserialize: grpc.deserialize<book_pb.Book>;
}

export const BookServiceService: IBookServiceService;

export interface IBookServiceServer {
    getBook: grpc.handleUnaryCall<book_pb.GetBookRequest, book_pb.Book>;
    getBooksViaAuthor: grpc.handleServerStreamingCall<book_pb.GetBookViaAuthor, book_pb.Book>;
    getGreatestBook: grpc.handleClientStreamingCall<book_pb.GetBookRequest, book_pb.Book>;
    getBooks: grpc.handleBidiStreamingCall<book_pb.GetBookRequest, book_pb.Book>;
}

export interface IBookServiceClient {
    getBook(request: book_pb.GetBookRequest, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    getBook(request: book_pb.GetBookRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    getBook(request: book_pb.GetBookRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    getBooksViaAuthor(request: book_pb.GetBookViaAuthor, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<book_pb.Book>;
    getBooksViaAuthor(request: book_pb.GetBookViaAuthor, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<book_pb.Book>;
    getGreatestBook(callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    getGreatestBook(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    getGreatestBook(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    getGreatestBook(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    getBooks(): grpc.ClientDuplexStream<book_pb.GetBookRequest, book_pb.Book>;
    getBooks(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<book_pb.GetBookRequest, book_pb.Book>;
    getBooks(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<book_pb.GetBookRequest, book_pb.Book>;
}

export class BookServiceClient extends grpc.Client implements IBookServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getBook(request: book_pb.GetBookRequest, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    public getBook(request: book_pb.GetBookRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    public getBook(request: book_pb.GetBookRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientUnaryCall;
    public getBooksViaAuthor(request: book_pb.GetBookViaAuthor, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<book_pb.Book>;
    public getBooksViaAuthor(request: book_pb.GetBookViaAuthor, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<book_pb.Book>;
    public getGreatestBook(callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    public getGreatestBook(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    public getGreatestBook(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    public getGreatestBook(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: book_pb.Book) => void): grpc.ClientWritableStream<book_pb.GetBookRequest>;
    public getBooks(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<book_pb.GetBookRequest, book_pb.Book>;
    public getBooks(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<book_pb.GetBookRequest, book_pb.Book>;
}
