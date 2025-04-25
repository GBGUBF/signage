import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import html from '@rollup/plugin-html';
import fs from 'fs';

const isProduction = process.env.BUILD === 'production';
const jsFileName = isProduction ? 'bundle.min.js' : 'bundle.js';
const htmlFileName = isProduction ? 'index.min.html' : 'index.html';

const css = fs.readFileSync('src/css/style.css', 'utf-8');

export default {
  input: 'src/js/main.js',
  output: {
    dir: 'docs',
    entryFileNames: jsFileName,
    format: 'iife',
    name: 'App',
    sourcemap: false
  },
  plugins: [
    resolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    ...(isProduction ? [terser()] : []),

    html({
      fileName: htmlFileName,
      template: ({ bundle }) => {
        const jsChunk = Object.values(bundle).find(file => file.type === 'chunk' && file.fileName.endsWith('.js'));

        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Signage App</title>
  ${
    isProduction
      ? `<style>\n${css}\n</style>`
      : `<link rel="stylesheet" href="style.css">`
  }
</head>
<body>
  <div class="parent">
    <div class="content" id="ul"></div>
    <div class="content" id="ur"></div>
    <div class="content" id="ll"></div>
    <div class="content" id="lr"></div>
  </div>
  ${
    isProduction
      ? `<script>\n${jsChunk.code}\n</script>`
      : `<script src="./${jsChunk.fileName}"></script>`
  }
</body>
</html>`;
      }
    })
  ]
};
