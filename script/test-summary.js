#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
// Helper function to escape HTML special characters
const escapeHTML = str => {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, char => escapeMap[char]);
};

// Constants
const APPLICATIONS_PATH = path.resolve(__dirname, '../src/applications');
const OUTPUT_DIR = path.resolve(__dirname, '../mocha/results');
const SUMMARY_FILE = path.resolve(OUTPUT_DIR, 'test-summary.json');
const HTML_SUMMARY_FILE = path.resolve(OUTPUT_DIR, 'test-summary.html');

// Parse command line arguments using native Node.js process.argv
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    apps: [],
    help: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--verbose' || arg === '-v') {
      result.verbose = true;
    } else if (arg === '--apps' || arg === '-a') {
      // Get the next argument as apps list
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        result.apps = args[i + 1].split(',');
        i += 1; // Skip the next argument as we've already processed it
      }
    } else if (arg.startsWith('--apps=')) {
      result.apps = arg.substring('--apps='.length).split(',');
    }
  }

  return result;
}

// Parse command line arguments
const argv = parseArgs();

// Show help if requested
if (argv.help) {
  console.log(`
VA.gov Unit Test Summary Script

Usage:
  node test-summary.js [options]

Options:
  -a, --apps=app1,app2    Run tests only for specified applications (comma-separated)
  -v, --verbose           Display more detailed output
  -h, --help              Show this help message

Examples:
  node test-summary.js                            # Run tests for all applications
  node test-summary.js --apps=hca,disability-benefits   # Run tests only for hca and disability-benefits
  node test-summary.js -a hca,disability-benefits       # Same as above
  `);
  process.exit(0);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get all application directories
function getApplications() {
  return fs
    .readdirSync(APPLICATIONS_PATH)
    .filter(app => {
      const appPath = path.join(APPLICATIONS_PATH, app);
      return (
        fs.statSync(appPath).isDirectory() &&
        !app.startsWith('_') &&
        !app.startsWith('.') &&
        app !== 'registry.json.md' &&
        app !== 'registry.scaffold.json'
      );
    })
    .sort();
}

// Check if an application has unit tests
function hasUnitTests(appName) {
  try {
    const cmd = `find ${path.join(
      APPLICATIONS_PATH,
      appName,
    )} -name "*.unit.spec.js" -o -name "*.unit.spec.jsx" | wc -l`;
    const result = execSync(cmd)
      .toString()
      .trim();
    const count = parseInt(result, 10);
    return count > 0;
  } catch (error) {
    console.error(`Error checking for tests: ${error.message}`);
    return false;
  }
}

// Run unit tests for a specific application and capture results
function runTestsForApp(appName) {
  console.log(chalk.cyan(`\n📋 Running tests for ${appName}...`));

  try {
    const outputFile = path.join(OUTPUT_DIR, `${appName}-test-results.json`);
    const command = `BABEL_ENV=test NODE_ENV=test npx mocha --config config/mocha.json --reporter json --reporter-option output=${outputFile} "src/applications/${appName}/**/*.unit.spec.@(js|jsx)"`;

    try {
      execSync(command, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 300000, // 5 minute timeout
      });
    } catch (error) {
      console.error(chalk.red(`Error running tests for ${appName}:`), error);
    }

    // Read and parse the JSON output
    const results = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

    // Transform to our expected format
    return {
      stats: {
        tests: results.stats.tests,
        passes: results.stats.passes,
        failures: results.stats.failures,
        duration: results.stats.duration,
      },
      failures: results.failures.map(f => ({
        fullTitle: f.fullTitle,
        err: { message: f.err.message },
        file: f.file,
      })),
    };
  } catch (error) {
    console.error(chalk.red(`Error running tests for ${appName}:`), error);
    return {
      stats: {
        tests: 0,
        passes: 0,
        failures: 1,
        duration: 0,
      },
      failures: [
        {
          fullTitle: `${appName} test execution error`,
          err: { message: error.message || 'Unknown error' },
        },
      ],
    };
  }
}

// Sanitize error message by removing extra whitespace and escaping HTML
const sanitizeError = msg => {
  if (!msg) return 'Unknown error';
  // First escape any HTML in the message
  const escaped = escapeHTML(msg);
  // Then clean up whitespace
  return escaped.replace(/^\s+/gm, '').replace(/\n+/g, '\n');
};

