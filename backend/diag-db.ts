
import pkg from 'pg';
const { Client } = pkg;
import process from 'process';

console.error("🚀 DIAGNOSTIC START: Script is running...");

async function testConnection() {
    console.error("🔍 Starting Database Connectivity Diagnostic...");
    const url = process.env.DATABASE_URL;

    if (!url) {
        console.error("❌ ERROR: DATABASE_URL is not set!");
        process.exit(1);
    }

    const maskedUrl = url.replace(/:([^:@]+)@/, ":****@");
    console.error(`📡 Target URL (masked): ${maskedUrl}`);

    const client = new Client({
        connectionString: url,
        connectionTimeoutMillis: 15000,
    });

    try {
        console.error("⏳ Attempting raw TCP connection via node-postgres (15s timeout)...");
        await client.connect();
        console.error("✅ SUCCESS: Successfully connected to PostgreSQL via raw driver!");

        const res = await client.query('SELECT version()');
        console.error("📊 DB Version:", res.rows[0].version);

        await client.end();
        console.error("🏁 DIAGNOSTIC COMPLETE: success.");
        process.exit(0);
    } catch (err: any) {
        console.error("❌ CONNECTION FAILED!");
        console.error("Error Code:", err.code || "No Code");
        console.error("Error Message:", err.message);
        console.error("Full Trace:", JSON.stringify(err, null, 2));
        process.exit(1);
    }
}

testConnection().catch(err => {
    console.error("💥 CRITICAL SCRIPT ERROR:");
    console.error(err);
    process.exit(1);
});
