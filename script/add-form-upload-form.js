#!/usr/bin/env node

/**
 * Script to add a new form to the Form Upload tool
 *
 * This script automates steps 2-4 from the Form Upload tool README:
 * 2. Enable the routes
 * 3. Add necessary text elements
 * 4. Add the form to the prefill configuration
 *
 * Usage: node script/add-form-upload-form.js --formId=21-XXXX --title="Form title" --url="https://www.vba.va.gov/pubs/forms/VBA-21-XXXX-ARE.pdf"
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Define file paths
const ROUTES_FILE_PATH = path.join(
  __dirname,
  '../src/applications/simple-forms/form-upload/routes.jsx',
);
const HELPERS_FILE_PATH = path.join(
  __dirname,
  '../src/applications/simple-forms/form-upload/helpers/index.js',
);
const CONSTANTS_FILE_PATH = path.join(
  __dirname,
  '../src/platform/forms/constants.js',
);

// Custom logger to avoid ESLint console warnings
/* eslint-disable no-console */
const logger = {
  log: (...args) => console.log(...args),
  error: (...args) => console.error(...args),
  warn: (...args) => console.warn(...args),
};
/* eslint-enable no-console */

/**
 * Helper function to escape single quotes in a string
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
function escapeSingleQuotes(str) {
  return str ? str.replace(/\\/g, '\\\\').replace(/'/g, "\\'") : str;
}

/**
 * Helper function to format a form ID for constants.js
 * Ensures any letter in the form ID is uppercased
 * @param {string} formId - The form ID to format
 * @returns {string} The formatted form ID with uppercase letters
 */