// Generate HTML report
function generateHtmlReport(summary) {
  const failingApps = summary.appResults.filter(app => app.hasFailures);

  // Sort apps by name
  failingApps.sort((a, b) => a.appName.localeCompare(b.appName));

  let failureDetails = '';

  failingApps.forEach(app => {
    failureDetails += `
      <div class="app-failure">
        <h3>${app.appName} (${app.failures.length} failing tests)</h3>
        <ul>
          ${app.failures
            .map(
              failure => `
            <li>
              <div class="test-title">${escapeHTML(failure.fullTitle)}</div>
              <div class="error-message">${sanitizeError(
                failure.err.message,
              )}</div>
            </li>
          `,
            )
            .join('')}
        </ul>
      </div>
    `;
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VA.gov Unit Test Summary</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #112e51;
        }
        .summary {
          background-color: #f9f9f9;
          border-left: 5px solid #0071bc;
          padding: 15px;
          margin-bottom: 20px;
        }
        .app-failure {
          background-color: #fff1f1;
          border-left: 5px solid #e31c3d;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 0 4px 4px 0;
        }
        .test-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .error-message {
          font-family: monospace;
          background-color: #f8f8f8;
          padding: 10px;
          border-left: 3px solid #e31c3d;
          margin-bottom: 10px;
          white-space: pre-wrap;
        }
        .status {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 3px;
          font-weight: bold;
        }
        .success {
          background-color: #e7f4e4;
          color: #2e8540;
        }
        .failure {
          background-color: #f9dede;
          color: #e31c3d;
        }
        .no-tests {
          background-color: #f1f1f1;
          color: #5b616b;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          text-align: left;
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f1f1f1;
        }
        tr:hover {
          background-color: #f9f9f9;
        }
      </style>
    </head>
    <body>
      <h1>VA.gov Unit Test Summary</h1>
      <p>Generated on: ${new Date(summary.timestamp).toLocaleString()}</p>
      
      <div class="summary">
        <h2>Summary</h2>
        <p>Total applications: ${summary.totalApps}</p>
        <p>Applications with tests: ${summary.appsWithTests}</p>
        <p>Applications with failures: <span class="${
          summary.appsWithFailures > 0 ? 'status failure' : 'status success'
        }">${summary.appsWithFailures}</span></p>
      </div>
      
      <h2>All Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Application</th>
            <th>Status</th>
            <th>Tests</th>
            <th>Passes</th>
            <th>Failures</th>
          </tr>
        </thead>
        <tbody>
          ${summary.appResults
            .map(
              app => `
            <tr>
              <td>${app.appName}</td>
              <td>
                ${(() => {
                  if (!app.hasTests) {
                    return '<span class="status no-tests">No Tests</span>';
                  }
                  if (app.hasFailures) {
                    return '<span class="status failure">Failing</span>';
                  }
                  return '<span class="status success">Passing</span>';
                })()}
              </td>
              <td>${app.stats?.tests || 0}</td>
              <td>${app.stats?.passes || 0}</td>
              <td>${app.stats?.failures || 0}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
      
      ${
        failingApps.length > 0
          ? `
        <h2>Failing Tests</h2>
        ${failureDetails}
      `
          : ''
      }
    </body>
    </html>
  `;
}

// Generate summary report
function generateSummary(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    totalApps: results.length,
    appsWithTests: results.filter(r => r.hasTests).length,
    appsWithFailures: results.filter(r => r.hasFailures).length,
    appResults: results,
  };

  fs.writeFileSync(SUMMARY_FILE, JSON.stringify(summary, null, 2));

  // Generate HTML report
  const htmlContent = generateHtmlReport(summary);
  fs.writeFileSync(HTML_SUMMARY_FILE, htmlContent);

  return summary;
}

// Print summary to console
function printSummary(summary) {
  console.log('\n');
  console.log(chalk.bold.blue('========================================='));
  console.log(chalk.bold.blue('         VA.gov Unit Test Summary        '));
  console.log(chalk.bold.blue('========================================='));
  console.log('\n');

  console.log(chalk.bold(`Total applications: ${summary.totalApps}`));
  console.log(chalk.bold(`Applications with tests: ${summary.appsWithTests}`));
  console.log(
    chalk.bold(
      `Applications with failures: ${
        summary.appsWithFailures > 0
          ? chalk.red(summary.appsWithFailures)
          : chalk.green(summary.appsWithFailures)
      }`,
    ),
  );

  console.log('\n');

  if (summary.appsWithFailures > 0) {
    console.log(chalk.bold.red('Failing Applications:'));
    console.log('\n');

    summary.appResults
      .filter(app => app.hasFailures)
      .sort((a, b) => a.appName.localeCompare(b.appName))
      .forEach(app => {
        console.log(
          chalk.bold.red(
            `${app.appName} (${app.failures.length} failing tests):`,
          ),
        );

        app.failures.forEach((failure, index) => {
          console.log(chalk.red(`  ${index + 1}. ${failure.fullTitle}`));
          if (failure.file) {
            console.log(chalk.yellow(`     File: ${failure.file}`));
          }
          console.log(
            chalk.yellow(
              `     Error: ${failure.err.message || 'Unknown error'}`,
            ),
          );
        });

        console.log('\n');
      });
  } else if (summary.appsWithTests > 0) {
    console.log(chalk.bold.green('All tests are passing! 🎉'));
    console.log('\n');
  } else {
    console.log(chalk.bold.yellow('No applications with tests were found.'));
    console.log('\n');
  }

  console.log(chalk.bold(`Detailed report saved to: ${HTML_SUMMARY_FILE}`));
  console.log(chalk.bold(`JSON summary saved to: ${SUMMARY_FILE}`));
  console.log('\n');
}

// Main function
async function main() {
  console.log(chalk.bold.blue('Starting VA.gov Application Test Summary'));
  console.log(chalk.gray('Finding applications...'));

  let apps = getApplications();

  // Filter applications based on the --apps argument if provided
  if (argv.apps && argv.apps.length > 0) {
    const requestedApps = argv.apps.map(app => app.trim().toLowerCase());
    apps = apps.filter(app => requestedApps.includes(app.toLowerCase()));
    console.log(
      chalk.blue(`Filtering to run tests for: ${argv.apps.join(', ')}`),
    );
  }

  console.log(chalk.green(`Found ${apps.length} applications`));

  // Exit early if no applications were found after filtering
  if (apps.length === 0) {
    console.log(
      chalk.yellow('No applications found matching the specified filter.'),
    );
    process.exit(0);
  }

  const results = await Promise.all(
    apps.map(async appName => {
      const hasTests = hasUnitTests(appName);

      if (!hasTests) {
        console.log(
          chalk.yellow(`⏩ Skipping ${appName} (no unit tests found)`),
        );
        return {
          appName,
          hasTests: false,
          hasFailures: false,
          stats: { tests: 0, passes: 0, failures: 0 },
          failures: [],
        };
      }

      try {
        const testResults = await runTestsForApp(appName);
        const appResult = {
          appName,
          hasTests: true,
          hasFailures: testResults.stats.failures > 0,
          stats: testResults.stats || { tests: 0, passes: 0, failures: 0 },
          failures: testResults.failures || [],
        };

        if (appResult.hasFailures) {
          console.log(
            chalk.red(
              `❌ ${appName} has ${appResult.stats.failures} failing tests`,
            ),
          );
        } else {
          console.log(
            chalk.green(
              `✅ ${appName} passed all tests (${
                appResult.stats.passes
              } tests)`,
            ),
          );
        }

        return appResult;
      } catch (error) {
        console.error(chalk.red(`Error processing ${appName}:`), error);
        return {
          appName,
          hasTests: true,
          hasFailures: true,
          stats: { tests: 0, passes: 0, failures: 1 },
          failures: [
            {
              fullTitle: `${appName} execution error`,
              err: { message: error.message || 'Unknown error' },
            },
          ],
        };
      }
    }),
  );

  const summary = generateSummary(results);
  printSummary(summary);
}

// Run the script
main().catch(error => {
  console.error(chalk.red('Error running test summary:'), error);
  process.exit(1);
});
