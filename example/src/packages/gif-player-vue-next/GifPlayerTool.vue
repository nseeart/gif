<template>
    <div class="gif-player-tool">
        <span class="info">{{ currentFrameIndex + 1 }}/{{ frames.length }}</span>
        <span @click="handleToggle">
            <svg v-if="isPlay" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#67a1f5" stroke="#67a1f5" stroke-width="4" stroke-linejoin="round"/><path d="M20 24V17.0718L26 20.5359L32 24L26 27.4641L20 30.9282V24Z" fill="#FFF" stroke="#FFF" stroke-width="4" stroke-linejoin="round"/></svg>
            <svg v-else width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#67a1f5" stroke="#67a1f5" stroke-width="4" stroke-linejoin="round"/><path d="M19 18V30" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 18V30" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span @click="handleStep('prev')">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#67a1f5" stroke="#67a1f5" stroke-width="4" stroke-linejoin="round"/><path d="M27 33L18 24L27 15" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span @click="handleStep('next')">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#67a1f5" stroke="#67a1f5" stroke-width="4" stroke-linejoin="round"/><path d="M21 33L30 24L21 15" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
    </div>
</template>  

<script setup lang="ts">
import { defineExpose, defineProps, defineEmits } from 'vue';

const props = defineProps({
    currentFrameIndex: {
        type: Number,
        default: 0
    },
    frames: {
        type: Array,
        default: () => []
    },
    isPlay: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['toggle', 'step']);

const handleStep = (type: 'prev' | 'next') => {
    emit('step', type);
}
const handleToggle = () => {
    emit('toggle');
}

defineExpose({
    props,
    handleToggle,
    handleStep
});
</script>

<style scoped>

.gif-player-tool {
    background-color: #c0daff;
    font-size: 0;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.gif-player-tool span{
    display: inline-block;
    vertical-align: middle;
    width: auto;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    padding: 0 10px;
    cursor: pointer;
}

.gif-player-tool span.info {
    background-color: rgb(103, 161, 245);
    border-radius: 24px;
    height: 20px;
    line-height: 21px;
    color: #fff;
    cursor: default;
}
</style>
