import { defineConfig } from 'vite'
const path = require('path');
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
          name: 'gifParser',
          fileName: (format) => `gif-parser.${format}.js`
        }
    },
    plugins: [dts({
        outputDir: 'dist/types'
    })]
})
