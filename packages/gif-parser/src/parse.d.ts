import { ImageDescriptor } from "./parses/imageDescriptor";
import { ColorTableExportData } from "./parses/colorTable";

export interface IData<D> {
    type: string;
    offset: number;
    length: number;
    bytes?: Uint8Array;
    data: D
}

export type ParseParam = {
    introducer?: number;
    label?: number;
    size?: number;
    imageDescriptor? :ImageDescriptor;
};


// export interface IParse<T> {
//     parse(introducer: number, label: number): void;
// }

// export interface IParse<T> {
//     parse(introducer: number): void;
// }

export interface IParse<T> {
    type: string;
    offset: number;
    length: number;
    parse(param: ParseParam): void;
    export(): IData<T>;
}

export interface IParses<T> {
    type: string;
    offset: number;
    length: number;
    parse(globalColorTableExportData?: ColorTableExportData): void;
    export(): T;
}

