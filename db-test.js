// require('dotenv').config({ path: '.env.local' });
// Since I'm running this with 'node', I need to manually read the env or just hardcode for a split second to test.
// Actually, I can use the same variables as in .env.local

const mysql = require('mysql2/promise');

const DATABASE_URL = "mysql://rndtechnosoft_qr_platform:r9DaTa09V11%3Ar@103.191.208.92:3306/rndtechnosoft_qr_platform";

async function test() {
    console.log("Testing with {uri}:");
    try {
        const pool = await mysql.createPool({ uri: DATABASE_URL });
        const [rows] = await pool.query('SELECT 1 as result');
        console.log("SUCCESS:", rows);
    } catch (e) {
        console.error("FAILED:", e.message);
    }

    console.log("\nTesting with direct string:");
    try {
        const pool2 = await mysql.createPool(DATABASE_URL);
        const [rows2] = await pool2.query('SELECT 1 as result');
        console.log("SUCCESS:", rows2);
    } catch (e) {
        console.error("FAILED:", e.message);
    }
}

test();
