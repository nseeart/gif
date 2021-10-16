<template>
    <div class="frame-viewer" :data-index="index">
        <canvas :id="`frame-viewer-${index}`"></canvas>
    </div>
  </template>  

<script setup lang="ts">
import { onMounted } from "vue";
const props = defineProps({
    width: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    imageData: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    }
});

onMounted(() => {
    const canvas: HTMLCanvasElement = document.getElementById(`frame-viewer-${props.index}`) as HTMLCanvasElement;
    setSize(canvas, props.imageData.width, props.imageData.height);
    putData(canvas, props.imageData as ImageData);
});

function setSize(canvas: HTMLCanvasElement, width: number, height: number) {
    canvas.width = width;
    canvas.height = height;
}

function putData(canvas: HTMLCanvasElement, imageData: ImageData) {
    const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.putImageData(imageData, 0, 0);
}

</script>

<style scoped>
.frame-viewer {
    width: 100%;
    padding: 20px;
    background-color: #f4f9ff;
    display: flex;
    justify-content: center;
}

.frame-viewer canvas {
    max-width: 100%;
    /* background-color: #eee; */
}
</style>
