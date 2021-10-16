<template>
    <div class="gif-player-vue-next">
        <h3>gif-player-vue-next</h3>
        <div class="gif-img">
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
        <gif-player-tool
            :frames="gifFrames"
            :current-frame-index="currentFrameIndex"
            :is-play="isPlay"
            @toggle="handleToggle"
            @step="handleStep"
        />
        <code-view width="100%" height="auto">{{ code }}</code-view>
    </div>
</template>


<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import GifPlayer from '@n.see/gif-player';
import GifPlayerTool from './GifPlayerTool.vue'
import CodeView from "../../components/CodeView.vue";

const currentFrameIndex: Ref<number> = ref(0);
const gifFrames: Ref<Array<any>> = ref([]);
const width: Ref<number> = ref(0);
const height: Ref<number> = ref(0);
const isPlay: Ref<boolean> = ref(false);
let gifPlayer: GifPlayer;

const code = `
// template
<div class="gif-view">
    <div
        class="git-player"
        data-src="/src/assets/03.gif"
        data-width="300"
    ></div>
    <gif-player-vue-next-tool
        :frames="gifFrames"
        :current-frame-index="currentFrameIndex"
        :is-play="isPlay"
        @toggle="handleToggle"
        @step="handleStep"
    />
</div>

// script
import GifPlayer from '@n.see/gif-player-vue-next';
import GifPlayerTool from './GifPlayerTool.vue'

onMounted(() => {
    gifPlayer = GifPlayer.run('.git-player');
    gifPlayer.ready((parser) => {
        const [w, h] = parser.getSize();
        width.value = w;
        height.value = h;
        parser.export();
        gifFrames.value = parser.getFrames();
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
`;

onMounted(() => {
    gifPlayer = GifPlayer.run('.git-player');
    gifPlayer.ready((parser) => {
        const [w, h] = parser.getSize();
        width.value = w;
        height.value = h;
        parser.export();
        gifFrames.value = parser.getFrames();
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
    gifPlayer.step(type);
}

const handleToggle = () => {
    gifPlayer.handleToggle();
}

defineExpose({
    width,
    height,
    gifFrames,
    currentFrameIndex,
    isPlay,
    handleToggle,
    handleStep
})
</script>

<style>
.gif-player-vue-next {
    max-width: 600px;
    margin: 0 auto;
}
.gif-player-vue-next h3 {
    line-height: 60px;
    text-align: center;
}
.gif-img {
    background-color: #f9f9f9;
    padding: 40px;
    display: flex;
    justify-content: center;
}

.gif-img img {
    max-width: 300px;
    height: auto;
}

</style>
