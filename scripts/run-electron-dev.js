const { spawn } = require('child_process');
const path = require('path');

function findElectronExecutable() {
  try {
    const pkgPath = require.resolve('electron/package.json');
    const dir = path.dirname(pkgPath);
    if (process.platform === 'win32') return path.join(dir, 'dist', 'electron.exe');
    if (process.platform === 'darwin') return path.join(dir, 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron');
    return path.join(dir, 'dist', 'electron');
  } catch (err) {
    return null;
  }
}

const exe = findElectronExecutable();
if (!exe) {
  console.error('Could not locate electron executable in node_modules. Please run `npm install` first.');
  process.exit(1);
}

console.log('Launching Electron from:', exe);

const child = spawn(exe, ['.'], { stdio: 'inherit' });

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start Electron:', err);
  process.exit(1);
});
