const jwt = require('jsonwebtoken');

const token = process.argv[2];
const secret = process.argv[3];

try {
  const decoded = jwt.verify(token, secret);
  console.log("SUCCESS STRING", decoded);
} catch (err) {
  console.log("FAIL STRING", err.message);
}

try {
  // If the Supabase secret is base64 encoded...
  const secretBuffer = Buffer.from(secret, 'base64');
  const decoded2 = jwt.verify(token, secretBuffer);
  console.log("SUCCESS BASE64", decoded2);
} catch (err) {
  console.log("FAIL BASE64", err.message);
}

// Just decode it without verifying
const payload = jwt.decode(token);
console.log("\nDECODED (NO VERIFY):", payload);