function formatFormIdForConstants(formId) {
  // Use regex to find any letter and uppercase it
  return formId.replace(/([a-zA-Z])/g, match => match.toUpperCase());
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Parse command line arguments
const args = process.argv.slice(2);
let formId = '';
let formTitle = '';
let pdfUrl = '';

// Using array methods to extract command line arguments
args.forEach(arg => {
  const [argName, argValue] = arg.split('=');

  if (argName === '--formId') {
    formId = argValue;
  } else if (argName === '--title') {
    // Remove surrounding double quotes and escape any single quotes
    formTitle = argValue.replace(/"/g, '');
  } else if (argName === '--url') {
    pdfUrl = argValue.replace(/"/g, '');
  }
});

/**
 * Prompt the user for input if not provided in command line arguments
 */
function promptForInput() {
  return new Promise(resolve => {
    if (!formId) {
      rl.question('Enter the form ID (e.g., 21-0779): ', answer => {
        formId = answer.trim();
        if (!formTitle) {
          rl.question('Enter the form subtitle: ', title => {
            formTitle = title.trim(); // Single quotes will be escaped in updateHelpersFile
            if (!pdfUrl) {
              rl.question('Enter the PDF download URL: ', url => {
                pdfUrl = url.trim();
                rl.close();
                resolve();
              });
            } else {
              rl.close();
              resolve();
            }
          });
        } else if (!pdfUrl) {
          rl.question('Enter the PDF download URL: ', url => {
            pdfUrl = url.trim();
            rl.close();
            resolve();
          });
        } else {
          rl.close();
          resolve();
        }
      });
    } else if (!formTitle) {
      rl.question('Enter the form subtitle: ', title => {
        formTitle = title.trim();
        if (!pdfUrl) {
          rl.question('Enter the PDF download URL: ', url => {
            pdfUrl = url.trim();
            rl.close();
            resolve();
          });
        } else {
          rl.close();
          resolve();
        }
      });
    } else if (!pdfUrl) {
      rl.question('Enter the PDF download URL: ', url => {
        pdfUrl = url.trim();
        rl.close();
        resolve();
      });
    } else {
      rl.close();
      resolve();
    }
  });
}

/**
 * Add the form ID to the formUploadForms array in routes.jsx
 */
function updateRoutesFile() {
  logger.log(`Adding form ${formId} to routes...`);

  let content = fs.readFileSync(ROUTES_FILE_PATH, 'utf8');

  // Check if the form is already added
  if (content.includes(`'${formId}'`)) {
    logger.log(`Form ${formId} already exists in routes.jsx`);
    return;
  }

  // Find the array and add the new form ID
  const formArrayRegex = /(const formUploadForms = \[[\s\S]*?)(\];)/;
  const match = content.match(formArrayRegex);

  if (match) {
    const existingArray = match[1];
    // Add new form ID at the end of the array, before the closing bracket
    const updatedArray = `${existingArray}  '${formId}',\n`;
    content = content.replace(formArrayRegex, `${updatedArray}];`);

    fs.writeFileSync(ROUTES_FILE_PATH, content, 'utf8');
    logger.log(`Successfully added ${formId} to routes.jsx`);
  } else {
    logger.error('Could not find formUploadForms array in routes.jsx');
  }
}

/**
 * Add a formMapping entry in helpers/index.js with subTitle and pdfDownloadUrl
 */
function updateHelpersFile() {
  logger.log(`Adding form ${formId} to helpers/index.js...`);

  let content = fs.readFileSync(HELPERS_FILE_PATH, 'utf8');

  // Check if the form is already added
  if (content.includes(`'${formId}':`)) {
    logger.log(`Form ${formId} already exists in helpers/index.js`);
    return;
  }

  // Find the formMappings object and add the new mapping
  const formMappingsRegex = /(const formMappings = {[\s\S]*?)(\};)/;
  const match = content.match(formMappingsRegex);

  if (match) {
    const existingMappings = match[1];
    // Escape any single quotes in the title to prevent JavaScript errors
    const escapedTitle = escapeSingleQuotes(formTitle);
    // Add new form mapping at the end of the object, before the closing brace
    const newMapping = `
  '${formId}': {
    subTitle: '${escapedTitle}',
    pdfDownloadUrl: '${pdfUrl}',
  },`;

    const updatedMappings = `${existingMappings}${newMapping}\n`;
    content = content.replace(formMappingsRegex, `${updatedMappings}};`);

    fs.writeFileSync(HELPERS_FILE_PATH, content, 'utf8');
    logger.log(`Successfully added ${formId} to helpers/index.js`);
  } else {
    logger.error('Could not find formMappings object in helpers/index.js');
  }
}

/**
 * Add an entry to the VA_FORM_IDS in platform/forms/constants.js
 * @returns {string|undefined} The form ID constant name if created, undefined otherwise
 */
function updateConstantsVAFormIds() {
  logger.log(`Adding form ${formId} to VA_FORM_IDS...`);

  let content = fs.readFileSync(CONSTANTS_FILE_PATH, 'utf8');

  // Format the form ID - uppercase any letters
  const formattedFormId = formatFormIdForConstants(formId);

  // Create constant name from form ID
  const formIdConstant = `FORM_${formattedFormId.replace(/-/g, '_')}_UPLOAD`;

  // Check if the form is already added
  if (content.includes(formIdConstant)) {
    logger.log(`Form ${formIdConstant} already exists in VA_FORM_IDS`);
    return formIdConstant;
  }

  // Find the VA_FORM_IDS object and add the new form ID
  const vaFormIdsRegex = /(export const VA_FORM_IDS = Object\.freeze\({[\s\S]*?)(\}\);)/;
  const match = content.match(vaFormIdsRegex);

  if (match) {
    const existingIds = match[1];
    // Add new form ID at the end of the object, before the closing brace
    const updatedIds = `${existingIds}  ${formIdConstant}: '${formattedFormId}-UPLOAD',\n`;
    content = content.replace(vaFormIdsRegex, `${updatedIds}});`);

    fs.writeFileSync(CONSTANTS_FILE_PATH, content, 'utf8');
    logger.log(`Successfully added ${formattedFormId} to VA_FORM_IDS`);
    return formIdConstant;
  }

  logger.error('Could not find VA_FORM_IDS in constants.js');
  return undefined;
}

/**
 * Add an entry to the forms array in platform/forms/constants.js
 */
function updateConstantsFormsArray(formIdConstant) {
  // Format the form ID - uppercase any letters
  const formattedFormId = formatFormIdForConstants(formId);

  logger.log(`Adding form ${formattedFormId} to forms array...`);

  let content = fs.readFileSync(CONSTANTS_FILE_PATH, 'utf8');

  // Check if the form is already added to the forms array
  if (content.includes(`id: VA_FORM_IDS.${formIdConstant}`)) {
    logger.log(`Form ${formattedFormId} already exists in forms array`);
    return;
  }

  // Find a good spot to add the new form entry (after a similar form entry)
  const formEntryRegex = /(\s+\{\s+id: VA_FORM_IDS\.FORM_.*?_UPLOAD,[\s\S]*?trackingPrefix:.*?\s+\},)/;
  const match = content.match(formEntryRegex);

  if (match) {
    const existingEntry = match[1];
    // Create a new form entry based on the pattern of existing entries
    const newEntry = `
  {
    id: VA_FORM_IDS.${formIdConstant},
    benefit: 'form ${formattedFormId} upload',
    title: 'form ${formattedFormId} upload',
    description: 'uploaded file for form ${formattedFormId}',
    trackingPrefix: 'form-${formattedFormId.toLowerCase()}-upload-',
  },`;

    // Add the new entry after the existing one
    content = content.replace(existingEntry, `${existingEntry}${newEntry}`);

    fs.writeFileSync(CONSTANTS_FILE_PATH, content, 'utf8');
    logger.log(`Successfully added ${formId} to forms array`);
  } else {
    logger.error(
      'Could not find a suitable location to add the form to forms array in constants.js',
    );
  }
}

/**
 * Validate the form ID format
 */
function validateFormId(id) {
  // Form IDs typically follow a pattern like 21-XXXX or 21P-XXXX-1
  const formIdPattern = /^\d+[A-Za-z]?-\d+([A-Za-z]?(-\d+)?)?$/;

  if (!formIdPattern.test(id)) {
    logger.warn(
      `Warning: Form ID '${id}' may not follow the expected format (e.g., 21-0779, 21P-0518-1).`,
    );

    return new Promise((resolve, reject) => {
      rl.question(`Continue with form ID '${id}'? (y/n): `, answer => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          resolve(true);
        } else {
          reject(
            new Error(
              'Form ID validation failed. Please provide a valid form ID.',
            ),
          );
        }
      });
    });
  }

  return Promise.resolve(true);
}

function updateConstantsGetAllFormLinks(formIdConstant) {
  // Format the form ID - uppercase any letters
  const formattedFormId = formatFormIdForConstants(formId);

  logger.log(`Adding form ${formattedFormId} to getAllFormLinks...`);

  let content = fs.readFileSync(CONSTANTS_FILE_PATH, 'utf8');

  // Check if the form is already added to getAllFormLinks
  if (content.includes(`[VA_FORM_IDS.${formIdConstant}]:`)) {
    logger.log(`Form ${formattedFormId} already exists in getAllFormLinks`);
    return;
  }

  // Find the last UPLOAD entry in getAllFormLinks and add after it
  const formLinkRegex = /(\[VA_FORM_IDS\.FORM_[\w]+_UPLOAD\]: `\$\{tryGetAppUrl\(\s*'form-upload-flow',?\s*\)\}\/[\w-]+\/introduction\/`,\n)(\s+\[VA_FORM_IDS\.FORM_(?!.*_UPLOAD))/;
  const match = content.match(formLinkRegex);

  if (match) {
    const lastUploadEntry = match[1];
    const nextNonUploadEntry = match[2];

    // Create new entry
    const newEntry = `    [VA_FORM_IDS.${formIdConstant}]: \`\${tryGetAppUrl(
      'form-upload-flow',
    )}/${formattedFormId}/introduction/\`,\n`;

    content = content.replace(
      lastUploadEntry + nextNonUploadEntry,
      lastUploadEntry + newEntry + nextNonUploadEntry,
    );

    fs.writeFileSync(CONSTANTS_FILE_PATH, content, 'utf8');
    logger.log(`Successfully added ${formattedFormId} to getAllFormLinks`);
  } else {
    // Fallback: try to find any UPLOAD entry in getAllFormLinks
    const fallbackRegex = /(\[VA_FORM_IDS\.FORM_[\w]+_UPLOAD\]: `\$\{tryGetAppUrl\(\s*'form-upload-flow',?\s*\)\}\/[\w-]+\/introduction\/`,\n)(\s+\};)/;
    const fallbackMatch = content.match(fallbackRegex);

    if (fallbackMatch) {
      const lastEntry = fallbackMatch[1];
      const closing = fallbackMatch[2];

      const newEntry = `    [VA_FORM_IDS.${formIdConstant}]: \`\${tryGetAppUrl(
      'form-upload-flow',
    )}/${formattedFormId}/introduction/\`,\n`;

      content = content.replace(
        lastEntry + closing,
        lastEntry + newEntry + closing,
      );

      fs.writeFileSync(CONSTANTS_FILE_PATH, content, 'utf8');
      logger.log(`Successfully added ${formattedFormId} to getAllFormLinks`);
    } else {
      logger.error(
        'Could not find a suitable location to add the form to getAllFormLinks',
      );
    }
  }
}

/**
 * Validate the URL format
 */
function validateUrl(url) {
  try {
    // Properly use URL constructor without side effects
    return Boolean(new URL(url));
  } catch (error) {
    return false;
  }
}

/**
 * Main function to run the script
 */
async function main() {
  try {
    // Test the single quote escaping if running in test mode
    if (args.includes('--test-escape')) {
      const testTitle = "Veteran's Benefits Application";
      logger.log(`Original title: "${testTitle}"`);
      logger.log(`Escaped title: "${escapeSingleQuotes(testTitle)}"`);
      process.exit(0);
    }

    // Test the form ID formatting if running in test mode
    if (args.includes('--test-format-id')) {
      const testIds = ['21-0779', '21p-0518-1', '21P-530a', '10-10ez'];
      logger.log('Testing form ID formatting:');
      testIds.forEach(id => {
        logger.log(
          `Original: "${id}" -> Formatted: "${formatFormIdForConstants(id)}"`,
        );
      });
      process.exit(0);
    }

    // Collect required information
    await promptForInput();

    // Validate inputs
    if (!formId || !formTitle || !pdfUrl) {
      logger.error('Form ID, subtitle, and PDF URL are all required.');
      process.exit(1);
    }

    // Validate form ID format
    try {
      await validateFormId(formId);
    } catch (error) {
      logger.error(error.message);
      process.exit(1);
    }

    // Validate URL
    if (!validateUrl(pdfUrl)) {
      logger.error(`Invalid URL: ${pdfUrl}`);
      process.exit(1);
    }

    logger.log('\nUpdating files:');
    logger.log('====================');

    // Update all necessary files
    updateRoutesFile();
    updateHelpersFile();
    const formIdConstant = updateConstantsVAFormIds();
    if (formIdConstant) {
      updateConstantsFormsArray(formIdConstant);
      updateConstantsGetAllFormLinks(formIdConstant);
    }

    logger.log('\n====================');
    logger.log(`✅ Successfully added form ${formId} to the Form Upload tool!`);
    logger.log('\nNext steps:');
    logger.log('1. Run your tests to verify the changes');
    logger.log('2. Create a pull request with your changes');
  } catch (error) {
    logger.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();
