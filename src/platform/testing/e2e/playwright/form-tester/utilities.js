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

  return (arrayPages || []).map(({ arrayPath, pathStr }) => ({
    arrayPath,
    regex: new RegExp(pathStr.replace(':index', '(\\d+)')),
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
    .replace(/\._(\d+)\./g, (_, number) => `[${number}]`);
}

module.exports = {
  createArrayPageObjects,
  createTestConfig,
  inProgressMock,
  resolvePageHooks,
  fieldKeyToDataPath,
};
