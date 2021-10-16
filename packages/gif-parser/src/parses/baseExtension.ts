
import { Stream } from "../stream";
import { ParseParam } from '../parse';

export interface SubBlocks {
    blocks: Array<{
        offset: number;
        length: number;
    }>;
    blocksLength: number;
}

export class BaseExtension {
    protected stream: Stream;
    constructor(stream: Stream) {
        this.stream = stream;
    }

    parse(param: ParseParam): void {}

    export(): any {}

    protected readSubBlocks(): SubBlocks {
        const offset = this.stream.getOffset();
        let size = this.stream.readInt8();
        let length = 1;
        const blocks = [];
        while (size > 0) {
            blocks.push({ offset: offset + length, length: size });
            length += size + 1;
            this.stream.seek(size);
            size = this.stream.readUint8();
        }
        return {
            blocks,
            blocksLength: length
        };
    }
}
