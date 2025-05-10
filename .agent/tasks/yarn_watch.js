const { execSync } = require("child_process");
const fs = require("fs");

const entryName = ".agent/tmp/context/input.txt";

if (!fs.existsSync(entryName)) {
  console.error("❌ No context file found. Run agent first.");
  process.exit(1);
}

console.log(`✅ Running yarn watch for ${entryName}`);
execSync(`yarn watch --env entry=${entryName}`, { stdio: "inherit" });