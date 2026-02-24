
import pkg from 'pg';
const { Client } = pkg;
import process from 'process';

console.error("🚀 DIAGNOSTIC START: Script is running (SSL BYPASS MODE)...");

async function testConnection() {
    console.error("🔍 Starting Database Connectivity Diagnostic...");
    const url = process.env.DATABASE_URL;

    if (!url) {
        console.error("❌ ERROR: DATABASE_URL is not set!");
        process.exit(1);
    }

    const maskedUrl = url.replace(/:([^:@]+)@/, ":****@");
    console.error(`📡 Target URL (masked): ${maskedUrl}`);

    // CONFIG 1: Standard Require
    console.error("⏳ TEST 1: Attempting with sslmode=require (Standard)...");
    const client1 = new Client({
        connectionString: url,
        connectionTimeoutMillis: 10000,
    });

    try {
        await client1.connect();
        console.error("✅ TEST 1 SUCCESS: Connected with standard SSL.");
        await client1.end();
    } catch (err: any) {
        console.error(`❌ TEST 1 FAILED: ${err.message}`);
    }

    // CONFIG 2: SSL Bypass (rejectUnauthorized: false)
    console.error("⏳ TEST 2: Attempting with rejectUnauthorized: false...");
    const client2 = new Client({
        connectionString: url,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
    });

    try {
        await client2.connect();
        console.error("✅ TEST 2 SUCCESS: Connected with SSL Bypass!");
        const res = await client2.query('SELECT version()');
        console.error("📊 DB Version:", res.rows[0].version);
        await client2.end();
        console.error("🏁 DIAGNOSTIC COMPLETE: SSL Bypass works.");
        process.exit(0);
    } catch (err: any) {
        console.error(`❌ TEST 2 FAILED: ${err.message}`);
        console.error("Full Trace:", JSON.stringify(err, null, 2));
        process.exit(1);
    }
}

testConnection().catch(err => {
    console.error("💥 CRITICAL SCRIPT ERROR:");
    console.error(err);
    process.exit(1);
});
