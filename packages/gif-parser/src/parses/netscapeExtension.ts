
import { Stream } from "../stream";
import { IParse, IData, ParseParam } from '../parse';
import { getBytes } from '../utils';
import { BaseExtension } from "./baseExtension";

export interface NetscapeExtensionData {
    blockSize: number;
    subblock: number;
    loop: number;
    terminator: number;
    decode: string;
}

export type NetscapeExtensionExportData = IData<NetscapeExtensionData>

export interface INetscapeExtension extends IParse<NetscapeExtensionData> {}

export class NetscapeExtension extends BaseExtension {
    type: string = 'NetscapeExtension';
    offset: number = 0;
    length: number = 0;
    bytes: Uint8Array = new Uint8Array(0);
    private blockSize: number = 0;
    private subblock: number = 0;
    private loop: number = 0;
    private terminator: number = 0;
    private decode: string = '';
    
    constructor(protected stream: Stream) {
        super(stream);
    }

    parse({ introducer, label }: ParseParam): void {
        this.offset = this.stream.getOffset();
        this.blockSize = this.stream.readUint8(); // Always 3
        this.subblock = this.stream.readUint8();
        this.loop = this.stream.readUint16();
        this.terminator = this.stream.readInt8();
        this.decode = `Loop: ${(this.loop > 0) ? this.loop : 'forever'}`;
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): NetscapeExtensionExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: {
                blockSize: this.blockSize,
                subblock: this.subblock,
                loop: this.loop,
                terminator: this.terminator,
                decode: this.decode
            }
        };
    }
}
