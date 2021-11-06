<template>
    <div class="gif-parser">
        <h3>gif-parser</h3>
        <div class="gif-img">
            <img src="/src/assets/03.gif" />
        </div>
        <code-view width="600px" height="auto">{{ code }}</code-view>
        <block-list :data-list="dataList" />
    </div>
</template>


<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
// import { Parser } from '@n.see/gif-parser';
import { Parser } from '../../../packages/gif-parser/src/index';
import CodeView from "../../components/CodeView.vue";
import BlockList from './BlockList.vue';

const dataList: Ref<Array<any>> = ref([]);

onMounted(() => {
    fetch('/src/assets/03.gif')
        .then((resp) => resp.arrayBuffer())
        .then(arrayBuffer => {
            // 解析gif文件流
            const parser = new Parser(arrayBuffer);
            console.log('parser', parser);
            // 导出数据
            // parser.export();
            // gif高宽
            const [width, height] = parser.getSize();
            console.log('width', width);
            console.log('height', height);

            const frames = parser.getFrames();
            console.log('frames', frames);

            dataList.value = parser.getDataList();
            console.log('dataList', dataList);
        });
});

const code = `
import { onMounted } from 'vue';
import { Parser } from '@n.see/gif-parser';

onMounted(() => {
    fetch('/src/assets/03.gif')
        .then((resp) => resp.arrayBuffer())
        .then(arrayBuffer => {
            // 解析gif文件流
            const parser = new Parser(arrayBuffer);
            // gif高宽
            const [width, height] = parser.getSize();
            // 导出数据
            parser.export();
            // 获取数据
            const dataList = parser.getDataList();
        });
});
`;

</script>

<style>

.gif-img {
    background-color: #f9f9f9;
    width: 100%;
    padding: 40px 0;
    display: flex;
    justify-content: center;
}
.gif-parser {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
}

.gif-parser h3 {
    line-height: 60px;
    text-align: center;
}

</style>
