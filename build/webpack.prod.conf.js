'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')  //访问内置的插件
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
// 想要使用一个插件，你只需要 require() 它，然后把它添加到 plugins 数组中。
// 插件目的在于解决 loader 无法实现的其他事。
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')   //通过 npm 安装
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const env = process.env.NODE_ENV === 'testing'
    ? require('../config/test.env')
    : require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true,
            usePostCSS: true
        })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // 定义js全局模块变量（相当于window全局变量一样），value可以是node_modules里面的模块，也可以是alias里的别名
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    // 是否删除警告信息
                    warnings: false,
                    // 是否删除debugger
                    drop_debugger: false,
                    // 是否删除console
                    drop_console: false
                }
            },
            sourceMap: config.build.productionSourceMap,
            parallel: true
        }),
        // 把css从html中style便签写入css文件
        new ExtractTextPlugin({
            // 定义文件的名称。如果有多个入口文件时，应该定义为：[name].css
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            // Setting the following option to `false` will not extract CSS from codesplit chunks.
            // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
            // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
            // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
            allChunks: true,
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap
                ? { safe: true, map: { inline: false } }
                : { safe: true }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            // 输出文件的文件名称，默认为index.html，不配置就是该文件名；
            filename: process.env.NODE_ENV === 'testing' ? 'index.html' : config.build.index,
            // 本地模板文件的位置
            template: 'index.html',
            // 值为true、'body'，把js引入html中body底部；值为'head',把js引入html中head中
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),
        // This instance extracts shared chunks from code splitted chunks and bundles them
        // in a separate chunk, similar to the vendor chunk
        // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            async: 'vendor-async',
            children: true,
            minChunks: 3
        }),

        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ])
    ]
})

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')
    // 压缩文件，需要nginx服务器配合，浏览器请求xxx.js，服务器把压缩文件xxx.js.gz返回，浏览器解压后，再解码渲染
    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            // 目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
            asset: '[path].gz[query]',
            // 可以是 (buffer, cb) => cb(buffer) 或者是使用 zlib 里面的算法的 {String}
            algorithm: 'gzip',
            // 处理所有匹配此 {RegExp} 的资源
            test: new RegExp('\\.(' +config.build.productionGzipExtensions.join('|') +')$'),
            // 只处理比这个值大的资源。按字节计算
            threshold: 10240,
            // 只有压缩率比这个值小的资源才会被处理
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
