import path from 'path';
import fs from 'fs';
import babel from '@babel/core';
import * as terser from 'terser';
import postcss from 'postcss';

// Configuration for Bun's build process
const config = {
  entrypoints: ["./app/javascript/application.js"],
  outdir: "./app/assets/builds",
  target: 'browser', // Target environment
  minify: process.env.NODE_ENV === 'production',
  plugins: [
    // JavaScript transformation with Babel
    {
      name: 'babel',
      async setup(build) {
        build.onLoad({ filter: /\.js$/ }, async ({ path: filePath }) => {
          let source = await fs.promises.readFile(filePath, 'utf8');
          const babelConfig = require(path.join(process.cwd(), 'babel.config.js'));
          let { code } = await babel.transformAsync(source, {
            ...babelConfig,
            filename: filePath,
          });

          if (build.config.minify) {
            const terserOptions = require(path.join(process.cwd(), 'terser.config.js'));
            const result = await terser.minify(code, terserOptions);
            if (result.error) throw result.error;
            code = result.code;
          }

          return { contents: code, loader: 'js' };
        });
      },
    },
    // CSS processing with PostCSS
    {
      name: 'postcss',
      async setup(build) {
        build.onLoad({ filter: /\.css$/ }, async ({ path: cssPath }) => {
          let css = await fs.promises.readFile(cssPath, 'utf8');
          const postcssConfig = require(path.join(process.cwd(), 'postcss.config.js'));
          const result = await postcss(postcssConfig.plugins).process(css, { 
            from: cssPath, 
            to: path.join(config.outdir, path.basename(cssPath))
          });
          
          return { contents: result.css, loader: 'css' };
        });
      },
    },
  ],
};

// Bun's build function
async function buildProject() {
  try {
    await Bun.build(config);
    console.log("Build succeeded.");
  } catch (error) {
    console.error("Build failed:", error);
    if (!process.argv.includes('--watch')) process.exit(1);
  }
}

// Run build or watch for changes
(async () => {
  await buildProject();

  if (process.argv.includes('--watch')) {
    const watcher = fs.watch(path.join(process.cwd(), "app/javascript"), { recursive: true }, async (eventType, filename) => {
      console.log(`File changed: ${filename}. Rebuilding...`);
      await buildProject();
    });

    // Keep the script running to watch for changes
    await new Promise(() => {});
  } else {
    process.exit(0);
  }
})();