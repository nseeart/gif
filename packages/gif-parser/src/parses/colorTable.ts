
import { Stream } from "../stream";
import { IData, ParseParam } from '../parse';
import { getBytes } from '../utils';

export type ColorTableData = Array<any>

export interface ColorTableExportData extends IData<ColorTableData> {}

export class ColorTable {
    type: string = '';
    offset: number = 0;
    length: number = 0;
    bytes: Uint8Array = new Uint8Array(0);
    private colors: ColorTableData  = [];
    constructor(private stream: Stream, type: string) {
        this.stream = stream;
        this.type = type;
    }

    parse({ size = 0 }: ParseParam) {
        const globalColorTableSize = 1 << (size + 1);
        this.offset = this.stream.getOffset();
        for (let i = 0; i < globalColorTableSize; i++) {
            this.colors.push(this.stream.readUint8Array(3));
        }
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): ColorTableExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: this.colors
        };
    }
}
