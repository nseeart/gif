<template>
    <div class="byte-view">
        <h5 @click="handleShow">
            <a>{{ isShow ? 'hide bytes': 'show bytes' }}</a>
        </h5>
        <template v-if="isShow">
            <table v-if="currentPageData && currentPageData.length">
                <tr v-for="(item, index) in currentPageData" :key="index">
                    <th>{{ item.offset }}</th>
                    <td v-for="(c, i) in item.content" :key="i">{{ c }}</td>
                </tr>
            </table>
            <div class="page" v-if="byteData.length > 10">
                <ul>
                    <li>Page {{ currentPage }} of {{ total }}</li>
                </ul>
                <ul>
                    <li>
                        <span>Jump to Page: </span>
                        <input type="text" v-model="currentPage" />
                    </li>
                    <li><button @click="handleChange('prev')">prev</button></li>
                    <li><button @click="handleChange('next')">next</button></li>
                </ul>
            </div>
        </template>
    </div>
  </template>  

<script setup lang="ts">
import { computed, ref, Ref, ComputedRef } from "vue";
import { numberToHex } from "../gifParser/utils";

const props = defineProps({
    bytes: {
        type: Uint8Array,
        default: new Uint8Array(0)
    }
});

const isShow = ref(false);
const handleShow = () => {
    isShow.value = !isShow.value;
};

const currentPage: Ref<number> = ref(1);
const currentSize: Ref<number> = ref(10);

type ByteList = Array<{
    content: Array<string>;
    offset: number;
}>;

interface ByteData {
    list: ByteList,
    length: number
} 

const byteData: ComputedRef<ByteData> = computed(() => {
    const row = 20;
    const bytes = props.bytes || new Uint8Array(0);
    const list: ByteList = [];
    let offset = 0;
    while (offset < bytes.byteLength) {
        let children: Array<string> = Array.from(bytes.subarray(offset, offset + row), item => numberToHex(item));
        if (children.length < row) {
            const empty = Array(row - children.length).fill('-');
            children = children.concat(empty);
        }
        list.push({
            content: children,
            offset
        });
        offset = offset + row;
    }

    return {
        list,
        length: list.length
    };
});

const currentPageData: ComputedRef<ByteList> = computed(() => {
    let list: ByteList = [];
    if (currentPage.value < 1 || currentPage.value > byteData.value.length) {
        return list;
    }
    for(let i = (currentPage.value - 1) * currentSize.value; i < currentPage.value * currentSize.value; i++) {
        if (byteData.value.list[i])
            list.push(byteData.value.list[i]);
    }
    return list;
});

const total: ComputedRef<number> = computed(() => Math.ceil(byteData.value.length / currentSize.value));

const handleChange = (type: string) => {
    if (type === 'prev') {
        if (currentPage.value > 1) {
            currentPage.value --;
        }
    } else {
        if (currentPage.value < byteData.value.length / currentSize.value) {
            currentPage.value ++;
        }
    }
}

defineExpose({
    isShow,
    handleShow,
    byteData,
    currentPageData,
    handleChange,
    total,
    currentPage
});

</script>

<style scoped>
.byte-view{
    padding: 10px;
}
.byte-view h5 {
    text-align: center;
    cursor: pointer;
    line-height: 28px;
    background-color: #f4f9ff;
}

.byte-view table {
    width: 100%;
    text-align: center;
    background-color: #f4f9ff;
    font-size: 14px;
}
.byte-view table tr {
    display: flex;
}

.byte-view table th {
    flex: 2;
    text-align: left;
    color: #999;
    font-weight: 500;
}
.byte-view table td {
    flex: 1;
}

.byte-view table td:hover {
    background-color: #fff;
}

.page {
    display: flex;
    justify-content: space-between;
}

.page ul {
    display: flex;
    padding: 5px 0;
}

.page li {
    padding: 0 5px;
}
</style>
