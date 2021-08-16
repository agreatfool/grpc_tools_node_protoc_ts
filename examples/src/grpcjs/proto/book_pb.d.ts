// package: com.book
// file: book.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Book extends jspb.Message { 
    getIsbn(): number;
    setIsbn(value: number): Book;
    getTitle(): string;
    setTitle(value: string): Book;
    getAuthor(): string;
    setAuthor(value: string): Book;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Book.AsObject;
    static toObject(includeInstance: boolean, msg: Book): Book.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Book, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Book;
    static deserializeBinaryFromReader(message: Book, reader: jspb.BinaryReader): Book;
}

export namespace Book {
    export type AsObject = {
        isbn: number,
        title: string,
        author: string,
    }
}

export class GetBookRequest extends jspb.Message { 
    getIsbn(): number;
    setIsbn(value: number): GetBookRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBookRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetBookRequest): GetBookRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBookRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBookRequest;
    static deserializeBinaryFromReader(message: GetBookRequest, reader: jspb.BinaryReader): GetBookRequest;
}

export namespace GetBookRequest {
    export type AsObject = {
        isbn: number,
    }
}

export class GetBookViaAuthor extends jspb.Message { 
    getAuthor(): string;
    setAuthor(value: string): GetBookViaAuthor;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBookViaAuthor.AsObject;
    static toObject(includeInstance: boolean, msg: GetBookViaAuthor): GetBookViaAuthor.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBookViaAuthor, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBookViaAuthor;
    static deserializeBinaryFromReader(message: GetBookViaAuthor, reader: jspb.BinaryReader): GetBookViaAuthor;
}

export namespace GetBookViaAuthor {
    export type AsObject = {
        author: string,
    }
}

export class GetBookListRequest extends jspb.Message { 
    getAuthor(): string;
    setAuthor(value: string): GetBookListRequest;
    clearBooksList(): void;
    getBooksList(): Array<Book>;
    setBooksList(value: Array<Book>): GetBookListRequest;
    addBooks(value?: Book, index?: number): Book;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBookListRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetBookListRequest): GetBookListRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBookListRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBookListRequest;
    static deserializeBinaryFromReader(message: GetBookListRequest, reader: jspb.BinaryReader): GetBookListRequest;
}

export namespace GetBookListRequest {
    export type AsObject = {
        author: string,
        booksList: Array<Book.AsObject>,
    }
}

export class BookList extends jspb.Message { 
    clearBooksList(): void;
    getBooksList(): Array<Book>;
    setBooksList(value: Array<Book>): BookList;
    addBooks(value?: Book, index?: number): Book;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BookList.AsObject;
    static toObject(includeInstance: boolean, msg: BookList): BookList.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BookList, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BookList;
    static deserializeBinaryFromReader(message: BookList, reader: jspb.BinaryReader): BookList;
}

export namespace BookList {
    export type AsObject = {
        booksList: Array<Book.AsObject>,
    }
}

export class BookStore extends jspb.Message { 
    getName(): string;
    setName(value: string): BookStore;

    getBooksMap(): jspb.Map<number, string>;
    clearBooksMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BookStore.AsObject;
    static toObject(includeInstance: boolean, msg: BookStore): BookStore.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BookStore, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BookStore;
    static deserializeBinaryFromReader(message: BookStore, reader: jspb.BinaryReader): BookStore;
}

export namespace BookStore {
    export type AsObject = {
        name: string,

        booksMap: Array<[number, string]>,
    }
}

export class SpecialCases extends jspb.Message { 
    getNormal(): string;
    setNormal(value: string): SpecialCases;
    getDefault(): string;
    setDefault(value: string): SpecialCases;
    getFunction(): string;
    setFunction(value: string): SpecialCases;
    getVar(): string;
    setVar(value: string): SpecialCases;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SpecialCases.AsObject;
    static toObject(includeInstance: boolean, msg: SpecialCases): SpecialCases.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SpecialCases, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SpecialCases;
    static deserializeBinaryFromReader(message: SpecialCases, reader: jspb.BinaryReader): SpecialCases;
}

export namespace SpecialCases {
    export type AsObject = {
        normal: string,
        pb_default: string,
        pb_function: string,
        pb_var: string,
    }
}

export class OneOfSample extends jspb.Message { 

    hasA1(): boolean;
    clearA1(): void;
    getA1(): boolean;
    setA1(value: boolean): OneOfSample;

    hasB1(): boolean;
    clearB1(): void;
    getB1(): boolean;
    setB1(value: boolean): OneOfSample;

    hasA2(): boolean;
    clearA2(): void;
    getA2(): boolean;
    setA2(value: boolean): OneOfSample;

    hasB2(): boolean;
    clearB2(): void;
    getB2(): boolean;
    setB2(value: boolean): OneOfSample;

    hasA3(): boolean;
    clearA3(): void;
    getA3(): boolean;
    setA3(value: boolean): OneOfSample;

    hasB3(): boolean;
    clearB3(): void;
    getB3(): boolean;
    setB3(value: boolean): OneOfSample;

    hasAb(): boolean;
    clearAb(): void;
    getAb(): string;
    setAb(value: string): OneOfSample;

    hasBb(): boolean;
    clearBb(): void;
    getBb(): string;
    setBb(value: string): OneOfSample;

    getSinglewordCase(): OneOfSample.SinglewordCase;
    getTwoWordsCase(): OneOfSample.TwoWordsCase;
    getMiddleCase(): OneOfSample.MiddleCase;
    getFootypeCase(): OneOfSample.FootypeCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OneOfSample.AsObject;
    static toObject(includeInstance: boolean, msg: OneOfSample): OneOfSample.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OneOfSample, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OneOfSample;
    static deserializeBinaryFromReader(message: OneOfSample, reader: jspb.BinaryReader): OneOfSample;
}

