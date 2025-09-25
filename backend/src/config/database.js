import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Use correct environment variable names with fallback
const connection = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || process.env.DB_DATABASE || "realtime_polling",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  max: 10,           // max connections in pool
  idleTimeoutMillis: 30000, // 30 seconds
});

//  Test connection at startup
(async function testConnection() {
  try { 
    const client = await connection.connect();
    console.log("Connected to PostgreSQL database");
    client.release();
  } catch (err) {
    console.error("❌ Database connection error:");
    console.error("   Message:", err.message);
    console.error("   Detail:", err.detail || "N/A");
    console.error("   Hint:", err.hint || "N/A");
    process.exit(1); // stop server if DB cannot connect
  }
})();

export default connection;
