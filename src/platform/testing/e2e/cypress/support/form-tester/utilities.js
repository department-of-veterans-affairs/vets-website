import { add, getUnixTime } from 'date-fns';
import set from 'platform/utilities/data/set';

/**
 * Builds an array of array page objects to be used for matching against
 * page URLs in order to determine whether a page is an array page, and if so,
 * which index in the array it represents.
 *
 * @param {Object} formConfig - The config used to build the form.
 * @returns {Array}
 */
export const createArrayPageObjects = formConfig => {
  // Pull pages from the form config that have an arrayPath.
  const arrayPages = Object.values(formConfig.chapters || {}).reduce(
    (acc, { pages }) => [
      ...acc,
      ...Object.values(pages).filter(({ arrayPath }) => arrayPath),
    ],
    [],
  );

  return (arrayPages || []).map(({ arrayPath, path }) => ({
    arrayPath,
    regex: new RegExp(path.replace(':index', '(\\d+)')),
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
export const createTestConfig = (config, manifest = {}, formConfig = {}) => {
  const { appName, rootUrl } = manifest;
  const arrayPages = createArrayPageObjects(formConfig);
  return { appName, arrayPages, rootUrl, ...config };
};

/**
 * Builds an in-progress form response. It'll include the return URL to make it
 * easier to run e2e tests starting from a specific page. See the
 * stopTestAfterPath property in testConfig that allows you to set the page to
 * stop at.
 * @param {Object} prefill - form data for pages before the returnUrl page
 * @param {string} returnUrl - URL to return to within the form flow
 * @param {string} version - form version based on the formConfig (usually the
 * migration length)
 * @returns {Object} - in-progress form response
 */
export default function inProgressMock({
  prefill = {},
  returnUrl,
  version,
} = {}) {
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
 * Set up a Cypress E2E test to mock an in-progress form. This function sets up
 * the API intercepts for the `/user` and `/in_progress_forms` endpoints, and
 * then logs in the mock user because the in progress form array needs to
 * include the form ID to work
 * @param {*} formConfig - The form config object, we really only need the
 *  formId and version from it
 * @param {string} returnUrl - The URL to return to to continue the form flow
 * @param {Object} prefill - The form data to use in the in-progress form, but
 *  only include fields before the returnUrl page
 * @param {Object} user - The user object to use in the mock user response
 */
export const setupInProgressReturnUrl = ({
  formConfig = {},
  returnUrl = '',
  prefill = {}, // all previous page form data
  user = {},
}) => {
  const { formId, version } = formConfig;

  if (!formId) {
    throw new Error('formId is required to set up in-progress return URL');
  }

  const userData = set(
    'data.attributes.inProgressForms',
    [
      {
        form: formId,
        metadata: inProgressMock({ returnUrl, version }).metadata,
        lastUpdated: 1715357232,
      },
    ],
    user,
  );

  cy.intercept('GET', '/v0/user', userData).as('mockUser');

  cy.intercept(
    'GET',
    `/v0/in_progress_forms/${formId}`,
    inProgressMock({ prefill, returnUrl, version }),
  );

  cy.login(userData);
};

/**
 * Create a minimal .png file for use testing va-file-input-multiple
 * @return {Object} file - a File object containing a valid and small .png file
 */
export async function makeMinimalPNG() {
  const b64PNGData =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/PMh2bQAAAAASUVORK5CYII=';
  const res = await fetch(`data:image/png;base64,${b64PNGData}`);
  const blob = await res.blob();
  return new File([blob], 'placeholder.png', { type: 'image/png' });
}
