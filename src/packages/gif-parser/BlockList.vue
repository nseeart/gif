<template>
    <div class="gif-list">
            <div 
                v-for="(item, index) in blockList"
                class="gif-item"
                :class="item.type">
                <header>
                    <h3>{{ item.type }}<span v-if="item.type === 'Frame'"></span></h3>
                    <dl v-if="item.offset">
                        <dt>offset</dt>
                        <dd >{{ item.offset }}</dd>
                    </dl>
                    <dl v-if="item.length">
                        <dt>length</dt>
                        <dd>{{ item.length }}</dd>
                    </dl>
                </header>
                <section>
                    <div style="padding: 10px" v-if="item.type === 'GlobalColorTable'">
                        <global-color-table :colors="item.data" />
                    </div>
                    <template v-else>
                        <template v-for="(value, key) in item.data" :key="key">
                            <dl >
                                <dt>{{key}}</dt>
                                <dd v-if="typeof key === 'string' && key === 'indexStream'"></dd>
                                <dd v-else-if="typeof key === 'string' && key === 'imageData'"></dd>
                                <dd v-else-if="typeof key === 'string' && key === 'blocks'"></dd>
                                <dd v-else-if="typeof key === 'string' && key === 'colorTable'"></dd>
                                <dd v-else-if="typeof key === 'string' && key === 'codeUnits'"></dd>
                                <dd v-else-if="typeof key === 'string' && key === 'appData' && value">{{ value.type }}</dd>
                                <dd v-else>{{value}}</dd>
                            </dl>
                            <section style="clear: both; width: 100%;" v-if="typeof key === 'string' && key === 'appData' && value">
                                <header>
                                    <h3>{{ value.type }}</h3>
                                    <dl>
                                        <dt>offset</dt>
                                        <dd>{{ value.offset }}</dd>
                                    </dl>
                                    <dl>
                                        <dt>length</dt>
                                        <dd>{{ value.length }}</dd>
                                    </dl>
                                </header>
                                <dl v-for="(v, k) in value.data">
                                    <dt>{{ k }}</dt>
                                    <dd v-if="typeof key === 'string' && k === 'xmpData'">XMPDataTree</dd>
                                    <dd v-else>{{ v }}</dd>
                                </dl>
                                <section style="clear: both; width: 100%;"
                                    v-if="value.data && value.data.xmpData">
                                    <xmp-data-view :xmp-data="value.data.xmpData" />
                                </section>
                            </section>
                        </template>
                    </template>
                    <section class="frame-viewer-wrap"
                        v-if="item.type === 'Frame' &&  item.data.imageData"
                    >
                        <suspense>
                            <template #default>
                                <async-frame-viewer
                                    :width="item.data.width"
                                    :height="item.data.height"
                                    :image-data="item.data.imageData"
                                    :index="index"
                                />
                            </template>
                            <template #fallback>
                                <frame-loading
                                    :width="item.data.width"
                                    :height="item.data.height"
                                />
                            </template>
                        </suspense>
                    </section>
                </section>
                <section v-if="item.bytes">
                    <byte-view :bytes="item.bytes" />
                </section>
            </div>
        </div>
  </template>  

<script setup lang="ts">
import GlobalColorTable from './GlobalColorTable.vue'
import ByteView from './ByteView.vue'
import AsyncFrameViewer from './AsyncFrameViewer.vue'
import XmpDataView from './XmpDataView.vue'
import { defineProps, computed, ComputedRef } from "vue";
import { ExportBlockList } from "@n.see/gif-parser";

const props = defineProps({
    dataList: {
        type: Array,
        default: () => []
    }
});
const blockList: ComputedRef<ExportBlockList> = computed(() => {
    return props.dataList as ExportBlockList;
});

defineExpose({ blockList });
</script>

<style scoped>

.gif-list{
    text-align: left;
    margin-top: 20px;
}

.gif-item {
    background-color: #fff;
    overflow: hidden;
    margin-bottom: 10px;
}

.gif-item header {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 10px;
}

.gif-item header h3 {
    text-align: left;
    width: 50%;
    overflow: hidden;
}

.gif-item header dl{
    width: 25%;
    display: flex;
    flex-direction: row;
    padding-left: 10px;
}

.gif-item section {
    display: block;
    overflow: hidden;
}

.gif-item section.block {
    padding: 10px;
}

.gif-item section > dl {
    display: flex;
    flex-direction: row;
    padding: 0 10px;
    line-height: 2em;
    width: 50%;
    float: left;
}

.gif-item dd {
    flex: 1;
    font-weight: 700;
    text-align: right;
}

.block-item {
    border-bottom: 1px solid #eee;
}

.block-item h3 {
    padding: 10px;
}

.block-item > dl {
    width: 50%;
    float: left;
    padding: 0 10px;
    display: flex;
    line-height: 2em;
}

.gif-item.GlobalColorTable section dl{
    display: block;
}

.gif-item.GlobalColorTable section dd {
    text-align: center;
    width: 100%;
}

.frame-viewer-wrap {
    clear: both; width: 100%; display: flex;
    justify-content: center;
    padding: 10px;
}
</style>
