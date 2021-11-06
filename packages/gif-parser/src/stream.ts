
export class Stream {

    private index: number = 0;
    private dataView: DataView;

    constructor(private arrayBuffer: ArrayBuffer, private littleEndian?: boolean) {
        this.dataView = new DataView(arrayBuffer);
        this.littleEndian = littleEndian || false;
    }

    check(size: number): boolean {
        if (this.index + size <= this.dataView.byteLength) {
            return true;
        }
        return false;
    }

    seek(x: number): void {
        this.index += x;
    }

    peekByte(offset = 0): number {
        this.check(1 + offset);
        return this.dataView.getUint8(this.index + offset);
    }

    slice(offset: number, length: number): Uint8Array {
        const ab = new Uint8Array(this.dataView.buffer, offset, length);
        return ab;
    }

    readUint8(): number {
        this.check(1);
        const value = this.dataView.getUint8(this.index);
        this.seek(1);
        return value;
    }

    readUint8Array(len: number): Array<number> {
        const r = [];
        for (let i = 0; i < len; i++) {
            r.push(this.readUint8());
        }
        return r;
    }

    readUint16(): number {
        this.check(2);
        const value = this.dataView.getUint16(this.index, this.littleEndian);
        this.seek(2);
        return value;
    }


    readUint32(): number {
        this.check(4);
        const val = this.dataView.getUint32(this.index, this.littleEndian);
        this.seek(4);
        return val;
    }

    readInt32(): number {
        this.check(4);
        const val = this.dataView.getInt32(this.index, this.littleEndian);
        this.seek(4);
        return val;
    }

    readString(len: number): string {
        let str = '';
        for (let i = 0; i < len; i++) {
            str += String.fromCharCode(this.readUint8());
        }
        return str;
    }

    readEscapedString(len: number): string {
        let str: string = '';
        for (let i = 0; i < len; i++) {
            const char: number = this.readUint8();
            if (char >= 32 && char <= 126) {
                str += String.fromCharCode(char);
            } else {
                str += `\\x${char.toString(16).padStart(2, '0')}`;
            }
        }
        return str;
    }

    readNullTerminatedString(): string {
        let str: string = '';
        let val: number = this.readUint8();
        while (val !== 0) {
            str += String.fromCharCode(val);
            val = this.readUint8();
        }
        return str;
    }

    hasMore(x?: number): boolean {
        this.check(1);
        return this.index <= this.dataView.byteLength - (x || 1);
    }

    setOffset(offset: number) {
        this.index = offset;
    }

    getOffset(): number {
        return this.index;
    }

    readInt8(): number {
        const value = this.dataView.getInt8(this.index);
        this.seek(1);
        return value;
    }
}
