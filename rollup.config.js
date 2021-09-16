//FROM: https://stackoverflow.com/questions/61237208/rollup-error-default-is-not-exported-by-node-modules-react-index-js

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import replace from '@rollup/plugin-replace';

import React from 'react';
import ReactIs from 'react-is';
import ReactDOM from 'react-dom';

const config = {
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify("development")
        }),
        nodePolyfills(),
        resolve({
            browser: true
        }),
        commonjs({
            include: /node_modules/,
            namedExports: {
                'react-is': Object.keys(ReactIs),
                'react': Object.keys(React),
                'react-dom': Object.keys(ReactDOM),
            }
        }),
        babel({
            babelrc: true,
            exclude: 'node_modules/**'
        }),
        terser()
    ]
};

export default config; 

