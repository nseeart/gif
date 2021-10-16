<template>
    <div class="gif-home">
        <div
            class="git-player"
            data-src="/src/assets/03.gif"
            data-width="500"
        ></div>
        <code-view width="500px" height="auto">{{ code }}</code-view>
    </div>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue';
import GifPlayer from '@n.see/gif-player';
import CodeView from "./components/CodeView.vue";

const code = `
// template
<div
    class="git-player"
    data-src="/src/assets/03.gif"
    data-width="500"
></div>

// script
import { onMounted } from 'vue';
import GifPlayer from '@n.see/gif-player';

onMounted(() => {
    GifPlayer.run('.git-player');
});
`;

onMounted(() => {
    GifPlayer.run('.git-player');
});
</script>

<style>
.gif-home {
    display: flex;
    height: calc(100vh - 48px);
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.code-view {
    width: 400px;
}
</style>
