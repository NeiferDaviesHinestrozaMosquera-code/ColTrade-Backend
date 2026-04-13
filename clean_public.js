const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.hvykvypkgndlmqqakzzz:UCnWPhAL%40S%25T%230*8rZ@aws-1-us-west-2.pooler.supabase.com:5432/postgres" // Direct URL
  });

  try {
    await client.connect();
    console.log("Connected to DB");
    
    // Drop and recreate public schema
    await client.query(`DROP SCHEMA IF EXISTS public CASCADE;`);
    await client.query(`CREATE SCHEMA public;`);
    await client.query(`GRANT ALL ON SCHEMA public TO postgres;`);
    await client.query(`GRANT ALL ON SCHEMA public TO public;`);

    console.log("Cleaned up entire public schema (SCHEMA CASCADE).");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

main();
