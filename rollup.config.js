import typescript from 'rollup-plugin-typescript'

const base = {
  plugins: [
    typescript(),
  ]
}

const esm = {
  ...base,
  output: {
    format: "esm",
    file: "./dist/LinkDevTools.js",
  }
}

const cjs = {
  ...base,
  output: {
    format: "cjs",
    file: "./dist/LinkDevTools.cjs",
  }
}

export default [esm, cjs]
