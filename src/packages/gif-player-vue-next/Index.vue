<template>
    <div class="gif-player-vue-next">
        <h3>gif-player-vue-next</h3>
        <div class="gif-img">
            <gif-player
                src="/src/assets/03.gif"
                width="400"
                height="auto"
                @ready="handleReady"
                @state-update="handleStateUpdate"
                @frame-update="handleFrameUpdate"
            />
        </div>
        <div class="gif-img">
            <gif-player
                src="/src/assets/01.gif"
                width="400"
                height="auto"
            />
        </div>
        <code-view width="100%" height="auto">{{ code }}</code-view>
    </div>
</template>


<script setup lang="ts">
import GifPlayer from '@n.see/gif-player-vue-next';
import { Parser, FrameData } from '@n.see/gif-parser';
import CodeView from "../../components/CodeView.vue";

const code = `
// template
<div class="gif-img">
    <gif-player
        src="/src/assets/03.gif"
        width="400"
        height="auto"
        @ready="handleReady"
        @state-update="handleStateUpdate"
        @frame-update="handleFrameUpdate"
    />
</div>
<div class="gif-img">
    <gif-player
        src="/src/assets/01.gif"
        width="400"
        height="auto"
    />
</div>

// script setup
import { defineExpose } from 'vue';
import GifPlayer from '@n.see/gif-player-vue-next';
import { Parser, FrameData } from '@n.see/gif-parser';

const handleReady = (parser: Parser) => {
    console.log('parser', parser);
};

const handleStateUpdate = (state: { isPlayer: boolean}) => {
    console.log('handleStateUpdate', state.isPlayer);
}

const handleFrameUpdate = (item: FrameData, index: number) => {
    console.log('handleFrameUpdate', item, index);
}

defineExpose({
    handleReady,
    handleStateUpdate,
    handleFrameUpdate
});
`;

const handleReady = (parser: Parser) => {
    console.log('parser', parser);
};

const handleStateUpdate = (state: { isPlay: boolean}) => {
    console.log('handleStateUpdate', state.isPlay);
}

const handleFrameUpdate = (item: FrameData, index: number) => {
    console.log('handleFrameUpdate', item, index);
}

defineExpose({
    handleReady,
    handleStateUpdate,
    handleFrameUpdate
});
</script>

<style>
.gif-player-vue-next {
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: 20px;
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
