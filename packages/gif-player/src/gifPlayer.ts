import { Parser, loadGif } from '@n.see/gif-parser';

export interface FrameData {
    delayTime: number;
    localColorTableFlag: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
    imageData: ImageData;
};

export type HTMLGifElement = HTMLDivElement | HTMLElement;
export type ReadyCallback = (parser: Parser) => void;
export type FrameUpdateCallback = (item: FrameData, frameIndex: number) => void;
export type StateUpdateCallback = ({ isPlay }: { isPlay: boolean}) => void;
export type StepType = 'prev' | 'next';

export default class GifPlayer {
    private width: number = 0;
    private height: number = 0;
    private readyCallback: ReadyCallback;
    private frameUpdateCallback: FrameUpdateCallback;
    private stateUpdateCallback: StateUpdateCallback;
    private container: HTMLGifElement | null = null;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private isPlay: boolean = false;
    private currentPlayFrameIndex: number = 0;
    private frames: Array<FrameData> = [];
    private frameAction: any = [];
    private isHover: boolean = false;
    private isPlayButtonDisplay: boolean = true;
    private playButton: HTMLDivElement = document.createElement('div');

    constructor(private target: string | HTMLGifElement) {
        this.readyCallback = () => {};
        this.frameUpdateCallback = () => {};
        this.stateUpdateCallback = () => {};
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.container = this.getElement(target);
        this.init();
    }

    private init(): void {
        if (!this.container) {
            return;
        }
        this.container.addEventListener('mouseenter', this.handleMouseenter.bind(this));
        this.container.addEventListener('mouseleave', this.handleMouseleave.bind(this));
        const src: string = this.container.dataset.src || ''
        this.setContainerStyle(this.container);
        this.container.appendChild(this.canvas);
        this.playButton = this.createPlayButton();
        this.playButton.addEventListener('click', this.handleToggle.bind(this));
        this.container.appendChild(this.playButton);
        loadGif(src).then((arrayBuffer) => {
            const parser = new Parser(arrayBuffer);
            const [width, height] = parser.getSize();
            this.setSize(width, height);
            this.setCanvasStyle(this.canvas, width, height);
            parser.export();
            this.frames = parser.getFrames();
            this.initFrame(this.frames[0]);
            this.frameAction = this.createFrameAction(this.frames);
            this.readyCallback && this.readyCallback(parser);
            this.stateUpdateCallback && this.stateUpdateCallback({ isPlay: !this.isPlay });
        });
    }

    public handleMouseenter(): void {
        this.isPlayButtonDisplay = true;
        this.isHover = true;
        this.updatePlayButtonDisplay(this.playButton);
    }

    public handleMouseleave(): void {
        this.isHover = false;
        this.updatePlayButtonDisplay(this.playButton);
    }

    public handleToggle(): void {
        this.isPlay = !this.isPlay;
        if (this.isPlay) {
            this.isPlayButtonDisplay = false;
            this.updatePlayButtonDisplay(this.playButton);
        }
        this.buttonIcon(this.playButton);
        this.play();
        this.stateUpdateCallback && this.stateUpdateCallback({ isPlay: !this.isPlay });
    }

    public moveTo(index: number) {
        this.isPlay = false;
        const item = this.frames[index];
        this.renderFrame(item);
        this.frameUpdateCallback && this.frameUpdateCallback(item, this.currentPlayFrameIndex);
        this.stateUpdateCallback && this.stateUpdateCallback({ isPlay: !this.isPlay });
    }

    public step(type: StepType) {
        if (type === 'prev') {
            if (this.currentPlayFrameIndex === 0) {
                this.currentPlayFrameIndex = this.frames.length;
            } 
            this.currentPlayFrameIndex --;
        } else {
            this.currentPlayFrameIndex ++;
            if (this.currentPlayFrameIndex === this.frames.length) {
                this.currentPlayFrameIndex = 0; 
            }
        }
        this.moveTo(this.currentPlayFrameIndex);
    }

    private error(...args: Array<string>) {
        return console.log.apply(console, args);
    }

    private getElement(el: string | HTMLGifElement): HTMLGifElement | null {
        if (typeof el === 'string') {
            if (el.startsWith('.')) {
                if (!document.querySelector(el)) {
                    this.error(`查找不到 ${el.substr(1, el.length)} class`);
                    return null;
                }
                return document.querySelector(el);
            } else if (el.startsWith('#')) {
                if (!document.getElementById(el)) {
                    this.error(`查找不到 ${el.substr(1, el.length)} id`);
                    return null;
                }
                return document.getElementById(el);
            } else {
                this.error('el string must start with "." or "#"');
                return null;
            } 
        } else {
            return el;
        }
    }

