<template>
    <div class="gif">
        <div class="gif-view">
            <div
                class="git-player"
                data-src="/src/assets/03.gif"
                data-width="300"
            ></div>
            <!-- <div
                class="git-player"
                data-src="/src/assets/logo.gif"
                data-width="300"
            ></div> -->
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
const gifFrames: Ref<Array<any>> = ref([]);
const width: Ref<number> = ref(0);
const height: Ref<number> = ref(0);

            //    data-width="300"
            //     data-height="300"

onMounted(() => {
    GifPlayer.run('.git-player').ready((parser) => {
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
    }).update((item, index) => {
        // console.log(item, index);
    });
    // GifPlayer.run('.git-player');
    // 多个gif
    // GifPlayer.selectorAll('.git-player').forEach(gif => {
    //     GifPlayer.run(gif);
    // });
})

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
</style>
