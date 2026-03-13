const { execSync } = require('child_process');
const fs = require('fs');

try {
  const result = execSync('npx tsx backend/server.ts', {
    cwd: __dirname,
    timeout: 15000,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' }
  });
  fs.writeFileSync('backend_output.log', 'STDOUT:\n' + result);
} catch (err) {
  const log = [
    'EXIT CODE: ' + err.status,
    'SIGNAL: ' + err.signal,
    'STDOUT: ' + (err.stdout || '(empty)'),
    'STDERR: ' + (err.stderr || '(empty)'),
    'MESSAGE: ' + err.message
  ].join('\n');
  fs.writeFileSync('backend_output.log', log);
}
