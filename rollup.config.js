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
    file: "./dist/package/LinkDevTools.js",
  }
}

const cjs = {
  ...base,
  output: {
    format: "cjs",
    file: "./dist/package/LinkDevTools.cjs",
  }
}

export default [esm, cjs]
