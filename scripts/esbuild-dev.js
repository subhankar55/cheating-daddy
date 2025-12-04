const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'src', 'dist');
fs.mkdirSync(outDir, { recursive: true });

console.log('Starting esbuild dev (simple watch) — output:', path.join(outDir, 'react-ui.js'));

function buildOnce() {
  try {
    require('esbuild').buildSync({
      entryPoints: [path.join('src', 'components', 'reactApp.jsx')],
      bundle: true,
      outfile: path.join(outDir, 'react-ui.js'),
      platform: 'browser',
      loader: { '.jsx': 'jsx' },
      sourcemap: true,
      define: { 'process.env.NODE_ENV': '"development"' },
    });
    console.log('esbuild: build succeeded at', new Date().toLocaleTimeString());
  } catch (err) {
    console.error('esbuild: build failed:', err);
  }
}

buildOnce();

// Simple file watcher to trigger rebuilds (avoids relying on esbuild watch API compatibility)
// Watch only source files (avoid watching the output `src/dist` to prevent rebuild loops)
const watchedDirs = [path.join('src', 'components')];
let timer = null;
for (const d of watchedDirs) {
  try {
    fs.watch(d, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('File change detected:', filename, '- rebuilding...');
        buildOnce();
      }, 150);
    });
  } catch (err) {
    // ignore watch errors for missing dirs
  }
}

