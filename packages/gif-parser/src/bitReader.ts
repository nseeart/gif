
export type Bytes = Int8Array | Uint8Array;
export type GetState = {
    bitOffset: number,
    byteOffset: number
}

export interface IBitReader {
    readBits(len: number): number;
    hasBits(len?: number): boolean;
    setBytes(bytes: any, byteOffset?: number, bitOffset?: number): void
    pushBytes(bytes: Bytes): void;
    getState(): GetState;
}

export class BitReader implements IBitReader {
    private bytes: Bytes;
    private byteOffset: number;
    private bitOffset: number;
    private totalByteOffset: number;
    constructor(bytes?: Bytes) {
        this.bytes = bytes || new Int8Array();
        this.byteOffset = 0;
        this.bitOffset = 0;
        this.totalByteOffset = 0;
    }

    readBits(len: number) {
        let result = 0;
        let rbits = 0;
        while (rbits < len) {
            if (this.byteOffset >= this.bytes.length) {
                throw new Error(`Not enough bytes to read ${len} bits (read ${rbits} bits)`);
            }
            const bbits = Math.min(8 - this.bitOffset, len - rbits);
            const mask = (0xFF >> (8 - bbits)) << this.bitOffset;
            result += ((this.bytes[this.byteOffset] & mask) >> this.bitOffset) << rbits;
            rbits += bbits;
            this.bitOffset += bbits;
            if (this.bitOffset === 8) {
                this.byteOffset += 1;
                this.totalByteOffset += 1;
                this.bitOffset = 0;
            }
        }
        return result;
    }

    hasBits(len: number = 1) {
        if (len > 12) {
            throw new Error(`Exceeds max bit size: ${len} (max: 12)`);
        }
        if (this.byteOffset >= this.bytes.length) return false;
        const bitsRemain = 8 - this.bitOffset;
        if (len <= bitsRemain) return true;
        const bytesRemain = this.bytes.length - this.byteOffset - 1;
        if (bytesRemain < 1) return false;
        if (len > bitsRemain + 8 * bytesRemain) return false;
        return true;
    }

    setBytes(bytes: Bytes, byteOffset: number = 0, bitOffset: number = 0) {
        this.bytes = bytes;
        this.byteOffset = byteOffset;
        this.bitOffset = bitOffset;
    }

    pushBytes(bytes: Bytes): void {
        if (this.hasBits()) {
            const remainBytes = this.bytes.length - this.byteOffset;
            const extended = new Uint8Array(remainBytes + bytes.length);
            extended.set(this.bytes.slice(this.byteOffset));
            extended.set(bytes, remainBytes);
            this.bytes = extended;
            this.byteOffset = 0;
        } else {
            this.bytes = bytes;
            this.byteOffset = 0;
            this.bitOffset = 0;
        }
    }

    getState(): GetState {
        return {
            bitOffset: this.bitOffset,
            byteOffset: this.totalByteOffset,
        };
    }
}
