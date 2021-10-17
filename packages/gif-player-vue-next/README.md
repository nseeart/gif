# gif-player

### 安装

```bash
npm install @n.see/gif-player-vue-next --save

```

### 使用
##### template
```html
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
```
##### script
```javascript
import { defineExpose } from 'vue';
import GifPlayer from '@n.see/gif-player-vue-next';
import { Parser, FrameData } from '@n.see/gif-parser';

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
``` 

