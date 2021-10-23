import { Stream } from "./stream";

export function bitsToNum(ba: Array<boolean>): number {
    return ba.reduce(function (s, n) {
        return s * 2 + Number(n);
    }, 0);
}

export function bitsToNumber(ba: Array<number>): number {
    return ba.reduce((s, n) => s * 2 + n, 0);
}

export function byteToBitArr(bite: number): Array<boolean> {
    let a = [];
    for (let i = 7; i >= 0; i--) {
        a.push(!!(bite & (1 << i)));
    }
    return a;
};

export function byteToBits(bite: number): Array<number> {
    let a = [];
    for (let i = 7; i >= 0; i--) {
        a.push(!!(bite & (1 << i)));
    }
    return a.map(n => Number(n));
};

export function loadGif(url: string) {
    return fetch(url)
        .then((resp) => resp.arrayBuffer());
}

export function getBytes(stream: Stream, offset: number, length: number): Uint8Array {
    try {
        return stream.slice(offset, length);
    } catch (error) {
        return new Uint8Array(0);
    }
}

export function numberToHex(n: number): string {
    const hex = parseInt(`${n}`).toString(16);
    return (hex.length === 2 ? hex : `0${hex}`).toUpperCase();
}

export function copyImageData(imagedata: ImageData): ImageData {
    return new ImageData(new Uint8ClampedArray(imagedata.data), imagedata.width, imagedata.height);
}
