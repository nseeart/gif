
import { defineComponent, onMounted, ref, h } from 'vue';
import GifPlayer from '@n.see/gif-player';

export default defineComponent({
    name: 'gif-player',
    props: {
        src: {
            type: String,
            default: ''
        },
        width: {
            type: String,
            default: '300'
        },
        height: {
            type: String,
            default: '200'
        }
    },
    emits: ['ready', 'frame-update', 'state-update'],
    setup(props, { emit }) {
        const gifPlayerRef = ref();
        onMounted(() => {
            gifPlayerRef.value.setAttribute('data-src', props.src);
            gifPlayerRef.value.setAttribute('data-width', props.width);
            gifPlayerRef.value.setAttribute('data-height', props.height);
            const gifPlayer = new GifPlayer(gifPlayerRef.value);
            gifPlayer.ready((parser) => {
                emit('ready', parser);
            }).frameUpdate((item, index) => {
                emit('frame-update', item, index);
            }).stateUpdate((state) => {
                emit('state-update', state);
            });
        });

        return () => h('div', {
            class: "gif-player",
            ref: gifPlayerRef.value
        });
    }
});
