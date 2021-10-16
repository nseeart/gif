import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
          entry: path.resolve(__dirname, 'src/gifPlayer.ts'),
          name: 'gifPlayer',
          fileName: (format) => `gif-player.${format}.js`
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['@n.see/gif-parser'],
            output: {
              // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
              globals: {
                vue: 'GifParser'
              }
            }
        }
    },
    plugins: [dts({
        outputDir: 'dist/types'
    })]
})
