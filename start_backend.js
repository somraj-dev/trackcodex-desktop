// This script runs the backend and captures ALL output
const { spawn } = require('child_process');
const fs = require('fs');

console.log('=== Starting backend server ===');
console.log('CWD:', process.cwd());

const child = spawn('npx', ['tsx', 'backend/server.ts'], {
  cwd: process.cwd(),
  shell: true,
  stdio: 'pipe',
  env: { ...process.env }
});

let output = '';

child.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write('[STDOUT] ' + text);
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stderr.write('[STDERR] ' + text);
});

child.on('error', (err) => {
  console.error('[SPAWN ERROR]', err.message);
  output += 'SPAWN ERROR: ' + err.message;
});

child.on('close', (code) => {
  console.log(`\n=== Process exited with code ${code} ===`);
  fs.writeFileSync('backend_output.log', output);
  console.log('Output saved to backend_output.log');
});

// If still running after 15 seconds, save what we have
setTimeout(() => {
  fs.writeFileSync('backend_output.log', output || '(no output captured)');
  console.log('\n=== 15s timeout - output saved to backend_output.log ===');
  if (output) {
    console.log('Captured output length:', output.length);
  } else {
    console.log('WARNING: Zero output captured from backend!');
  }
  process.exit(0);
}, 15000);
