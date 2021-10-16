<script lang="ts">
import { defineAsyncComponent} from 'vue';
export default defineAsyncComponent(() => import('./FrameViewer.vue'));
</script>

<style scoped>
.frame-viewer {
    width: 100%;
    padding: 20px;
    background-color: #eee;
    display: flex;
    justify-content: center;
}

.global-color-table canvas {
    width: 100%;
    background-color: #eee;
}
</style>

