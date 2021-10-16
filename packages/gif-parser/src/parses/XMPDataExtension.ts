
import { Stream } from "../stream";
import { IParse, IData, ParseParam } from '../parse';
import { getBytes } from '../utils';
import { BaseExtension } from "./baseExtension";
import { XMP } from "../xmp";

export interface XMPDataExtensionData {
    blockSize: number;
    xmpData: Array<any> | null;
}

export type XMPDataExtensionExportData = IData<XMPDataExtensionData>

export interface IXMPDataExtension extends IParse<XMPDataExtensionData> {}

export class XMPDataExtension extends BaseExtension {
    type: string = 'XMPDataExtension';
    offset: number = 0;
    length: number = 0;
    bytes: Uint8Array = new Uint8Array(0);
    private blockSize: number = 0;
    private xmpData: Array<any> | null = [];
    
    constructor(protected stream: Stream) {
        super(stream);
    }

    parse({ introducer, label }: ParseParam): void {
        this.offset = this.stream.getOffset();
        const { blocks } = this.readSubBlocks();
        blocks.forEach(item => {
            this.blockSize += item.length;
        });
        const arrayBuffer = this.stream.slice(this.offset, this.blockSize);
        let xmp = new XMP(arrayBuffer);
        this.xmpData = xmp.parse();
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): XMPDataExtensionExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: {
                blockSize: this.blockSize,
                xmpData: this.xmpData
            }
        };
    }
}
