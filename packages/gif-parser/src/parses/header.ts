
import { Stream } from "../stream";
import { IData } from '../parse';
import { getBytes } from '../utils';

export interface HeaderData {
    signature: string;
    version: string;
}
export type HeaderExportData = IData<HeaderData>;

export class Header {
    private type: string = 'Header';
    private offset: number = 0;
    private length: number = 0;
    private bytes: Uint8Array = new Uint8Array(0);
    private signature: string  = '';
    private version: string  = '';
    constructor(private stream: Stream) {
        this.stream = stream;
    }

    parse() {
        this.offset = this.stream.getOffset();
        this.signature = this.stream.readString(3); 
        this.version = this.stream.readString(3);
        this.length = this.stream.getOffset() - this.offset;
        console.log('this.signature', this.signature);
        if (this.signature !== 'GIF') throw new Error('Not a GIF file.'); 
    }

    export(): HeaderExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: {
                signature: this.signature,
                version: this.version
            }
        }
    }
}
