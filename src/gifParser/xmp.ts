type Source = ArrayBuffer | Uint8Array | string | String | null;

export class XMP {
    public buffer: Source = null;
    static buffer: Source = null;
    constructor(source: Source) {
        if (source instanceof ArrayBuffer) {
            this.buffer = source;
        } else if (source instanceof Uint8Array) {
            this.buffer = source.buffer;
        } else if (typeof source === "string" || source instanceof String) {
            this.fromDataUri(source);
        }
    }

    static dataUriToBuffer(dataUri: string | String) {
        let byteString = atob(dataUri.split(",")[1]),
            length = byteString.length,
            out = new ArrayBuffer(length),
            arr = new Uint8Array(out);
        for (let i = 0; i < length; i++) {
            arr[i] = byteString.charCodeAt(i);
        }
        return out;
    }

    static find(source: Source) {
        let buffer;
        if (source instanceof ArrayBuffer) {
            buffer = source;
        } else if (source instanceof Uint8Array) {
            this.buffer = source.buffer;
        } else if (typeof source === "string" || source instanceof String) {
            buffer = XMP.dataUriToBuffer(source);
        }

        let view = new DataView(buffer as ArrayBuffer);

        // if (view.getUint16(0, false) !== 0xFFD8) {
        //     console.warn("not valid JPEG");
        //     return null;
        // }

        if (!buffer) {
            return;
        }

        const startStr = "<x:xmpmeta",
            startStrLength = startStr.length,
            maxStart = buffer.byteLength - startStrLength,
            endStr = "x:xmpmeta>",
            endStrLength = endStr.length,
            maxEnd = buffer.byteLength - endStrLength;

        let start = 2,
            end = start + startStrLength,
            found = false;

        while (start < maxStart) {
            if (XMP.stringFromBuffer(view, start, startStrLength) == startStr) {
                found = true;
                break;
            } else {
                start++;
            }
        }

        if (!found) {
            console.warn("XMP not found");
            return null;
        }

        while (end < maxEnd) {
            if (XMP.stringFromBuffer(view, end, endStrLength) == endStr) {
                break;
            } else {
                end++;
            }
        }

        end += endStrLength;
        return XMP.stringFromBuffer(view, start, end - start);
    }

    static stringFromBuffer(buffer: DataView, start: number, length: number) {
        let out = "";
        for (let i = start; i < start + length; i++) {
            out += String.fromCharCode(buffer.getUint8(i));
        }
        return out;
    }

    static execFind(str: string, reg: RegExp) {
        let result = [];
        let isEmpty: boolean = true;
        while(isEmpty) {
            let regRxpRxecArray: RegExpExecArray | null = reg.exec(str);
            if (regRxpRxecArray) {
                result.push(regRxpRxecArray)
            } else {
                isEmpty = false;
            }
        }
        return result;
    }

    static toTree(result: Array<any>): Array<any> {
        let tree: Array<any> = [];
        if (!result || !result.length) {
          return tree;
        }
        const first = result.shift();
        const firstEndIndex = result.findIndex(item => {
            return `</${first.tag}>` === item.raw;
        });
        result.splice(firstEndIndex, 1);
        tree.push({
            ...first,
            children: XMP.toTree(result)
        });
        return tree;
    }

    static parse(xmp: string) {
        if (!xmp) {
            return null;
        }
        const lineReg = new RegExp(`<[^>]+>`, "gi");
        const lineList = XMP.execFind(xmp, lineReg);
        const out: Array<any> = lineList.map((item, i) => {
            const tagReg = new RegExp('<(.*?)\\s', "g");
            const attrReg = new RegExp('\\s(.*?)="(.*?)"', "g");
            const raw = item[0];
            const tagRes = tagReg.exec(raw);
            const attrExecList = XMP.execFind(raw, attrReg);
            let attrs: Record<string, string> = {};
            attrExecList.forEach(element => {
                const [,key, value] = element;
                attrs[key] = value;
            });
            return {
                raw,
                tag: tagRes ? tagRes[1] : null,
                attrs
            }
        });

        return XMP.toTree(out);
    }

    fromDataUri(dataUri: string | String) {
        this.buffer = XMP.dataUriToBuffer(dataUri);
    }

    find() {
        return XMP.find(this.buffer) || '';
    }

    parse() {
        let xmp = this.find();
        return XMP.parse(xmp);
    }
}

export default XMP;