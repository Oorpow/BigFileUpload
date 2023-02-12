import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import Unocss from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        charset: false,
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, 'src/assets/css/theme.less')}";`
      }
    }
  },
  plugins: [
    vue(),
    // viteMockServe({
    //   supportTs: true,
    //   mockPath: './src/mock',
    //   logger: false,
    //   localEnabled: true
    // }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    Unocss({
      presets: [presetAttributify(), presetUno()],
      rules: [
        ['flex', { display: 'flex' }],
        ['red', { color: 'red' }],
        [/^m-(\d+)$/, ([, d]) => ({ margin: `${Number(d) * 10}px` })]
      ],
      shortcuts: {
        columnCenter: ['flex', 'red']
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // server: {
  //   port: 5173,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5003/',
  //       changeOrigin: true,
  //       rewrite: (path: string) => path.replace(/^\/api/, '')
  //     }
  //   }
  // },
  build: {
    assetsInlineLimit: 4000
  }
})
