#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

/**
 * Script to generate a catalog of all manifest.json files
 * in src/applications and create a JSON file with their metadata.
 *
 * Output: src/applications/manifest-catalog.json
 */

function findManifestFiles(dir, manifestFiles = []) {
  const files = fs.readdirSync(dir);

  const skipDirectories = ['node_modules', 'dist', 'build', 'coverage', '.git'];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!skipDirectories.includes(file)) {
        findManifestFiles(filePath, manifestFiles);
      }
    } else if (file === 'manifest.json') {
      manifestFiles.push(filePath);
    }
  }

  return manifestFiles;
}

function extractManifestData(manifestPath) {
  try {
    const content = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);

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

function main() {
  const applicationsDir = path.join(process.cwd(), 'src', 'applications');
  const catalogFile = path.join(applicationsDir, 'manifest-catalog.json');

  console.log('Scanning for manifest.json files in src/applications...');

  if (!fs.existsSync(applicationsDir)) {
    console.error(`Error: Directory ${applicationsDir} does not exist`);
    process.exit(1);
  }

  const manifestFiles = findManifestFiles(applicationsDir);
  console.log(`Found ${manifestFiles.length} manifest.json files`);

  const manifestData = manifestFiles.map(extractManifestData);
  const validData = manifestData.filter(data => data !== null);

  console.log(`Successfully processed ${validData.length} manifest files`);

  const registry = generateJsonRegistry(manifestData);

  fs.writeFileSync(catalogFile, JSON.stringify(registry, null, 2), 'utf8');

  console.log(`Manifest catalog generated: ${catalogFile}`);
  console.log(`Total applications cataloged: ${validData.length}`);
}

if (require.main === module) {
  main();
}
