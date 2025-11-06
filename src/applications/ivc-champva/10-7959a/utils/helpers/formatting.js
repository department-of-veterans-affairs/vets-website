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
 * @param {boolean} [opts.capitalize=true]        - If true, capitalizes the first letter of the final string.
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
    capitalize = true,
    roleKey = 'certifierRole',
    matchRole = 'applicant',
    placeholder = '%s',
    self = content['noun--your'],
    other = content['noun--beneficiary-possessive'],
  } = {},
) => {
  if (!formData || !title) return '';
  let target = formData[roleKey] === matchRole ? self : other;
  if (capitalize && target) {
    target = target.charAt(0).toUpperCase() + target.slice(1);
  }
  return replaceStrValues(title, target, placeholder);
};

/**
 * Personalizes a title by inserting the applicant's name.
 *
 * Builds a display name from `formData[nameKey]` (e.g., `{ first, middle, last, suffix }`),
 * optionally using only the first name and/or adding a possessive form, then replaces the
 * first occurrence of `placeholder` in `title` with that result.
 *
 * @param {Object} formData - Source data containing the applicant's name object.
 * @param {string} title - Title template containing a placeholder token (e.g., "Confirm %s information").
 * @param {Object} [opts] - Configuration options.
 * @param {string} [opts.nameKey='applicantName'] - Path/key in `formData` where the name object is stored.
 * @param {string} [opts.placeholder='%s'] - Placeholder string in `title` to replace.
 * @param {boolean} [opts.firstNameOnly=false] - If true, uses only the first name.
 * @param {boolean} [opts.possessive=true] - If true, appends a possessive suffix to the name.
 * @param {'auto'|'apostropheOnly'|'apostropheS'} [opts.possessiveStyle='auto']
 *   - Possessive style: auto-detect for names ending in "s", force apostrophe-only, or force apostrophe+s.
 * @param {boolean} [opts.capitalize=true] - If true, capitalizes the first letter of the final string.
 * @returns {string} The title with the applicant’s name inserted (or empty string if inputs are invalid).
 *
 * @example
 * // "Confirm Alex information"
 * personalizeTitleByName(formData, 'Confirm %s information', { firstNameOnly: true, possessive: false });
 *
 * @example
 * // "Review Johnson’s documents"
 * personalizeTitleByName(formData, 'Review %s documents', { firstNameOnly: false, possessive: true });
 */
export const personalizeTitleByName = (
  formData,
  title,
  {
    capitalize = true,
    firstNameOnly = false,
    nameKey = 'applicantName',
    placeholder = '%s',
    possessive = true,
    possessiveStyle = 'auto', // 'auto' | 'apostropheOnly' | 'apostropheS'
  } = {},
) => {
  if (!formData || !title) return '';

  const nameObj = formData?.[nameKey] || {};
  const baseName = firstNameOnly
    ? nameObj.first || content['noun--beneficiary']
    : [nameObj.first, nameObj.middle, nameObj.last, nameObj.suffix]
        .filter(Boolean)
        .join(' ');

  const addPossessive = str => {
    if (!str || !possessive) return str;
    const endsWithS = /s$/i.test(str.trim());
    if (
      possessiveStyle === 'apostropheOnly' ||
      (possessiveStyle === 'auto' && endsWithS)
    ) {
      return `${str}\u2019`;
    }
    // default 'apostropheS' or auto for non-s endings
    return `${str}\u2019s`;
  };

  let target = addPossessive(baseName);

  if (capitalize && target) {
    target = target.charAt(0).toUpperCase() + target.slice(1);
  }

  return replaceStrValues(title, target, placeholder);
};
