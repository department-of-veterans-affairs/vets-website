const { execSync } = require("child_process");
const fs = require("fs");

const appFolderPath = ".agent/tmp/context/input.txt";

if (!fs.existsSync(appFolderPath)) {
  console.error("❌ No app folder file found. Run agent first.");
  process.exit(1);
}

const appFolder = fs.readFileSync(appFolderPath, "utf-8").trim();
if (!appFolder) {
  console.error("❌ App folder is empty.");
  process.exit(1);
}

console.log(`✅ Running tests for ${appFolder}`);
const outPath = ".agent/tmp/output.txt";
execSync(`yarn test:unit --app-folder ${appFolder} > ${outPath}`, { stdio: "inherit" });