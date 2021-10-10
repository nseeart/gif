<template>
    <div class="gif-player">
        <canvas ref="gifPlayer"></canvas>
        <div class="gif-toolbar">
            <span class="gif-toolbar-btn gif-toolbar-frame">{{ currentPlayFrameIndex }} / {{ frames.length }}</span>
            <span class="gif-toolbar-btn">
                <a @click="handleStep('prev')">prev</a>
            </span>
            <span class="gif-toolbar-btn">
                <a @click="handlePlay"> {{ isPlay ? 'Pause': 'Play' }}</a>
            </span>
            <span class="gif-toolbar-btn">
                <a @click="handleStep('next')">next</a>
            </span>
            <span class="gif-toolbar-btn gif-toolbar-btn-restart">
                <a @click="handleRestart">restart</a>
            </span>
        </div>
    </div>
  </template>  

<script setup lang="ts">
import { onMounted, watchEffect, ref, Ref, defineExpose, ComputedRef, computed } from "vue";

interface FrameData {
    // colorTable: Array<Array<number>>;
    delayTime: number;
    // indexStream: Array<number>;
    localColorTableFlag: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
    imageData: ImageData;
};

interface FrameHanderData extends FrameData {
    render(play: any): void;
}

type FrameAwaitAction = (play: any) => void;

let context: Ref<CanvasRenderingContext2D | null> = ref(null);

const props = defineProps({
    frames: {
        type: Array,
        default: () => []
    },
    width: {
        type: Number,
        default: 200
    },
    height: {
        type: Number,
        default: 200
    }
});

const gifPlayer: Ref<HTMLCanvasElement| null> = ref(null);
const isPlay: Ref<boolean> = ref(false);
const currentPlayFrameIndex: Ref<number> = ref(0);

const frameList: ComputedRef<Array<FrameAwaitAction>> = computed(() => {
    return (props.frames as Array<FrameData>).map(item => {
        return (play) => {
            const timer = setTimeout(() => {
                renderFrame(item);
                currentPlayFrameIndex.value ++;
                if (currentPlayFrameIndex.value === props.frames.length) {
                    currentPlayFrameIndex.value = 0;
                }
                clearTimeout(timer);
                isPlay.value && play();
            }, item.delayTime * 10);
        }
    });
});

function play(): void {
    frameList.value[currentPlayFrameIndex.value](play);
}

const frame: ComputedRef<FrameData> = computed(() => {
    return props.frames[0] as FrameData;
});

const bgColor: ComputedRef<string> = computed(() => {
    if (!frame.value) {
        return `rgba(255, 255, 255, 1)`;
    }
    const color = frame.value.imageData.data.slice(0, 3);
    return `rgba(${color}, 1)`;
});

function stepRender(index: number) {
    isPlay.value = false;
    renderFrame(props.frames[index]);
}

const handlePlay = () => {
    isPlay.value = !isPlay.value;
    play()
};

const handleStep = (type: string) => {
    if (type === 'prev') {
        if (currentPlayFrameIndex.value === 0) {
            currentPlayFrameIndex.value = props.frames.length;
        } 
        currentPlayFrameIndex.value --;
    } else {
        currentPlayFrameIndex.value ++;
        if (currentPlayFrameIndex.value === props.frames.length) {
            currentPlayFrameIndex.value = 0; 
        }
    }
    stepRender(currentPlayFrameIndex.value);
}

const handleRestart = () => {
    stepRender(0);
};

watchEffect(() => {
    isPlay.value = false;
    init(gifPlayer.value as HTMLCanvasElement, props.frames[0]);
});

function init(canvas: HTMLCanvasElement, frameItem: any) {
    if (!canvas || !frameItem) {
        return;
    }
    canvas.width = props.width;
    canvas.height = props.height;
    context.value = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.value.putImageData(frameItem.imageData, 0, 0);
}

function renderFrame(frameItem: any) {
    if (!context.value || !frameItem) {
        return;
    }
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = frameItem.width;
    tempCanvas.height = frameItem.height;
    const tempContext: CanvasRenderingContext2D = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
    tempContext.putImageData(frameItem.imageData, 0, 0);
    context.value.drawImage(tempCanvas,
        0, 0, frameItem.width, frameItem.height,
        frameItem.left, frameItem.top, frameItem.width, frameItem.height,
    );
}

defineExpose({
    gifPlayer,
    currentPlayFrameIndex,
    bgColor,
    handlePlay,
    handleRestart,
    handleStep,
});

</script>

<style scoped>
.gif-player {
    width: 100%;
    padding: 20px;
    background-color: #fff;
}

.gif-toolbar {
    position: relative;
    background-color: #ddd;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    line-height: 24px;
}

.gif-toolbar-btn {
    background-color: #999;
    display: inline-block;
    width: 48px;
    margin: 0 5px;
    font-size: 13px;
    line-height: 18px;
    text-align: center;
}

.gif-toolbar-frame {
    position: absolute;
    top: 3px;
    left: 0;
    font-size: 12px;
    padding: 0 5px;
    width: auto;
}

.gif-toolbar-btn-restart {
    position: absolute;
    top: 3px;
    right: 0;
}

.gif-player canvas {
    max-width: 400px;
    background-color: transparent;
}
</style>
