const { execSync } = require("child_process");
const fs = require("fs");
const open = require("open");

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

console.log(`✅ Opening ${appFolder} in browser`);
const manifestPath = `src/applications/${appFolder}/manifest.json`;

if (!fs.existsSync(manifestPath)) {
  console.error("❌ Manifest file not found. Ensure the app folder is correct.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
const rootUrl = manifest.rootUrl;

if (!rootUrl) {
  console.error("❌ rootUrl not found in manifest file.");
  process.exit(1);
}

try {
  open(`http://localhost:3001${rootUrl}`);
} catch (error) {
  console.error("❌ Failed to open the URL:", error);
  process.exit(1);
}