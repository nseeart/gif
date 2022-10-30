<template>
    <div class="global-color-table">
        <canvas ref="colorTable"></canvas>
    </div>
  </template>  

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps({
    colors: {
        type: Array,
        defualt: []
    }
});

const colorTable = ref();


function setCanvasSize(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
}

function renderContent(context, colors, nRow, nCol, size, padding) {
    const pad = (i) => padding + i * (size + padding);
    let pidx = 0;
    for (let row = 0; row < nRow; row++) {
        for (let col = 0; col < nCol; col++) {
            if (!colors[pidx]) {
                continue;
            }
            const [r = 0, g = 0, b = 0] = colors[pidx];
            context.fillStyle = `rgb(${r}, ${g}, ${b})`;
            context.fillRect(pad(col), pad(row), size, size);
            pidx += 1;
        }
    }
}

function renderColors(canvas, colors) {
    // const canvasWidth = canvas.width;
    const canvasWidth = document.querySelector('.global-color-table').getBoundingClientRect().width || canvas.width;
    const context = canvas.getContext('2d');
    const size = 20;
    const padding = 4;
    const boxSize = size + padding;
    const nCol = parseInt((canvasWidth - padding) / boxSize);
    const nRow = parseInt(colors.length / nCol) + 1;
    const width = nCol * boxSize + padding;
    const height = nRow * boxSize + padding;
    setTimeout(() => {
        setCanvasSize(canvas, width, height);
        renderContent(context, colors, nRow, nCol, size, padding);
    }, 0);
}
onMounted(() => {
    renderColors(colorTable.value, props.colors);
});

defineExpose({
    colorTable
});

</script>

<style scoped>
.global-color-table {
    width: 100%;
}

.global-color-table canvas {
    width: 100%;
    background-color: #eee;
}
</style>
