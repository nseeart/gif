<template>
    <div class="frame-loading">
        <div class="frame-loading-canvas"
            :style="{
                width: `${width}px`,
                height: `${height}px`
            }"
        >loading...</div>
    </div>
  </template>  

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
    width: {
        type: Number,
        default: 200
    },
    height: {
        type: Number,
        default: 200
    }
});
</script>

<style scoped>
.frame-loading {
    width: 100%;
    padding: 20px;
    background-color: #eee;
    display: flex;
    justify-content: center;
}

.frame-loading-canvas {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
}

</style>