export namespace OneOfSample {
    export type AsObject = {
        a1: boolean,
        b1: boolean,
        a2: boolean,
        b2: boolean,
        a3: boolean,
        b3: boolean,
        ab: string,
        bb: string,
    }

    export enum SinglewordCase {
        SINGLEWORD_NOT_SET = 0,
        A1 = 1,
        B1 = 2,
    }

    export enum TwoWordsCase {
        TWO_WORDS_NOT_SET = 0,
        A_2 = 3,
        B_2 = 4,
    }

    export enum MiddleCase {
        MIDDLE_NOT_SET = 0,
        A3 = 5,
        B3 = 6,
    }

    export enum FootypeCase {
        FOOTYPE_NOT_SET = 0,
        AB = 7,
        BB = 8,
    }

}

export class ExtMsgString extends jspb.Message { 
    getExtension$(): string;
    setExtension$(value: string): ExtMsgString;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExtMsgString.AsObject;
    static toObject(includeInstance: boolean, msg: ExtMsgString): ExtMsgString.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExtMsgString, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExtMsgString;
    static deserializeBinaryFromReader(message: ExtMsgString, reader: jspb.BinaryReader): ExtMsgString;
}

export namespace ExtMsgString {
    export type AsObject = {
        extension: string,
    }
}

export class ExtMsgList extends jspb.Message { 
    clearExtensionList(): void;
    getExtensionList(): Array<string>;
    setExtensionList(value: Array<string>): ExtMsgList;
    addExtension$(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExtMsgList.AsObject;
    static toObject(includeInstance: boolean, msg: ExtMsgList): ExtMsgList.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExtMsgList, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExtMsgList;
    static deserializeBinaryFromReader(message: ExtMsgList, reader: jspb.BinaryReader): ExtMsgList;
}

export namespace ExtMsgList {
    export type AsObject = {
        extensionList: Array<string>,
    }
}

export class ExtMsgByte extends jspb.Message { 
    getExtension$(): Uint8Array | string;
    getExtension_asU8(): Uint8Array;
    getExtension_asB64(): string;
    setExtension$(value: Uint8Array | string): ExtMsgByte;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExtMsgByte.AsObject;
    static toObject(includeInstance: boolean, msg: ExtMsgByte): ExtMsgByte.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExtMsgByte, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExtMsgByte;
    static deserializeBinaryFromReader(message: ExtMsgByte, reader: jspb.BinaryReader): ExtMsgByte;
}

export namespace ExtMsgByte {
    export type AsObject = {
        extension: Uint8Array | string,
    }
}

export class ExtMsgByteList extends jspb.Message { 
    clearExtensionList(): void;
    getExtensionList(): Array<Uint8Array | string>;
    getExtensionList_asU8(): Array<Uint8Array>;
    getExtensionList_asB64(): Array<string>;
    setExtensionList(value: Array<Uint8Array | string>): ExtMsgByteList;
    addExtension$(value: Uint8Array | string, index?: number): Uint8Array | string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExtMsgByteList.AsObject;
    static toObject(includeInstance: boolean, msg: ExtMsgByteList): ExtMsgByteList.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExtMsgByteList, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExtMsgByteList;
    static deserializeBinaryFromReader(message: ExtMsgByteList, reader: jspb.BinaryReader): ExtMsgByteList;
}

export namespace ExtMsgByteList {
    export type AsObject = {
        extensionList: Array<Uint8Array | string>,
    }
}

export class ExtMsgMap extends jspb.Message { 

    getExtensionMap(): jspb.Map<string, string>;
    clearExtensionMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExtMsgMap.AsObject;
    static toObject(includeInstance: boolean, msg: ExtMsgMap): ExtMsgMap.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExtMsgMap, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExtMsgMap;
    static deserializeBinaryFromReader(message: ExtMsgMap, reader: jspb.BinaryReader): ExtMsgMap;
}

export namespace ExtMsgMap {
    export type AsObject = {

        extensionMap: Array<[string, string]>,
    }
}

export class ExtMsgOneOf extends jspb.Message { 

    hasExtension$(): boolean;
    clearExtension$(): void;
    getExtension$(): string;
    setExtension$(value: string): ExtMsgOneOf;

    getExtCase(): ExtMsgOneOf.ExtCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExtMsgOneOf.AsObject;
    static toObject(includeInstance: boolean, msg: ExtMsgOneOf): ExtMsgOneOf.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExtMsgOneOf, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExtMsgOneOf;
    static deserializeBinaryFromReader(message: ExtMsgOneOf, reader: jspb.BinaryReader): ExtMsgOneOf;
}

export namespace ExtMsgOneOf {
    export type AsObject = {
        extension: string,
    }

    export enum ExtCase {
        EXT_NOT_SET = 0,
        EXTENSION = 1,
    }

}

export class OptTest extends jspb.Message { 

    hasName(): boolean;
    clearName(): void;
    getName(): string | undefined;
    setName(value: string): OptTest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OptTest.AsObject;
    static toObject(includeInstance: boolean, msg: OptTest): OptTest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OptTest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OptTest;
    static deserializeBinaryFromReader(message: OptTest, reader: jspb.BinaryReader): OptTest;
}

export namespace OptTest {
    export type AsObject = {
        name?: string,
    }
}

export enum EnumSample {
    UNKNOWN = 0,
    STARTED = 1,
    RUNNING = 1,
    CASETEST = 2,
    HOW_ABOUT_THIS = 3,
    ALLLOWERCASE = 4,
}
