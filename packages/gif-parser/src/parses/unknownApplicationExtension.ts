
import { Stream } from "../stream";
import { IParse, IData, ParseParam } from '../parse';
import { getBytes } from '../utils';
import { BaseExtension, SubBlocks } from "./baseExtension";

export type UnknownApplicationExtensionData = SubBlocks;

export type UnknownApplicationExtensionExportData = IData<UnknownApplicationExtensionData>

export interface IUnknownApplicationExtension extends IParse<UnknownApplicationExtensionData> {}

export class UnknownApplicationExtension extends BaseExtension {
    type: string = 'UnknownApplicationExtension';
    offset: number = 0;
    length: number = 0;
    bytes: Uint8Array = new Uint8Array(0);
    private appData: SubBlocks = {} as SubBlocks;
    
    constructor(protected stream: Stream) {
        super(stream);
    }

    parse({ introducer, label }: ParseParam): void {
        console.log('introducer, label', introducer, label);
        this.offset = this.stream.getOffset();
        this.appData = this.readSubBlocks();
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): UnknownApplicationExtensionExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: this.appData
        };
    }
}
