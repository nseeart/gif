
import { ColorTable } from "../parses/colorTable";
import { Stream } from "../stream";

export class LocalColorTable extends ColorTable {
    constructor(stream: Stream) {
        super(stream, 'LocalColorTable');
    }
}
