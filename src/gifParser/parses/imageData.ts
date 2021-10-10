
import { Stream } from '../stream';
import { LocalColorTable } from "./localColorTable";
import { IColorTable } from './colorTable';
import { IImageDescriptor, ImageDescriptor, ImageDescriptorExportData } from './imageDescriptor';
import { IImageContent, ImageContent, ImageContentExportData } from './imageContent';
import { ParseParam } from '../parse';
import { ColorTableExportData } from './colorTable';

export type ImageDataExportData = Array<ImageDescriptorExportData | ImageContentExportData>;

type ColorTable = Array<Array<number>>;
type ColorIndexStream = Array<number>;

export interface IImageData {
    parse(param: ParseParam): void;
    export(): ImageDataExportData;
    exportFrameData(globalColorTableExportData?: ColorTableExportData): any;
}

export class ImageData implements IImageData {
    private localColorTable: IColorTable;
    private imageDescriptor: IImageDescriptor;
    private imageContent: IImageContent;

    constructor(private stream: Stream) {
        this.stream = stream;
        this.localColorTable = new LocalColorTable(stream);
        this.imageDescriptor = new ImageDescriptor(stream);
        this.imageContent = new ImageContent(stream);
    }

    parse({ introducer }: ParseParam) {
        this.imageDescriptor.parse({ introducer });
        if (this.imageDescriptor.hasLocalColorTable()) {
            // debugger;
            const localColorTableSize = this.imageDescriptor.getLocalColorTableSize();
            const size = 1 << (localColorTableSize + 1);
            this.localColorTable.parse({ size });
        }
        this.imageContent.parse({ introducer });
    }

    createFrame(colorTable: ColorTable, cidx: ColorIndexStream, width: number, height: number) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        const imgData = context.createImageData(width, height);
        const pixels = imgData.data;
        // const transparency = 88;
        for (let i = 0, poff = 0; i < cidx.length; i += 1, poff += 4) {
            /* eslint-disable prefer-destructuring */
            // if (cidx[i] === 88) {
            //     console.log('cidx[i]', cidx[i] === 88);
            // }
            

                pixels[poff + 0] = colorTable[cidx[i]][0];
                pixels[poff + 1] = colorTable[cidx[i]][1];
                pixels[poff + 2] = colorTable[cidx[i]][2];
                pixels[poff + 3] = (cidx[i] !== 88) ? 255 : 0;
            /* eslint-enable prefer-destructuring */
        }
        return imgData;
    }

    exportFrameData(globalColorTableExportData?: ColorTableExportData): any {
        const { width, height, left, top, localColorTableFlag } = this.imageDescriptor.export().data;
        const { indexStream } = this.imageContent.export().data;
        let colorTableData = this.imageDescriptor.hasLocalColorTable()
            ? this.localColorTable.export()
            : globalColorTableExportData || {} as ColorTableExportData;
        return {
            type: 'Frame',
            data: {
                width, height, left, top, localColorTableFlag,
                // indexStream,
                // colorTable: colorTableData.data
                imageData: this.createFrame(colorTableData.data, indexStream, width, height)
            }
        };
    }

    export(): ImageDataExportData {
        const id = this.imageDescriptor.export();
        const ic = this.imageContent.export();
        if (!this.imageDescriptor.hasLocalColorTable()) {
            return [id, ic];
        }
        const lct = this.localColorTable.export();
        return [id, lct, ic];
    }
}
