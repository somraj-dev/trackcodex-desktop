// Quick diagnostic: tests if port 4000 (backend) and 5435 (postgres) are reachable
const net = require('net');

function testPort(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
    socket.on('error', () => { socket.destroy(); resolve(false); });
    socket.connect(port, host);
  });
}

async function main() {
  console.log('--- TrackCodex Port Diagnostics ---');
  
  const pg = await testPort('127.0.0.1', 5435);
  console.log(`PostgreSQL (port 5435): ${pg ? 'OPEN' : 'CLOSED/UNREACHABLE'}`);
  
  const backend = await testPort('127.0.0.1', 4000);
  console.log(`Backend API (port 4000): ${backend ? 'OPEN' : 'CLOSED/UNREACHABLE'}`);
  
  const vite3001 = await testPort('127.0.0.1', 3001);
  console.log(`Vite on 3001: ${vite3001 ? 'OPEN' : 'CLOSED/UNREACHABLE'}`);
  
  const vite5173 = await testPort('127.0.0.1', 5173);
  console.log(`Vite on 5173: ${vite5173 ? 'OPEN' : 'CLOSED/UNREACHABLE'}`);
  
  console.log('\n--- Diagnosis ---');
  if (!pg) {
    console.log('PROBLEM: PostgreSQL Docker container is NOT running on port 5435!');
    console.log('FIX: Run "docker-compose up -d db" and wait 5 seconds.');
  }
  if (!backend) {
    console.log('PROBLEM: Backend server is NOT running on port 4000!');
    console.log('The backend likely crashed during startup because it cannot reach PostgreSQL.');
  }
  if (vite5173 && !vite3001) {
    console.log('WARNING: Vite is running on 5173 instead of 3001.');
    console.log('The /api proxy only works on port 3001. Use http://localhost:3001');
  }
  if (pg && backend) {
    console.log('All services appear to be running correctly!');
  }
}

main();
