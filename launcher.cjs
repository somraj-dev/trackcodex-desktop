const { spawn } = require('child_process');
const path = require('path');

// Crucially unset the variable before spawning
delete process.env.ELECTRON_RUN_AS_NODE;

// Resolve the electron binary path
let electronPath;
try {
  electronPath = require('electron');
} catch (e) {
  electronPath = 'electron'; // fallback to global
}

console.log('🚀 Launching TrackCodex Desktop...');
console.log('🔹 Runtime:', process.versions.node ? 'Node ' + process.versions.node : 'Unknown');
console.log('🔹 Electron binary:', electronPath);

const args = [path.join(__dirname, 'dist-electron/main.cjs'), ...process.argv.slice(2)];

const child = spawn(electronPath, args, {
  stdio: 'inherit',
  windowsHide: false
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('❌ Failed to start Electron:', err);
  process.exit(1);
});
