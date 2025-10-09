import content from '../../locales/en/content.json';

/**
 * Replace placeholder(s) in a string with one or more values.
 *
 * - If `val` is an array, replaces one occurrence per item, left-to-right.
 * - If there are more placeholders than values, leftover placeholders remain.
 * - If there are more values than placeholders, extras are ignored.
 * - Returns an empty string if `src` or `val` is falsy.
 *
 * @param {string|number|boolean} src - Source to convert to string and parse.
 * @param {string|number|boolean|Array<string|number|boolean>} val - Value(s) to insert.
 * @param {string} [char='%s'] - Placeholder token to replace (literal match).
 * @returns {string} String with replacements applied.
 *
 * @example
 * replaceStrValues('Hello, %s!', 'World');        // 'Hello, World!'
 * @example
 * replaceStrValues('%s-%s-%s', ['a', 'b']);      // 'a-b-%s'
 * @example
 * replaceStrValues('X %s Y %s Z', ['1', '2']);   // 'X 1 Y 2 Z'
 */
export const replaceStrValues = (src, val, char = '%s') => {
  if (!src || !val) return '';
  if (Array.isArray(val)) {
    return val.reduce(
      (result, value) => result.replace(char, value),
      src.toString(),
    );
  }
  return src.toString().replace(char, val);
};

/**
 * Personalize a title by replacing a placeholder with a role-based possessive.
 *
 * If the user's role in `formData[roleKey]` matches `matchRole`, inserts `self`.
 * Otherwise inserts `other`. The replacement is applied to the first occurrence
 * of `placeholder` (or multiple if you call `replaceStrValues` with an array).
 *
 * @param {object} formData - Data containing a role field (e.g., certifierRole).
 * @param {string} title - Title string containing a placeholder (e.g., "%s mailing address").
 * @param {object} [opts]
 * @param {string} [opts.roleKey='certifierRole'] - Key in formData holding the role.
 * @param {string} [opts.matchRole='applicant']   - Role to treat as "self".
 * @param {string} [opts.placeholder='%s']        - Placeholder token to replace.
 * @param {string} [opts.self='Your']             - Text used when roles match.
 * @param {string} [opts.other="Beneficiary’s"]   - Text used when roles do not match.
 * @returns {string} The personalized title, or empty string if inputs are missing.
 *
 * @example
 * personalizeTitleByRole(
 *   { certifierRole: 'applicant' },
 *   '%s contact information'
 * ); // "Your contact information"
 *
 * @example
 * personalizeTitleByRole(
 *   { certifierRole: 'representative' },
 *   '%s contact information'
 * ); // "Beneficiary's contact information"
 */
export const personalizeTitleByRole = (
  formData,
  title,
  {
    roleKey = 'certifierRole',
    matchRole = 'applicant',
    placeholder = '%s',
    self = content['page-title--your'],
    other = content['page-title--beneficiary-plural'],
  } = {},
) => {
  if (!formData || !title) return '';
  const target = formData[roleKey] === matchRole ? self : other;
  return replaceStrValues(title, target, placeholder);
};
