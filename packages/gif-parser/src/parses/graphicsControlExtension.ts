
import { Stream } from "../stream";
import { IData, ParseParam } from '../parse';
import { byteToBits, getBytes, numberToHex, bitsToNumber } from '../utils';
import { BaseExtension } from "./baseExtension";

export interface GraphicsControlExtensionData {
    introducer: string;
    label: string;
    blockSize: number;
    packedFields: Array<number>;
    reserved: Array<number>;
    disposalMethod: number;
    userInputFlag: number;
    transparentColorFlag: number;
    delayTime: number;
    transparentColorIndex: number;
    blockTerminator: string;
}

export type GraphicsControlExtensionExportData = IData<GraphicsControlExtensionData>

export class GraphicsControlExtension extends BaseExtension {
    private type: string = 'GraphicsControlExtension';
    private offset: number = 0;
    private length: number = 0;
    private bytes: Uint8Array = new Uint8Array(0);
    private introducer: string = '';
    private label: string = '';
    private blockSize: number = 0;
    private packedFields: Array<number> = [];
    private reserved: Array<number> = [];
    private disposalMethod: number = 0;
    private userInputFlag: number = 0;
    private transparentColorFlag: number = 0;
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
        this.packedFields = byteToBits(this.stream.readUint8());
        const bits = [...this.packedFields];
        this.reserved = bits.splice(0, 3); // 预留
        this.disposalMethod = bitsToNumber(bits.splice(0, 3));
        this.userInputFlag = bits.shift() || 0;
        this.transparentColorFlag = bits.shift() || 0;

        this.delayTime = this.stream.readUint16();
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
                packedFields: this.packedFields,
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
