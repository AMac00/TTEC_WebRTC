import { defineConfig, loadEnv  } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'
import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())}
    
    return defineConfig({
        base: `/3rdpartygadget/files/${process.env.VITE_FINESSE_FOLDER_NAME}/`,
        plugins: [
            vue(),
            createHtmlPlugin({
                minify: true,
                pages: [
                    {
                        filename: 'gadget.html',
                        template: 'public/gadget.html',
                        injectOptions: {
                            tags: [{
                                injectTo: 'head',
                                tag: 'link',
                                attrs: {
                                    rel: 'stylesheet',
                                    href: `/3rdpartygadget/files/${process.env.VITE_FINESSE_FOLDER_NAME}/assets/index.css`
                                }
                            }]
                        }
                    },
                    {
                        filename: 'index.html',
                        template: 'public/index.html',
                    },
                    
                ]
                
            })
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            },
        },
        build: {
            polyfillModulePreload: false,
            rollupOptions: {
                output: {
                    entryFileNames: `assets/[name].js`,
                    chunkFileNames: `assets/[name].js`,
                    assetFileNames: `assets/[name].[ext]`
                }
            }
        }
    })
}