
import { ColorTable } from "./colorTable";
import { Stream } from "../stream";

export class GlobalColorTable extends ColorTable {
    constructor(stream: Stream) {
        super(stream, 'GlobalColorTable');
    }
}
