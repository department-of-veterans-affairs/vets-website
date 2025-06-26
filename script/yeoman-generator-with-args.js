/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const yeoman = require('yeoman-environment');
const fs = require('fs');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Handle JSON file
    if (arg.endsWith('.json') && !arg.startsWith('--')) {
      return JSON.parse(fs.readFileSync(arg, 'utf8'));
    }

    // Handle named arguments
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];

      if (!value || value.startsWith('--')) {
        console.error(`Missing value for argument: ${arg}`);
        process.exit(1);
      }

      options[key] = value;
      i++; // Skip the value in next iteration
    }
  }

  return options;
}

function showUsage() {
  console.log('Usage:');
  console.log(
    '  yarn new:app:args -- --appName "My Form" --folderName "my-form" --entryName "my-form-entry" --rootUrl "/my-form" --formNumber "21P-530" --trackingPrefix "my-form-" --respondentBurden "10" --ombNumber "2900-0797" --expirationDate "12/31/2026" --benefitDescription "My benefits" --templateType "WITH_1_PAGE"',
  );
  console.log('');
  console.log('All arguments are required:');
  console.log('  --appName            Descriptive name for the form');
  console.log('  --folderName         Folder name in src/applications/');
  console.log('  --entryName          Entry name for webpack bundle');
  console.log(
    '  --rootUrl            Root URL for the form (must start with "/")',
  );
  console.log('  --formNumber         Form number in format "21P-530"');
  console.log('  --trackingPrefix     Google Analytics event prefix');
  console.log('  --respondentBurden   Respondent burden in minutes');
  console.log('  --ombNumber          OMB number (e.g. "2900-0797")');
  console.log('  --expirationDate     Expiration date in M/D/YYYY format');
  console.log('  --benefitDescription Benefit description');
  console.log('  --templateType       "WITH_1_PAGE" or "WITH_4_PAGES"');
}

(async () => {
  const options = parseArgs();

  // Check if we have any options
  if (Object.keys(options).length === 0) {
    // Try default JSON file
    const defaultPath = '.agent/tmp/new_form.json';
    if (fs.existsSync(defaultPath)) {
      Object.assign(options, JSON.parse(fs.readFileSync(defaultPath, 'utf8')));
    } else {
      showUsage();
      process.exit(1);
    }
  }

  // Validate required fields
  const required = [
    'appName',
    'folderName',
    'entryName',
    'rootUrl',
    'formNumber',
    'trackingPrefix',
    'respondentBurden',
    'ombNumber',
    'expirationDate',
    'benefitDescription',
    'templateType',
  ];
  const missing = required.filter(field => !options[field]);

  if (missing.length > 0) {
    console.error(
      `Missing required arguments: ${missing.map(f => `--${f}`).join(', ')}`,
    );
    console.log('');
    showUsage();
    process.exit(1);
  }

  const env = yeoman.createEnv();
  await env.lookup(); // No callback anymore

  // Add default required arguments for form generation
  const formDefaults = {
    isForm: true,
    slackGroup: 'none',
    contentLoc: '../vagov-content',
    usesVetsJsonSchema: false,
    usesMinimalHeader: false,
    force: true, // Automatically overwrite conflicting files
  };

  // Merge defaults with provided options (provided options take precedence)
  const finalOptions = { ...formDefaults, ...options };

  env.run('@department-of-veterans-affairs/vets-website', finalOptions);
})();
