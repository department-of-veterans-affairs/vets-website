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

// this function generates a file with invalid UTF8 encoding for testing purposes
export function makeInvalidUtf8File() {
  // Create bytes that form invalid UTF-8 sequences
  const invalidBytes = new Uint8Array([
    0xff,
    0xfe,
    0xfd, // Invalid UTF-8 bytes (not valid start bytes)
    0x80,
    0x81,
    0x82, // Continuation bytes without proper start byte
    0xc0,
    0x80, // Overlong encoding (invalid in UTF-8)
    0xf5,
    0x80,
    0x80,
    0x80, // Beyond valid Unicode range
  ]);

  const blob = new Blob([invalidBytes], { type: 'text/plain' });
  return new File([blob], 'invalid_utf8.txt', { type: 'text/plain' });
}

/**
 * Create a minimal .txt file for use testing file inputs
 * @return {File} file - a File object containing a minimal text file
 */
export function makeMinimalTxtFile(bytes = 10) {
  const content = 'a'.repeat(bytes);
  const blob = new Blob([content], { type: 'text/plain' });
  return new File([blob], 'test.txt', { type: 'text/plain' });
}

/**
 * Create a minimal encrypted .pdf file for testing encrypted PDF rejection
 * @return {Promise<File>} file - a File object containing a valid encrypted PDF
 */
export async function makeEncryptedPDF() {
  // Minimal valid PDF with /Encrypt signature (will be flagged as encrypted)
  const b64EncryptedPDFData =
    'JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqIDIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iaiAzIDAgb2JqPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCAzIDNdL1BhcmVudCAyIDAgUj4+ZW5kb2JqIDQgMCBvYmo8PC9FbmNyeXB0PDwvRmlsdGVyL1N0YW5kYXJkL1YgMS9SPDE+Pj4+ZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA1MiAwMDAwMCBuCjAwMDAwMDAxMDEgMDAwMDAgbgowMDAwMDAwMTU4IDAwMDAwIG4KdHJhaWxlcjw8L1NpemUgNS9Sb290IDEgMCBSL0VuY3J5cHQgNCAwIFI+PgpzdGFydHhyZWYKMjI4CiUlRU9G';
  const res = await fetch(`data:application/pdf;base64,${b64EncryptedPDFData}`);
  const blob = await res.blob();
  return new File([blob], 'encrypted.pdf', { type: 'application/pdf' });
}

/**
 * Create a minimal .jpg file for use testing file inputs
 * @return {Promise<File>} file - a File object containing a valid and small .jpg file
 */
export async function makeMinimalJPG() {
  // Minimal valid JPEG (1x1 pixel, red)
  const b64JPGData =
    '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A3vDv/IEh/wB5v/QjW7VDYS2EPg/R4oLaGCMOSEijVFH4AYq/QAUUUUAFFFFAH//Z';
  const res = await fetch(`data:image/jpeg;base64,${b64JPGData}`);
  const blob = await res.blob();
  return new File([blob], 'placeholder.jpg', { type: 'image/jpeg' });
}

/**
 * Create a minimal .pdf file for use testing file inputs
 * @return {Promise<File>} file - a File object containing a valid and small .pdf file
 */
export async function makeMinimalPDF() {
  // Minimal valid PDF (empty page)
  const b64PDFData =
    'JVBERi0xLjAKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqIDIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iaiAzIDAgb2JqPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCAzIDNdL1BhcmVudCAyIDAgUj4+ZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA1MiAwMDAwMCBuCjAwMDAwMDAxMDEgMDAwMDAgbgp0cmFpbGVyPDwvU2l6ZSA0L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKMTUwCiUlRU9G';
  const res = await fetch(`data:application/pdf;base64,${b64PDFData}`);
  const blob = await res.blob();
  return new File([blob], 'placeholder.pdf', { type: 'application/pdf' });
}

/**
 * Create a minimal .fake file that will not have an acceptable mimetype
 * @return {File} file - a File object containing a minimal .fake file
 */
export function makeNotAcceptedFile() {
  const blob = new Blob(['test'], { type: 'text/plain' });
  return new File([blob], 'test.fake', { type: 'application/octet-stream' });
}
