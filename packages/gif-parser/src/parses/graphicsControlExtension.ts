
import { Stream } from "../stream";
import { IParse, IData, ParseParam } from '../parse';
import { byteToBitArr, bitsToNum, getBytes, numberToHex } from '../utils';
import { BaseExtension } from "./baseExtension";

export interface GraphicsControlExtensionData {
    introducer: string;
    label: string;
    blockSize: number;
    reserved: Array<boolean>;
    disposalMethod: number;
    userInputFlag: boolean;
    transparentColorFlag: boolean;
    delayTime: number;
    transparentColorIndex: number;
    blockTerminator: string;
}

export type GraphicsControlExtensionExportData = IData<GraphicsControlExtensionData>

export class GraphicsControlExtension extends BaseExtension {
    type: string = 'GraphicsControlExtension';
    offset: number = 0;
    length: number = 0;
    bytes: Uint8Array = new Uint8Array(0);
    private introducer: string = '';
    private label: string = '';
    private blockSize: number = 0;
    private reserved: Array<boolean> = [];
    private disposalMethod: number = 0;
    private userInputFlag: boolean = false;
    private transparentColorFlag: boolean = false;
    private delayTime: number = 0;
    private transparentColorIndex: number = 0;
    private blockTerminator: string = '';
    
    constructor(protected stream: Stream) {
        super(stream);
    }

    parse({ introducer = 0, label = 0 }: ParseParam): void {
        this.offset = this.stream.getOffset() - 2;
        this.introducer = String.fromCharCode(introducer);
        this.label = numberToHex(label);

        this.blockSize = this.stream.readUint8(); // Always 4
        let bits = byteToBitArr(this.stream.readUint8());
        this.reserved = bits.splice(0, 3); // Reserved; should be 000.
        this.disposalMethod = bitsToNum(bits.splice(0, 3));
        this.userInputFlag = bits.shift() || false;
        this.transparentColorFlag = bits.shift() || false;

        this.delayTime = this.stream.readUint8();
        this.stream.seek(1);
        this.transparentColorIndex = this.stream.readUint8();
        this.blockTerminator = this.stream.readString(1);
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): GraphicsControlExtensionExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: {
                introducer: this.introducer,
                label: this.label,
                blockSize: this.blockSize,
                reserved: this.reserved,
                disposalMethod: this.disposalMethod,
                userInputFlag: this.userInputFlag,
                transparentColorFlag: this.transparentColorFlag,
                delayTime: this.delayTime,
                transparentColorIndex: this.transparentColorIndex,
                blockTerminator: this.blockTerminator,
            }
        };
    }
}
