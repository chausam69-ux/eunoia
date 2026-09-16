import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw) {
  console.error("usage: npx tsx scripts/hash-password.ts <password>");
  process.exit(1);
}
const hash = bcrypt.hashSync(pw, 10);
// Next.js expands $VARS in .env — escape every $ so the hash survives loading.
console.log("Add this line to .env:\n");
console.log(`STUDIO_PASSWORD_HASH='${hash.replace(/\$/g, "\$")}'`);
