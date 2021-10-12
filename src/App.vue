<template>
    <div class="gif">
        <div class="gif-view">
            <!-- <div
                class="git-player"
                data-src="/src/assets/03.gif"
                data-width="300"
            ></div> -->
            <div
                class="git-player"
                data-src="/src/assets/logo.gif"
                data-width="300"
            ></div>
        </div>
        <div class="gif-player-tools">
            <span class="info">{{ currentFrameIndex + 1 }}/{{ gifFrames.length }}</span>
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
        <block-list :data-list="gifDataList" />
    </div>
</template>


<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import GifPlayer from './gifPlayer';
// import GifPlayer from './GifPlayer.vue'
import BlockList from './components/BlockList.vue'

const gifDataList: Ref<Array<Record<string, any>>> = ref([]);
const currentFrameIndex: Ref<number> = ref(0);
const gifFrames: Ref<Array<any>> = ref([]);
const width: Ref<number> = ref(0);
const height: Ref<number> = ref(0);
const isPlay: Ref<boolean> = ref(false);
let gp: GifPlayer;

onMounted(() => {
    gp = GifPlayer.run('.git-player').ready((parser) => {
        const [w, h] = parser.getSize();
        width.value = w;
        height.value = h;
        parser.export();
        gifDataList.value = parser.getDataList();
        console.log('=================getDataList start=================');
        console.log('getDataList', gifDataList.value);
        gifFrames.value = parser.getFrames();
        console.log('=================gifFrames start=================');
        console.log('gifFrames:', gifFrames.value);
    }).frameUpdate((item, index) => {
        currentFrameIndex.value = index;
        // console.log(item, index);
    }).stateUpdate((state) => {
        isPlay.value = state.isPlay;
    });


    // GifPlayer.run('.git-player');
    // 多个gif
    // GifPlayer.selectorAll('.git-player').forEach(gif => {
    //     GifPlayer.run(gif);
    // });
});

const handleStep = (type: 'prev' | 'next') => {
    gp.step(type);
}

const handleToggle = () => {
    gp.handleToggle();
}

defineExpose({
    width,
    height,
    gifDataList,
    gifFrames
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #eee;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

ul,
ol,
li {
    list-style: none;
}

.super-gif,
.super-gif canvas {
    width: 100%;
    height: 100%;
}
.gif {
    width: 700px;
    height: 100%;
    margin: 0 auto;
    padding: 20px;
}

.gif-view {
    background-color: #fff;
    padding: 40px;
    display: flex;
    justify-content: center;
}

.gif-view img {
    max-width: 200px;
    height: auto;
}

.gif-player-tools {
    background-color: #c0daff;
    font-size: 0;
    padding: 4px;
}
.gif-player-tools span{
    display: inline-block;
    vertical-align: middle;
    width: auto;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    padding: 0 10px;
    cursor: pointer;
}

.gif-player-tools span.info {
    background-color: rgb(103, 161, 245);
    border-radius: 24px;
    height: 20px;
    line-height: 21px;
    color: #fff;
    cursor: default;
}
</style>
