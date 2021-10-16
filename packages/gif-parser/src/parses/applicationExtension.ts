
import { Stream } from "../stream";
import { IParse, IData, ParseParam } from '../parse';
import { getBytes, numberToHex } from '../utils';
import { BaseExtension } from "./baseExtension";
import { NetscapeExtension, NetscapeExtensionExportData } from "./netscapeExtension";
import { XMPDataExtension, XMPDataExtensionExportData } from "./XMPDataExtension";
import { UnknownApplicationExtension, UnknownApplicationExtensionExportData } from "./unknownApplicationExtension";

export type AppData = UnknownApplicationExtensionExportData | NetscapeExtensionExportData | XMPDataExtensionExportData;

export interface ApplicationExtensionData {
    introducer: string;
    label: string;
    blockSize: number;
    identifier: string;
    authenticationCode: string;
    appData: AppData;
}

export type ApplicationExtensionExportData = IData<ApplicationExtensionData>

export interface IApplicationExtension extends IParse<ApplicationExtensionData> {}

export class ApplicationExtension extends BaseExtension {
    private type: string = 'ApplicationExtension';
    private offset: number = 0;
    private length: number = 0;
    private bytes: Uint8Array = new Uint8Array(0);
    private introducer: string = '';
    private label: string = '';
    private blockSize: number = 0;
    private identifier: string = '';
    private authenticationCode: string = '';
    private appData: AppData;

    private netscapeExtension: NetscapeExtension;
    private xmpdataExtension: XMPDataExtension;
    private unknownApplicationExtension: UnknownApplicationExtension;

    constructor(protected stream: Stream) {
        super(stream);
        this.netscapeExtension = new NetscapeExtension(stream);
        this.xmpdataExtension = new XMPDataExtension(stream);
        this.unknownApplicationExtension = new UnknownApplicationExtension(stream);
        this.appData = {} as AppData;
    }

    parse({ introducer = 0, label = 0 }: ParseParam): void {
        this.introducer = String.fromCharCode(introducer);
        this.label = numberToHex(label);
        this.offset = this.stream.getOffset() - 2;
        this.blockSize = this.stream.readInt8(); // Always 11
        this.identifier = this.stream.readString(8);
        this.authenticationCode = this.stream.readString(3);
        if (this.identifier === 'NETSCAPE') {
            this.netscapeExtension.parse({ introducer, label });
            this.appData = this.netscapeExtension.export();
        } else if (this.identifier === 'XMP Data') {
            this.xmpdataExtension.parse({ introducer, label });
            this.appData = this.xmpdataExtension.export();
        } else {
            this.unknownApplicationExtension.parse({ introducer, label });
            this.appData = this.unknownApplicationExtension.export();
        }
        this.length = this.stream.getOffset() - this.offset;
    }

    export(): ApplicationExtensionExportData {
        return {
            type: this.type,
            offset: this.offset,
            length: this.length,
            bytes: getBytes(this.stream, this.offset, this.length),
            data: {
                introducer: this.introducer,
                label: this.label,
                blockSize: this.blockSize,
                identifier: this.identifier,
                authenticationCode: this.authenticationCode,
                appData: this.appData
            }
        };
    }
}
