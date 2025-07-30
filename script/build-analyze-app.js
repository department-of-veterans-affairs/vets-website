/* eslint-disable no-console */
/**
 * This script runs the statoscope analyzer for a specific application
 * Usage: yarn build-analyze-app <application-name>
 */

const path = require('path');
const { runCommand, runCommandSync } = require('./utils');

// Get the application name from the command line arguments
const appName = process.argv[2];

if (!appName) {
  console.error('Error: Application name is required');
  console.error('Usage: yarn build-analyze-app <application-name>');
  process.exit(1);
}

async function main() {
  try {
    // Build the production bundle with statoscope for the specified entry
    console.log(`Building production bundle with statoscope for ${appName}...`);
    await runCommandSync(
      `NODE_ENV=production ./script/build.sh --buildtype=vagovprod --statoscope --entry=${appName}`,
    );
    console.log(`Production bundle built for ${appName}.`);

    // Use path.resolve to generate an absolute path that works across platforms
    const reportPath = path.resolve(
      './build/vagovprod/generated/statoscope-report.html',
    );

    // Check if the report file exists before attempting to open it
    const fs = require('fs');
    if (fs.existsSync(reportPath)) {
      // Run the analyzer on the generated stats file
      console.log(`Opening statoscope analysis for ${appName}...`);

      // Use open for macOS/Linux and start for Windows
      const openCommand =
        process.platform === 'win32'
          ? `start ${reportPath}`
          : `open ${reportPath}`;
      runCommand(openCommand);
    } else {
      console.error(
        `Error: Statoscope report was not generated at ${reportPath}`,
      );
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Execute the main function
main();
