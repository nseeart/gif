
import { Stream } from '../stream';
import { IData } from '../parse';
import { getBytes } from '../utils';
import { BitReader } from '../bitReader';

export interface LzwData {
    offset: number;
    length: number;
    type: string;
    lzwMinimumCodeSize: number;
    blocks: any
}
export type ImageContentData = Record<string, any>;
export type ImageContentExportData = IData<ImageContentData>

export class ImageContent {
    private type: string = 'ImageContent';
    private offset: number = 0;
    private length: number = 0;
    private bytes: Uint8Array = new Uint8Array(0);
    private children: ImageContentData  = {};

    constructor(private stream: Stream) {
        this.stream = stream;
    }

    parse() {
        this.offset = this.stream.getOffset();
        const lzwData = this.readImageContent();
        this.children = this.lzwDecode(lzwData);
        this.length = this.stream.getOffset() - this.offset;
    }

    private lzwDecode(data: LzwData) {
        const { blocks, lzwMinimumCodeSize } = data;

        const indexStream = [];
        const codeUnits = [];
        let codeStream: Array<number> = [];
        let codeTable: Array<Array<number>> = [];
        const br = new BitReader();
        const clearCode = 2 << (lzwMinimumCodeSize - 1);
        const eoiCode = clearCode + 1;

        let lastCode = eoiCode;
        let size = lzwMinimumCodeSize + 1;
        let growCode = (2 << size - 1) - 1;

        let isInitialized = false;
        let blockIndex = 0;

        for (const { offset, length } of blocks) {
            blockIndex++;
            br.pushBytes(this.stream.slice(offset, length));
            while (br.hasBits(size)) {
                const codeStart = br.getState();
                const code = br.readBits(size);
                if (code === eoiCode) {
                    codeStream.push(code);
                    break;
                } else if (code === clearCode) {
                    codeUnits.push({ stream: [], table: [], start: codeStart });
                    codeStream = codeUnits[codeUnits.length - 1].stream;
                    codeTable = codeUnits[codeUnits.length - 1].table;
                    for (let i = 0; i <= eoiCode; i++) {
                        codeTable[i] = (i < clearCode) ? [i] : [];
                    }
                    lastCode = eoiCode;
                    size = lzwMinimumCodeSize + 1;
                    growCode = (2 << size - 1) - 1;
                    isInitialized = false;
                } else if (!isInitialized) {
                    indexStream.push(...codeTable[code]);
                    isInitialized = true;
                } else {
                    let k = 0;
                    const prevCode = codeStream[codeStream.length - 1];
                    if (code <= lastCode) {
                        indexStream.push(...codeTable[code]);
                        // eslint-disable-next-line prefer-destructuring
                        k = codeTable[code][0];
                    } else {
                        // eslint-disable-next-line prefer-destructuring
                        k = codeTable[prevCode][0];
                        indexStream.push(...codeTable[prevCode], k);
                    }
                    if (lastCode < 0xFFF) {
                        lastCode += 1;
                        codeTable[lastCode] = [...codeTable[prevCode], k];
                        if (lastCode === growCode && lastCode < 0xFFF) {
                            size += 1;
                            growCode = (2 << size - 1) - 1;
                        }
                    }
                }
                codeStream.push(code);
            }
        }
        return Object.assign({}, data, {
            indexStream,
            clearCode,
            eoiCode,
            codeUnits,
            blockCount:
            blocks.length,
            codeUnitCount: codeUnits.length,
        });
    };
    

    export(): ImageContentExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: this.children
        };
    }

    private readImageContent() {
        const offset = this.stream.getOffset();
        const lzwMinimumCodeSize = this.stream.readUint8();
        let { blocks } = this.readSubBlocks();
        const length = this.stream.getOffset() - offset;
        return {
            offset,
            length,
            type: 'image',
            lzwMinimumCodeSize,
            blocks
        }
    }

    private readSubBlocks() {
        const offset = this.stream.getOffset();
        let blockSize = this.stream.readUint8();
        let length = 1;
        const blocks: Array<{
            offset: number,
            length: number
        }> = [];
        while(blockSize > 0) {
            blocks.push({ offset: offset + length, length: blockSize });
            length += blockSize + 1;
            this.stream.seek(blockSize);
            blockSize = this.stream.readUint8();
        }
        length += 1;
        return {
            blocks,
            blocksLength: length
        };
    }
}
