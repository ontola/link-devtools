import typescript from 'rollup-plugin-typescript2'

const esm = {
  plugins: [
    typescript(),
  ],
  output: {
    format: "esm",
    file: "./dist/package/LinkDevTools.js",
  }
}

const cjs = {
  plugins: [
    typescript({
      tsconfigOverride: {
        declaration: false,
      }
    }),
  ],
  output: {
    format: "cjs",
    file: "./dist/package/LinkDevTools.cjs",
  }
}

export default [esm, cjs]
