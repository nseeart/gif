
import { Stream } from '../stream';
import { LocalColorTable } from "./localColorTable";
import { ColorTable } from './colorTable';
import { ImageDescriptor, ImageDescriptorExportData } from './imageDescriptor';
import { ImageContent, ImageContentExportData } from './imageContent';
import { ParseParam } from '../parse';
import { ColorTableExportData } from './colorTable';

export type ImageDataExportData = Array<ImageDescriptorExportData | ImageContentExportData>;

type ColorTableList = Array<Array<number>>;
type ColorIndexStream = Array<number>;

export interface IImageData {
    parse(param: ParseParam): void;
    export(): ImageDataExportData;
    exportFrameData(globalColorTableExportData?: ColorTableExportData): any;
}

export class ImageData implements IImageData {
    private localColorTable: ColorTable;
    private imageDescriptor: ImageDescriptor;
    private imageContent: ImageContent;

    constructor(private stream: Stream) {
        this.stream = stream;
        this.localColorTable = new LocalColorTable(stream);
        this.imageDescriptor = new ImageDescriptor(stream);
        this.imageContent = new ImageContent(stream);
    }

    parse({ introducer }: ParseParam) {
        this.imageDescriptor.parse({ introducer });
        if (this.imageDescriptor.hasLocalColorTable()) {
            const localColorTableSize = this.imageDescriptor.getLocalColorTableSize();
            this.localColorTable.parse({ size: localColorTableSize });
        }
        this.imageContent.parse();
    }

    createFrame(colorTable: ColorTableList, cidx: ColorIndexStream, width: number, height: number) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        const imgData = context.createImageData(width, height);
        const pixels = imgData.data;
        for (let i = 0, poff = 0; i < cidx.length; i += 1, poff += 4) {
                pixels[poff + 0] = colorTable[cidx[i]][0];
                pixels[poff + 1] = colorTable[cidx[i]][1];
                pixels[poff + 2] = colorTable[cidx[i]][2];
                pixels[poff + 3] = (cidx[i] !== 88) ? 255 : 0;
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
