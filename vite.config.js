import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import path from 'path'
import svgr from 'vite-plugin-svgr'
// https://vite.dev/config/
export default defineConfig({
  // 性能优化 按需引入组件级别样式，没有使用的样式不会被打包在最终文件中
  plugins: [
    react(),
    createStyleImportPlugin({
      // libs: [
      //   {
      //     libraryName: "antd-mobile",
      //     esModule: true,
      //     resolveStyle: (name) => `antd-mobile/es/${name}/style/index`
      //   }
      // ]
  }),
  svgr({ svgrOptions: { icon: true } }),
],
  css:{
    modules:{
      localsConvention:'dashesOnly'
    },
  },
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'src'),
      'utils':path.resolve(__dirname,'src/utils'),
    }
  },
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:3000/',
        changeOrigin:true,
        rewrite:path => path.replace(/^\/api/,'')
      }
    }
  }
})
