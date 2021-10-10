<template>
    <div class="xmp-data-view">
        <dl v-for="(item, index) in xmpData">
            <dt><span class="tag-key">tag</span><span  class="tag-value">{{ item.tag }}</span></dt>
            <dd class="tag-attr">
                <span class="tag-key">attr</span>
                <ul class="tag-attr-list">
                    <li v-for="(value, key) in item.attrs">
                        <span class="attr-key">{{key}}</span><span class="attr-value">{{ value }}</span>
                    </li>
                </ul>
            </dd>
            <dd v-if="item.children">
                <xmp-data-view :xmp-data="item.children" />
            </dd>
        </dl>
    </div>
  </template>  

<script setup lang="ts">
defineProps({
    xmpData: {
        type: Array,
        default: () => []
    }
});
</script>

<style scoped>
.xmp-data-view{
    padding: 10px;
    display: block;
    text-align: left;
}

.xmp-data-view dd {
     text-align: left;
}

.xmp-data-view .tag-key {
    display: inline-block;
    padding: 0 8px;
    min-width: 48px;
    font-weight: 500;
    color: #999;
}

.tag-value {
    font-weight: 700;
    color: #9f00bb;
}
.xmp-data-view .tag-attr {
    display: flex;
}

.attr-key {
    margin-right: 10px;
    color: #3f70ff;
}

.attr-value {
    color: #ff8300;
}
</style>
