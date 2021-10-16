<template>
    <div class="code-view" :style="style">
        <pre><code ref="codeRef"><slot /></code></pre>
    </div>
</template>

<script lang="ts">
export default {
    name:'code-view'
};
</script>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const props = defineProps({
    width: {
        type: String,
        default: '400px'
    },
    height: {
        type: String,
        default: '200px'
    }
});
const codeRef = ref(null);

const style = computed(() => {
    return {
        width: props.width,
        height: props.height
    };
});

onMounted(() => {
    if (codeRef.value) {
        hljs.highlightElement(codeRef.value);
    }
});

defineExpose({
    style
});
</script>

<style scoped>
.code-view {
    width: 400px;
    min-height: 200px;
    background-color: #fff;
    text-align: left;
    position: relative;
    overflow: hidden;
    overflow-x: auto;
}

.code-view pre {
    display: block;
    position: relative;
}

</style>

