
import { Stream } from "../stream";
import { IParses } from '../parse';
import { Extension, IExtension, ExtensionExportData } from "./extension";
import { ImageData, IImageData } from "./imageData";
import { ImageDescriptorData } from "./imageDescriptor";
import { ImageContentData } from "./imageContent";
import { ColorTableExportData } from "./colorTable";

export type BlocksExportData = Array<ImageContentData | ImageDescriptorData | ExtensionExportData>;

export class Block {
    type: string = 'Block';
    offset: number = 0;
    length: number = 0;
    private blocks: Array<any>  = [];
    private extension: IExtension;
    private imageData: IImageData;
    constructor(private stream: Stream) {
        this.stream = stream;
        this.extension = new Extension(this.stream);
        this.imageData = new ImageData(this.stream);
    }

    parse(globalColorTableExportData?: ColorTableExportData) {
        this.offset = this.stream.getOffset();
        while (this.stream.hasMore()) {
        const introducer = this.stream.readUint8();
            switch (String.fromCharCode(introducer)) { // For ease of matching
                case '!':
                    this.extension.parse({ introducer });
                    this.blocks.push(this.extension.export());
                    break;
                case ',':
                    this.imageData.parse({ introducer });
                    this.blocks.push(...this.imageData.export());
                    // this.blocks.push(this.imageData.exportFrameData(globalColorTableExportData))
                    break;
                case ';':
                    // End Of File
                    console.log('end block');
                    break;
                default:
                    throw new Error('Unknown block: 0x' + introducer.toString(16)); // TODO: Pad this with a 0.
            }
        }
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): BlocksExportData  {
        return this.blocks;
    }
}
