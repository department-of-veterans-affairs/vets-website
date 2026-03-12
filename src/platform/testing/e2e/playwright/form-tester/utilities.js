/**
 * Playwright form-tester utilities.
 *
 * Port of cypress/support/form-tester/utilities.js for Playwright.
 * Provides helpers for building test configs, in-progress form mocks,
 * and array page objects.
 */

const path = require('path');
const { add, getUnixTime } = require('date-fns');

/**
 * Builds an array of array page objects to be used for matching against
 * page URLs in order to determine whether a page is an array page, and if so,
 * which index in the array it represents.
 *
 * @param {Object} formConfig - The config used to build the form.
 * @returns {Array}
 */
const createArrayPageObjects = formConfig => {
  const arrayPages = Object.values(formConfig.chapters || {}).reduce(
    (acc, { pages }) => [
      ...acc,
      ...Object.values(pages).filter(({ arrayPath }) => arrayPath),
    ],
    [],
  );

  return (arrayPages || []).map(({ arrayPath, path: pagePath }) => ({
    arrayPath,
    regex: new RegExp(pagePath.replace(':index', '(\\d+)')),
  }));
};

/**
 * Produces a test config using the manifest, form config, and default values to
 * automatically fill in certain settings and supplement a user-defined config.
 *
 * @param {Object} config - User-defined config for the test.
 * @param {Object} manifest - The app manifest.
 * @param {Object} formConfig - The config used to build the form.
 * @returns {Object}
 */
const createTestConfig = (config, manifest = {}, formConfig = {}) => {
  const { appName, rootUrl } = manifest;
  const arrayPages = createArrayPageObjects(formConfig);
  return { appName, arrayPages, rootUrl, ...config };
};

/**
 * Builds an in-progress form response.
 *
 * @param {Object} options
 * @param {Object} [options.prefill={}] - form data for pages before returnUrl
 * @param {string} [options.returnUrl] - URL to return to within the form flow
 * @param {string} [options.version] - form version
 * @returns {Object} - in-progress form response
 */
function inProgressMock({ prefill = {}, returnUrl, version } = {}) {
  const date = Date.now();
  return {
    formData: prefill,
    metadata: {
      version,
      returnUrl,
      savedAt: date,
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        timestamp: null,
        hasAttemptedSubmit: false,
      },
      createdAt: date,
      expiresAt: getUnixTime(add(new Date(), { days: 30 })),
      lastUpdated: date,
      inProgressFormId: 460,
    },
  };
}

/**
 * Resolves page hook paths. If a path doesn't start with '/', it's treated
 * as relative to rootUrl.
 *
 * @param {Object} pageHooks - Map of page paths to hook functions
 * @param {string} rootUrl - The form's root URL
 * @returns {Object} Resolved page hooks
 */
function resolvePageHooks(pageHooks, rootUrl) {
  return Object.entries(pageHooks).reduce(
    (hooks, [pagePath, hook]) => ({
      ...hooks,
      [pagePath.startsWith(path.sep)
        ? pagePath
        : path.join(rootUrl, pagePath)]: hook,
    }),
    {},
  );
}

/**
 * Extracts a nested data path from a field key.
 * Converts root_field_subField to field.subField for lodash.get.
 *
 * @param {string} key - The field key (e.g., root_veteran_fullName_first)
 * @returns {string} The data path (e.g., veteran.fullName.first)
 */
function fieldKeyToDataPath(key) {
  return key
    .replace(/^root_/, '')
    .replace(/_/g, '.')
    .replace(/\.(\d+)\./g, (_, number) => `[${number}].`);
}

/**
 * Sets up an in-progress form return URL by mocking user and SIP endpoints.
 * Playwright equivalent of the Cypress setupInProgressReturnUrl.
 *
 * @param {import('@playwright/test').Page} page
 * @param {Object} options
 * @param {Object} options.formConfig - Form config with formId and version
 * @param {string} [options.returnUrl=''] - URL to return to
 * @param {Object} [options.prefill={}] - Prefilled form data
 * @param {Object} [options.user] - User data to merge inProgressForms into
 * @param {Function} [options.loginFn] - Login function (defaults to helpers/login.login)
 */
