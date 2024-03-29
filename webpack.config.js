const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const node_externals = require('webpack-node-externals')
const _ = require('lodash');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = function(env, argv) {

    const pathAlias = {
        '~common': path.resolve(__dirname, 'src/common')
    }

////////////////////////////////////////////////////
//  FRONTEND CONFIGURATION
    
    frontendConfig = {
        mode: 'development',
        
        entry: {
            // TO FUTURE ME: this line increases the filesize of the frontend.js output but enables usage of async methods
            //frontend: ['@babel/polyfill', './src/frontend/index.ts']
            frontend: './src/frontend/index.ts'
        },

        target: 'web',

        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist')
        },

        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                },
                {
                    test: /\.ts$/,
                    loader: 
                    [
                        'babel-loader',
                        {
                            loader: 'ts-loader', 
                            options: {
                                appendTsSuffixTo: [/\.vue$/],
                                allowTsInNodeModules: true,
                            },
                        }
                    ],
                    
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: [/node_modules/]
                },
                {
                    test: /\.json5$/,
                    loader: 'json5-loader'
                },
                {
                    test: /\.css$/,
                    loader: ['vue-style-loader', 'css-loader'],
                },
                {
                    test: /\.s(c|a)ss$/,
                    loader: ['vue-style-loader', 'css-loader', 'sass-loader'],
                }
            ]
        },
        
        plugins: [
            new webpack.ProgressPlugin(),
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, 'dist', 'view.html'),
                title: 'Songrequest Bot',
                template: path.resolve(__dirname, 'src', 'view.ejs')
            }),
        ],

        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        priority: -10,
                        test: /[\\/]node_modules[\\/]/
                    }
                },

                chunks: 'async',
                minChunks: 1,
                minSize: 30000,
                name: true
            }
        },
        resolve: {
            extensions: ['.js', '.ts', '.json5', '.json', '.scss', '.css', '.vue'],
            alias: {
                vue: 'vue/dist/vue.js',
                ...pathAlias
            }
        }
    }

////////////////////////////////////////////////////
//  BACKEND CONFIGURATION


    backendConfig = {
        mode: 'development',
        
        entry: {
            backend:  ['@babel/polyfill','./src/backend/index.ts']
        },

        target: 'node',
        externals: [node_externals()],
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist')
        },

        node: {
            __dirname: false
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 
                    [
                        'babel-loader',
                        'ts-loader'
                    ],
                    exclude: [/node_modules/]
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: [/node_modules/]
                },
                {
                    test: /\.json5$/,
                    loader: 'json5-loader'
                }
            ]
        },

        plugins: [new webpack.ProgressPlugin()],

        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        priority: -10,
                        test: /[\\/]node_modules[\\/]/
                    }
                },

                chunks: 'async',
                minChunks: 1,
                minSize: 30000,
                name: true
            }
        },
        resolve: {
            extensions: ['.js', '.ts', '.json5', '.json'],
            alias: {
                ...pathAlias
            }
        }
    }

    return [backendConfig, frontendConfig]
};
