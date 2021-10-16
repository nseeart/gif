
import { Stream } from '../stream';
import { IParse, IData, ParseParam } from '../parse';
import { bitsToNum, byteToBitArr, getBytes } from '../utils';

export type ImageDescriptorData = {
    introducer: string;
    left: number;
    top: number;
    width: number;
    height: number;
    localColorTableFlag: boolean;
    interlaceFlag: boolean;
    sortFlag: boolean;
    reserved: Array<boolean>;
    localColorTableSize: number;
}
export type ImageDescriptorExportData = IData<ImageDescriptorData>

export class ImageDescriptor {
    private type: string = 'ImageDescriptor';
    private offset: number = 0;
    private length: number = 0;
    private bytes: Uint8Array = new Uint8Array(0);
    private introducer: string = '';
    private left: number = 0;
    private top: number = 0;
    private width: number = 0;
    private height: number = 0;
    private localColorTableFlag: boolean = false;
    private interlaceFlag: boolean = false;
    private sortFlag: boolean = false;
    private reserved: Array<boolean> = [];
    private localColorTableSize: number = 0;

    constructor(private stream: Stream) {
        this.stream = stream;
    }

    hasLocalColorTable(): boolean {
        return this.localColorTableFlag;
    }

    getLocalColorTableSize(): number {
        return this.localColorTableSize;
    }

    parse({ introducer = 0 }: ParseParam): void {
        this.introducer = String.fromCharCode(introducer);
        this.offset = this.stream.getOffset() - 1;
        this.left = this.stream.readUint16();
        this.top = this.stream.readUint16();
        this.width = this.stream.readUint16();
        this.height = this.stream.readUint16();

        const packed = this.stream.readUint8();
        let bits = byteToBitArr(packed);

        this.localColorTableFlag = bits.shift() || false;
        this.interlaceFlag = bits.shift() || false;
        this.sortFlag = bits.shift() || false;
        this.reserved = bits.splice(0, 2);
        this.localColorTableSize = bitsToNum(bits.splice(0, 3));
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): ImageDescriptorExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: {
                introducer: this.introducer,
                left: this.left,
                top: this.top,
                width: this.width,
                height: this.height,
                localColorTableFlag: this.localColorTableFlag,
                interlaceFlag: this.interlaceFlag,
                sortFlag: this.sortFlag,
                reserved: this.reserved,
                localColorTableSize: this.localColorTableSize
            }
        };
    }
}
