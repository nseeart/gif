import { Stream } from "./stream";
import { Header, HeaderExportData } from "./parses/header";
import { LogicalScreenDescriptor, LogicalScreenDescriptorExportData } from "./parses/logicalScreenDescriptor";
import { ColorTableExportData } from "./parses/colorTable";
import { GlobalColorTable } from "./parses/globalColorTable";
import { Block } from "./parses/block";
import { ExtensionExportData } from "./parses/extension";
import { ImageDescriptorExportData } from "./parses/imageDescriptor";
import { ImageContentExportData } from "./parses/imageContent";

export interface FrameData {
    imageData: ImageData;
    delayTime: number;
    transparency: number | null;
    left: number;
    top: number;
    width: number;
    height: number;
    disposalMethod?: number;
    colorTable?: Array<Array<number>>;
    indexStream?: Array<number>;
    localColorTableFlag?: boolean;
    offset?: number;
    length?: number;
};

export type FrameExportData = {
    type: string;
    data: FrameData
};
export type ExportBlockItem = HeaderExportData | LogicalScreenDescriptorExportData | ColorTableExportData | ExtensionExportData | ImageDescriptorExportData | ImageContentExportData | FrameExportData ;
export type ExportBlockList = Array<ExportBlockItem>;
export type ExportBlockItemType = 'Header' | 'LogicalScreenDescriptor' | 'GlobalColorTable' | 'LocalColorTable' | 'ImageDescriptor' | 'ImageContent';
export type ColorTable = Array<Array<number>>;
export type IndexStream = Array<number>;
export type FramesData = Array<FrameData>;

export class Parser {
    private parsed: boolean;
    private blockList: ExportBlockList;
    private dataList: ExportBlockList;
    private stream: Stream;
    private header: Header;
    private logicalScreenDescriptor: LogicalScreenDescriptor;
    private globalColorTable: GlobalColorTable;
    private block: Block;
    private isExport: boolean = false;

    constructor(arrayBuffer: ArrayBuffer) {
        console.log('GifParser init')
        this.parsed = false;
        this.blockList = [];
        this.dataList = [];
        this.stream = new Stream(arrayBuffer, true);
        this.header = new Header(this.stream);
        this.logicalScreenDescriptor = new LogicalScreenDescriptor(this.stream);
        this.globalColorTable = new GlobalColorTable(this.stream);
        this.block = new Block(this.stream);
        this.parse();
    }

    private parse(): void {
        if (this.parsed) {
            return;
        }
        this.header.parse();
        this.logicalScreenDescriptor.parse();
        if (this.logicalScreenDescriptor.hasGlobalColorTable()) {
            const size = this.logicalScreenDescriptor.getGlobalColorTableSize();
            this.globalColorTable.parse({ size });
        }
        this.block.parse(this.logicalScreenDescriptor.hasGlobalColorTable() ? this.globalColorTable.export() : undefined);
        this.parsed = true;
    }

    getSize(): Array<number> {
        const { data } = this.logicalScreenDescriptor.export();
        return [data.width, data.height];
    }

    export(): void {
        if (this.isExport) {
            return;
        }
        this.blockList.push(this.header.export());
        this.blockList.push(this.logicalScreenDescriptor.export());
        if (this.logicalScreenDescriptor.hasGlobalColorTable()) {
            this.blockList.push(this.globalColorTable.export());
        }
        this.blockList.push(...this.block.export() as ExportBlockList);
        this.dataHandler();
        this.isExport = true;
    }

    private exportWarn(): Array<any> {
        console.warn.call(this, `parser.export()`);
        return [];
    }

    getBlockList(): ExportBlockList {
        return this.blockList;
    }

    getDataList(): ExportBlockList {
        if (!this.isExport) {
            return this.exportWarn();
        }
        return this.dataList;
    }

    private createImageData({colorTable, indexStream, width, height, transparency}: Record<string, any>): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        const imageData = context.createImageData(width, height);
        const pixels = imageData.data;
        for (let i = 0, poff = 0; i < indexStream.length; i += 1, poff += 4) {
            if (indexStream[i] !== transparency) {
                pixels[poff + 0] = colorTable[indexStream[i]][0];
                pixels[poff + 1] = colorTable[indexStream[i]][1];
                pixels[poff + 2] = colorTable[indexStream[i]][2];
                pixels[poff + 3] = 255;
            } else {
                pixels[poff + 0] = 0;
                pixels[poff + 1] = 0;
                pixels[poff + 2] = 0;
                pixels[poff + 3] = 0;
            }
        }
        return imageData;
    }

    private dataHandler(): void {
        let frameData: Record<string, any> = {};
        const globalColorTable = this.blockList.find(item => item.type === 'GlobalColorTable');
        this.blockList.forEach((item) => {
            if (item.type === 'GraphicsControlExtension') {
                frameData[item.type] = item.data;
                this.dataList.push(item);
            } else if (item.type === 'ImageDescriptor') {
                frameData[item.type] = item.data;
                this.dataList.push(item);
            } else if (item.type === 'ImageContent') {
                frameData[item.type] = item.data;
                this.dataList.push(item);
                const { delayTime, disposalMethod, transparentColorFlag, transparentColorIndex } = frameData.GraphicsControlExtension;
                const { localColorTableFlag, left, top, width, height } = frameData.ImageDescriptor;
                const { indexStream } = frameData.ImageContent;
                const transparency = transparentColorFlag ? transparentColorIndex: null;
                const colorTable = localColorTableFlag ? null : globalColorTable?.data;
                
                frameData['Frame'] = {
                    delayTime,
                    disposalMethod,
                    transparency,
                    colorTable,
                    indexStream,
                    left, top, width, height
                }
                Object.assign(frameData['Frame'], {
                    imageData: this.createImageData(frameData['Frame'])
                });
                this.dataList.push({
                    type: 'Frame',
                    data: frameData['Frame']
                });
            } else {
                this.dataList.push(item);
            }
        });
    }

    getFrames(): FramesData {
        if (!this.isExport) {
            return this.exportWarn();
        }
        return this.dataList
            .filter(item => item.type === 'Frame')
            .map(item => {
                const { delayTime, transparency, left, top, width, height, imageData }: FrameData = item.data as FrameData;
                return {
                    delayTime, transparency, left, top, width, height, imageData
                }
            });
    }

    getBlockItem(type: ExportBlockItemType): ExportBlockItem  {
        const currentItem = this.blockList.find(item => item.type === type);
        return (currentItem && currentItem.data) as ExportBlockItem;
    }
}