    private createFrameAction(frames: Array<FrameData>): Array<(play: () => void) => void> {
        return (frames as Array<FrameData>).map(item => {
            return (play: () => void) => {
                const timer = setTimeout(() => {
                    this.renderFrame(item);
                    this.currentPlayFrameIndex ++;
                    if (this.currentPlayFrameIndex === frames.length) {
                        this.currentPlayFrameIndex = 0;
                    }
                    this.frameUpdateCallback && this.frameUpdateCallback(item, this.currentPlayFrameIndex);
                    this.stateUpdateCallback && this.stateUpdateCallback({ isPlay: !this.isPlay });
                    clearTimeout(timer);
                    this.isPlay && play();
                }, item.delayTime * 10);
            }
        });
    }

    private play(): void {
        this.frameAction[this.currentPlayFrameIndex](this.play.bind(this));
    }

    private updatePlayButtonDisplay(btnDiv: HTMLDivElement): void {
        btnDiv.style.display = this.isHover && this.isPlayButtonDisplay ? 'inline-block' : 'none';
    }

    private initFrame(frameItem: any): void {
        if (!this.context || !frameItem) {
            return;
        }
        this.canvas.width = frameItem.width;
        this.canvas.height = frameItem.height;
        this.context.putImageData(frameItem.imageData, 0, 0);
    }

    canvasToBlob(canvas: HTMLCanvasElement) {
        if (!this.container) {
            return;
        }
        let img: HTMLImageElement = this.container.querySelector('img') as HTMLImageElement;
        if (!img) {
            img = document.createElement("img");
            this.container.appendChild(img);
        }
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            img.onload = function() {
              // no longer need to read the blob so it's revoked
              URL.revokeObjectURL(url);
            };
            img.src = url;
        });   
    }

    private renderFrame(frameItem: any): void {
        if (!this.context || !frameItem) {
            return;
        }
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = frameItem.width;
        tempCanvas.height = frameItem.height;
        const tempContext: CanvasRenderingContext2D = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
        tempContext.putImageData(frameItem.imageData, 0, 0);
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(tempCanvas,
            0, 0, frameItem.width, frameItem.height,
            frameItem.left, frameItem.top,
            frameItem.width, frameItem.height,
        );
    }

    public frameUpdate(frameUpdateCallback: FrameUpdateCallback): this {
        this.frameUpdateCallback = frameUpdateCallback;
        return this;
    }

    public stateUpdate(stateUpdateCallback: StateUpdateCallback): this {
        this.stateUpdateCallback = stateUpdateCallback;
        return this;
    }

    public ready(readyCallback: ReadyCallback): this {
        this.readyCallback = readyCallback;
        return this;
    }

    public setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public getSize(): Array<number> {
        return [this.width, this.height];
    }

    private setContainerStyle(container: HTMLGifElement): void {
        const width = container.dataset.width || '100%';
        const height = container.dataset.height || 'auto';
        container.style.position = 'relative';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.width = this.getParseSize(width);
        container.style.height = this.getParseSize(height);
    }

    private setCanvasStyle(canvas: HTMLCanvasElement, width: number, height: number): void {
        canvas.width = width;
        canvas.height = height;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        canvas.style.backgroundColor = '#eee';
        canvas.style.display = 'block';
        canvas.style.objectFit = 'contain';
    }

    private createPlayButton(): HTMLDivElement {
        const btnDiv = document.createElement('div');
        btnDiv.style.position = 'absolute';
        btnDiv.style.left = '50%';
        btnDiv.style.top = '50%';
        btnDiv.style.transform = 'translate(-50%,-50%)';
        btnDiv.style.fontSize = '0';
        btnDiv.style.cursor = 'pointer';
        btnDiv.style.zIndex = '2';
        this.updatePlayButtonDisplay(btnDiv);
        this.buttonIcon(btnDiv);
        return btnDiv;
    }

    private buttonIcon(btnDiv: HTMLDivElement, width: number = 36, height: number = 36): void {
        const playIcon = `<?xml version="1.0" encoding="UTF-8"?><svg width="${width}" height="${height}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#67a1f5" stroke="#67a1f5" stroke-width="4" stroke-linejoin="round"/><path d="M20 24V17.0718L26 20.5359L32 24L26 27.4641L20 30.9282V24Z" fill="#FFF" stroke="#FFF" stroke-width="4" stroke-linejoin="round"/></svg>`;
        const pauseIcon = `<?xml version="1.0" encoding="UTF-8"?><svg width="${width}" height="${height}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#67a1f5" stroke="#67a1f5" stroke-width="4" stroke-linejoin="round"/><path d="M19 18V30" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 18V30" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        btnDiv.innerHTML = this.isPlay ? pauseIcon : playIcon;
    }

    private getParseSize(width: string): string {
        if (width.endsWith('%') || width.endsWith('px') || width.endsWith('rem') || width.endsWith('vw') || width === 'auto') {
            return width;
        } else if (!Number.isNaN(Number(width))){
            return `${width}px`;
        } else {
            return width;
        }
    }

    static run(target: string | HTMLGifElement): GifPlayer {
        return new GifPlayer(target);
    }

    static selectorAll(target: string): NodeListOf<HTMLGifElement> {
        return document.querySelectorAll(target);
    }
}
