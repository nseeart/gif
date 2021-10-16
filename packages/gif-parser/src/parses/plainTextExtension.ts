
import { Stream } from "../stream";
import { IParse, IData, ParseParam } from '../parse';
import { getBytes } from '../utils';
import { BaseExtension, SubBlocks } from "./baseExtension";

export type Colors = Array<any>;

export type PlainTextExtensionData = SubBlocks;

export type PlainTextExtensionExportData = IData<PlainTextExtensionData>

export interface IPlainTextExtension extends IParse<PlainTextExtensionData> {}

export class PlainTextExtension extends BaseExtension {
    type: string = 'PlainTextExtension';
    private blockSize: number = 0;
    private left: number = 0;
    private top: number = 0;
    private width: number = 0;
    private height: number = 0;
    private cellWidth: number = 0;
    private cellHeight: number = 0;
    private foregroundColorIndex: number = 0;
    private backgroundColorIndex: number = 0;
    private data: PlainTextExtensionData = {} as PlainTextExtensionData;
    constructor(protected stream: Stream) {
        super(stream);
    }

    parse({ introducer, label }: ParseParam): void {
        this.offset = this.stream.getOffset();
        this.blockSize = this.stream.readUint8(); // Always 12
        this.left = this.stream.readUint16();
        this.top = this.stream.readUint16();
        this.width = this.stream.readUint16();
        this.height = this.stream.readUint16();
        this.cellWidth = this.stream.readUint8();
        this.cellHeight = this.stream.readUint8();
        this.foregroundColorIndex = this.stream.readUint8();
        this.backgroundColorIndex = this.stream.readUint8();
        this.data = this.readSubBlocks();
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): PlainTextExtensionExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: this.data
        };
    }
}