async function setupInProgressReturnUrl(
  page,
  { formConfig = {}, returnUrl = '', prefill = {}, user = {}, loginFn } = {},
) {
  const { formId, version } = formConfig;
  if (!formId) {
    throw new Error('formId is required to set up in-progress return URL');
  }

  const sipResponse = inProgressMock({ prefill, returnUrl, version });

  // Add in-progress form to user data
  const userData = JSON.parse(JSON.stringify(user));
  if (!userData.data) userData.data = {};
  if (!userData.data.attributes) userData.data.attributes = {};
  userData.data.attributes.inProgressForms = [
    {
      form: formId,
      metadata: sipResponse.metadata,
      lastUpdated: Math.floor(Date.now() / 1000),
    },
  ];

  // Mock the user endpoint with in-progress form data
  await page.route('**/v0/user', route =>
    route.fulfill({ status: 200, json: userData }),
  );

  // Mock the in-progress form GET endpoint
  await page.route(`**/v0/in_progress_forms/${formId}`, route =>
    route.fulfill({ status: 200, json: sipResponse }),
  );

  // Login with the modified user data
  if (loginFn) {
    await loginFn(page, userData);
  } else {
    // eslint-disable-next-line global-require
    const { login } = require('../helpers/login');
    await login(page, userData);
  }
}

/**
 * Create a minimal 1x1 PNG file buffer for testing file inputs.
 * @returns {Buffer}
 */
function makeMinimalPNG() {
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB' +
      '/PMh2bQAAAAASUVORK5CYII=',
    'base64',
  );
}

/**
 * Create a minimal 1x1 JPG file buffer for testing file inputs.
 * @returns {Buffer}
 */
function makeMinimalJPG() {
  return Buffer.from(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U' +
      'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgN' +
      'DRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy' +
      'MjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAA/8QALRABAA' +
      'IBAQEAAAAAAAAAAAAAAAERITH/2gAMAwEAAhEDEQA/AKgA/9k=',
    'base64',
  );
}

/**
 * Create a minimal PDF file buffer for testing file inputs.
 * @returns {Buffer}
 */
function makeMinimalPDF() {
  return Buffer.from(
    'JVBERi0xLjAKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2Jq' +
      'IDIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iaiAz' +
      'IDAgb2JqPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCAzIDNdL1BhcmVudCAyIDAgUj4+' +
      'ZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAw' +
      'IG4KMDAwMDAwMDA1MiAwMDAwMCBuCjAwMDAwMDAxMDEgMDAwMDAgbgp0cmFpbGVyPDwv' +
      'U2l6ZSA0L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKMTUwCiUlRU9G',
    'base64',
  );
}

/**
 * Create a minimal encrypted PDF buffer for testing encrypted PDF rejection.
 * @returns {Buffer}
 */
function makeEncryptedPDF() {
  return Buffer.from(
    'JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2Jq' +
      'IDIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iaiAz' +
      'IDAgb2JqPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCAzIDNdL1BhcmVudCAyIDAgUj4+' +
      'ZW5kb2JqIDQgMCBvYmo8PC9FbmNyeXB0PDwvRmlsdGVyL1N0YW5kYXJkL1YgMS9SPDE+' +
      'Pj4+ZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAw' +
      'MDAwIG4KMDAwMDAwMDA1MiAwMDAwMCBuCjAwMDAwMDAxMDEgMDAwMDAgbgowMDAwMDAw' +
      'MTU4IDAwMDAwIG4KdHJhaWxlcjw8L1NpemUgNS9Sb290IDEgMCBSL0VuY3J5cHQgNCAw' +
      'IFI+PgpzdGFydHhyZWYKMjI4CiUlRU9G',
    'base64',
  );
}

/**
 * Create a minimal text file buffer for testing file inputs.
 * @param {number} [bytes=10] - Number of bytes
 * @returns {Buffer}
 */
function makeMinimalTxtFile(bytes = 10) {
  return Buffer.from('a'.repeat(bytes));
}

/**
 * Create a file buffer with invalid UTF-8 encoding for testing.
 * @returns {Buffer}
 */
function makeInvalidUtf8File() {
  return Buffer.from([
    0xff,
    0xfe,
    0xfd,
    0x80,
    0x81,
    0x82,
    0xc0,
    0x80,
    0xf5,
    0x80,
    0x80,
    0x80,
  ]);
}

/**
 * Create a file with an unacceptable mimetype for testing.
 * @returns {Buffer}
 */
function makeNotAcceptedFile() {
  return Buffer.from('test');
}

module.exports = {
  createArrayPageObjects,
  createTestConfig,
  inProgressMock,
  resolvePageHooks,
  fieldKeyToDataPath,
  setupInProgressReturnUrl,
  makeMinimalPNG,
  makeMinimalJPG,
  makeMinimalPDF,
  makeEncryptedPDF,
  makeMinimalTxtFile,
  makeInvalidUtf8File,
  makeNotAcceptedFile,
};
