# gif-player

### 安装

```bash
npm install @n.see/gif-player --save

```

### 使用
##### template
```html
<div
    class="git-player"
    data-src="/src/assets/03.gif"
    data-width="500"
></div>
```
##### script
```javascript
import { onMounted } from 'vue';
import GifPlayer from '@n.see/gif-player';

onMounted(() => {
    GifPlayer.run('.git-player');
});
``` 

