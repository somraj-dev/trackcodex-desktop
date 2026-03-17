const { execSync } = require('child_process');
try {
  const output = execSync('npx tsx backend/server.ts', { encoding: 'utf8', stdio: 'pipe' });
  console.log("OUTPUT:", output);
} catch (e) {
  console.log("ERROR OUTPUT:", e.stdout);
  console.log("ERROR STDERR:", e.stderr);
}
