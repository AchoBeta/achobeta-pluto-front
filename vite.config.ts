import path from 'node:path';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';

const pathSrc = path.resolve(__dirname, 'src');

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  plugins: [
    vue(),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [ElementPlusResolver()],
      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
  ],
  css: {
    preprocessorOptions: {
      sass: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://117.72.97.101:8085', // 服务器地址(新)
  //       // target:'http://10.61.220.204:8080',
  //       // target:'http://47.239.233.134:8085',// 服务器地址（旧）
  //       changeOrigin: true, // 允许代理修改请求来源，解决跨域问题
  //     },
  //   },
  // },
});
