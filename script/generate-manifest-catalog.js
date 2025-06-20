#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

/**
 * Node.js 14 compatible script to generate a registry of all manifest.json files
 * in src/applications and create a JSON file with their metadata.
 */

// Function to recursively find all manifest.json files
function findManifestFiles(dir, manifestFiles = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findManifestFiles(filePath, manifestFiles);
    } else if (file === 'manifest.json') {
      manifestFiles.push(filePath);
    }
  }

  return manifestFiles;
}

// Function to extract data from manifest.json file
function extractManifestData(manifestPath) {
  try {
    const content = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);

    // Get relative path from src/applications
    const relativePath = path.relative(
      path.join(process.cwd(), 'src', 'applications'),
      manifestPath,
    );
    const directoryPath = path.dirname(relativePath);

    return {
      directoryPath:
        directoryPath === '.'
          ? 'src/applications'
          : `src/applications/${directoryPath}`,
      appName: manifest.appName || 'N/A',
      entryName: manifest.entryName || 'N/A',
      rootUrl: manifest.rootUrl || 'N/A',
    };
  } catch (error) {
    console.error(`Error processing ${manifestPath}:`, error.message);
    return null;
  }
}

// Function to generate JSON registry
function generateJsonRegistry(manifestData) {
  const validData = manifestData
    .filter(data => data !== null)
    .sort((a, b) => a.directoryPath.localeCompare(b.directoryPath));

  return {
    title: 'VA.gov Applications Manifest Catalog',
    description:
      'Catalog of all applications in src/applications with their manifest.json metadata for reference',
    totalApplications: validData.length,
    applications: validData,
  };
}

// Main function

function main() {
  const applicationsDir = path.join(process.cwd(), 'src', 'applications');
  const catalogFile = path.join(applicationsDir, 'manifest-catalog.json');

  console.log('Scanning for manifest.json files in src/applications...');

  // Check if applications directory exists
  if (!fs.existsSync(applicationsDir)) {
    console.error(`Error: Directory ${applicationsDir} does not exist`);
    process.exit(1);
  }

  // Find all manifest.json files
  const manifestFiles = findManifestFiles(applicationsDir);
  console.log(`Found ${manifestFiles.length} manifest.json files`);

  // Extract data from each manifest file
  const manifestData = manifestFiles.map(extractManifestData);
  const validData = manifestData.filter(data => data !== null);

  console.log(`Successfully processed ${validData.length} manifest files`);

  // Generate JSON registry
  const registry = generateJsonRegistry(manifestData);

  // Write to registry file
  fs.writeFileSync(catalogFile, JSON.stringify(registry, null, 2), 'utf8');

  console.log(`Manifest catalog generated: ${catalogFile}`);
  console.log(`Total applications cataloged: ${validData.length}`);
}

// Run the script
if (require.main === module) {
  main();
}
