const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const babel = require('@rollup/plugin-babel')
const replace = require('@rollup/plugin-replace')
const terser = require('@rollup/plugin-terser')
const postcss = require('rollup-plugin-postcss')
const pkg = require('./package.json')

const isProduction = process.env.NODE_ENV === 'production'

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  '@stripe/stripe-js'
]

const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    preventAssignment: true
  }),
  resolve({
    browser: true,
    preferBuiltins: false
  }),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: [
      ['@babel/preset-env', { modules: false }],
      ['@babel/preset-react', { runtime: 'automatic' }]
    ]
  }),
  postcss({
    extract: 'trustjs.css',
    minimize: isProduction
  })
]

if (isProduction) {
  plugins.push(terser())
}

const config = [
  // ES Module build
  {
    input: 'src/index.js',
    external,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    },
    plugins
  },
  // CommonJS build
  {
    input: 'src/index.js',
    external,
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'auto'
    },
    plugins
  },
  // UMD build for browsers
  {
    input: 'src/index.js',
    output: {
      file: 'dist/trustjs.umd.js',
      format: 'umd',
      name: 'TrustJS',
      sourcemap: true,
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        '@stripe/stripe-js': 'Stripe'
      }
    },
    external: ['react', 'react-dom'],
    plugins
  }
]

module.exports = config