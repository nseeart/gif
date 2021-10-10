
import { Stream } from '../stream';
import { GraphicsControlExtension, IGraphicsControlExtension, GraphicsControlExtensionExportData } from './graphicsControlExtension';
import { CommentExtension, ICommentExtension, CommentExtensionExportData } from './commentExtension';
import { PlainTextExtension, IPlainTextExtension, PlainTextExtensionExportData } from './plainTextExtension';
import { ApplicationExtension, IApplicationExtension, ApplicationExtensionExportData } from './applicationExtension';
import { UnknownExtension, IUnknownExtension, UnknownExtensionExportData } from './unknownExtension';
import { ParseParam } from '../parse';

export type ExtensionExportData = GraphicsControlExtensionExportData | CommentExtensionExportData | PlainTextExtensionExportData | ApplicationExtensionExportData | UnknownExtensionExportData;

export interface IExtension {
    parse(param: ParseParam): void;
    export(): ExtensionExportData;
}

export class Extension implements IExtension {
    private extensionBlock: ExtensionExportData = {} as ExtensionExportData;
    private graphicsControlExtension: IGraphicsControlExtension;
    private plainTextExtension: IPlainTextExtension;
    private commentExtension: ICommentExtension;
    private applicationExtension: IApplicationExtension;
    private unknownExtension: IUnknownExtension;
    constructor(protected stream: Stream) {
        this.stream = stream;
        this.graphicsControlExtension = new GraphicsControlExtension(stream);
        this.commentExtension = new CommentExtension(stream);
        this.plainTextExtension = new PlainTextExtension(stream);
        this.applicationExtension = new ApplicationExtension(stream);
        this.unknownExtension = new UnknownExtension(stream);
    }

    parse({ introducer }: ParseParam): void {
        const label = this.stream.readUint8();
        switch (label) {
            // 249
            case 0xF9: {
                this.graphicsControlExtension.parse({ introducer, label });
                this.extensionBlock = this.graphicsControlExtension.export();
            }
                break;
            // 254
            case 0xFE:
                this.commentExtension.parse({ introducer, label });
                this.extensionBlock = this.commentExtension.export();
                break;
            // 1
            case 0x01:
                this.plainTextExtension.parse({ introducer, label });
                this.extensionBlock = this.plainTextExtension.export();
                break;
            // 255
            case 0xFF: {
                this.applicationExtension.parse({ introducer, label });
                this.extensionBlock = this.applicationExtension.export();
            }
                break;
            default:
                this.unknownExtension.parse({ introducer, label });
                this.extensionBlock = this.unknownExtension.export();
                break;
        }
    }

    export(): ExtensionExportData {
        return this.extensionBlock;
    }
}
