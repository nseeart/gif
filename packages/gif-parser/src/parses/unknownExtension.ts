
import { Stream } from "../stream";
import { IParse, IData, ParseParam } from '../parse';
import { getBytes } from '../utils';
import { BaseExtension, SubBlocks } from "./baseExtension";

export type UnknownExtensionData = SubBlocks;

export type UnknownExtensionExportData = IData<UnknownExtensionData>

export interface IUnknownExtension extends IParse<UnknownExtensionData> {}

export class UnknownExtension extends BaseExtension {
    type: string = 'UnknownExtension';
    private data: UnknownExtensionData = {} as UnknownExtensionData;
    constructor(protected stream: Stream) {
        super(stream);
    }

    parse({ introducer, label }: ParseParam): void {
        this.offset = this.stream.getOffset();
        this.data = this.readSubBlocks();
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): UnknownExtensionExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: this.data
        };
    }
}
