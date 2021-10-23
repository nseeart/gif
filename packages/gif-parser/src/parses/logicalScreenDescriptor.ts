import { Stream } from "../stream";
import { byteToBitArr, bitsToNum, getBytes, byteToBits, bitsToNumber } from "../utils";
import { IData } from '../parse';

export interface LogicalScreenDescriptorData {
    width: number;
    height: number;
    // 填充字段
    // public packedField: Record<string, any> = {};
    globalColorTableFlag: number;
    colorResolution: number;
    sortFlag: number;
    globalColorTableSize: number;

    backgroundColorIndex: number;
    pixelAspectRatio: number;
}
export type LogicalScreenDescriptorExportData = IData<LogicalScreenDescriptorData>;


export class LogicalScreenDescriptor {
    private type: string = 'LogicalScreenDescriptor';
    private offset: number = 0;
    private length: number = 0;
    private bytes: Uint8Array = new Uint8Array(0);
    private width: number = 0;
    private height: number = 0;

    // 填充字段
    // public packedField: Record<string, any> = {};
    private globalColorTableFlag: number = 0;
    private colorResolution: number = 0;
    private sortFlag: number = 0;
    private globalColorTableSize: number = 0;

    private backgroundColorIndex: number = 0;
    private pixelAspectRatio: number = 0;
    constructor(private stream: Stream) {
        this.stream = stream;
    }

    parse() {
        this.offset = this.stream.getOffset();
        this.width = this.stream.readUint16();
        this.height = this.stream.readUint16();

        const packedFields = this.stream.readUint8();
        console.log('packedFields===', packedFields);
        this.handlerPackedField(packedFields);

        this.backgroundColorIndex = this.stream.readUint8();
        this.pixelAspectRatio = this.stream.readInt8();
        this.length = this.stream.getOffset() - this.offset;
        console.log('this', this);
    }

    hasGlobalColorTable(): boolean {
        return !!this.globalColorTableFlag;
    }

    getGlobalColorTableSize() {
        return 1 << (this.globalColorTableSize + 1);
    }

    export(): LogicalScreenDescriptorExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: {
                width: this.width,
                height: this.height,
                globalColorTableFlag: this.globalColorTableFlag,
                colorResolution: this.colorResolution,
                sortFlag: this.sortFlag,
                globalColorTableSize: this.globalColorTableSize,
                backgroundColorIndex: this.backgroundColorIndex,
                pixelAspectRatio: this.pixelAspectRatio
            }
        }
    }

    handlerPackedField(rb: number): void {
        const bits: Array<number> = byteToBits(rb);
        // 1 - 全局颜色表标志
        this.globalColorTableFlag = bits.shift() || 0;
        // 3 - 颜色分辨率
        this.colorResolution = bitsToNumber(bits.splice(0, 3)) + 1;
        // 5 - 排序标志
        this.sortFlag = bits.shift() || 0;
        // 7 - 全局颜色表的大小
        this.globalColorTableSize = bitsToNumber(bits.splice(0, 3));
    }
}