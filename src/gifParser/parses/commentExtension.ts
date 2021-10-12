
import { Stream } from "../stream";
import { IParse, IData, ParseParam } from '../parse';
import { getBytes } from '../utils';
import { BaseExtension, SubBlocks } from "./baseExtension";

export type Colors = Array<any>;

export type CommentExtensionData = SubBlocks;

export type CommentExtensionExportData = IData<CommentExtensionData>

export class CommentExtension extends BaseExtension {
    private type: string = 'CommentExtension';
    private offset: number = 0;
    private length: number = 0;
    private bytes: Uint8Array = new Uint8Array(0);
    private comment: SubBlocks = {} as SubBlocks;
    constructor(protected stream: Stream) {
        super(stream);
    }

    parse({ introducer, label }: ParseParam): void {
        this.offset = this.stream.getOffset();
        this.comment = this.readSubBlocks();
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): CommentExtensionExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: this.comment
        };
    }
}
