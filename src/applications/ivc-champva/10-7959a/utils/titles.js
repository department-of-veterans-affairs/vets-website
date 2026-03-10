import {
  titleUI,
  withEditTitle,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../locales/en/content.json';
import {
  capitalizeFirst,
  formatFullName,
  makePossessive,
  replaceStrValues,
} from './helpers';

const DEFAULT_OPTS = {
  // common template behavior
  placeholder: '%s',
  capitalize: true,

  // role logic
  roleKey: 'certifierRole',
  matchRole: 'applicant',
  self: content['noun--your'],
  other: content['noun--beneficiary'],

  // name logic
  nameKey: 'applicantName',
  firstNameOnly: true,
  possessive: true,

  // generic form data value logic
  dataKey: 'name',
  fallback: '',

  // array builder behavior
  arrayBuilder: false,
  lowercase: false,

  // titleWithNameUI styling
  piiClassNames:
    'vads-u-color--black vads-u-margin-top--0 mobile-lg:vads-u-font-size--h2 vads-u-font-size--h3 dd-privacy-hidden',
};

/**
 * Merges user options with defaults.
 * @param {Object} opts - User-provided options
 * @returns {Object} Merged options object
 */
const mergeOpts = (opts = {}) => ({ ...DEFAULT_OPTS, ...opts });

/**
 * Fills a title template by replacing a placeholder with a value.
 * @param {string} src - Template string with placeholder
 * @param {string} value - Value to insert into template
 * @param {Object} opts - Options containing placeholder and capitalize flags
 * @returns {string} Formatted title string
 */
const fillTitleTemplate = (src, value, opts) => {
  const { placeholder, capitalize } = opts;
  if (!src) return '';
  if (!value) return src;

  const target = capitalize ? capitalizeFirst(value) : value;
  return replaceStrValues(src, target, placeholder);
};

/**
 * Wraps a computed title with array builder edit-title behavior when configured.
 * @param {Function} computedTitle - Function that returns the computed title
 * @param {Object} opts - Configuration options
 * @returns {Function|string} Title function or wrapped edit title
 */
const wrapTitleForArrayBuilder = (computedTitle, opts) =>
  opts.arrayBuilder
    ? withEditTitle(computedTitle, opts.lowercase)
    : computedTitle;

/**
 * Creates a computed title function from a value resolver.
 * @param {string} title - Title template with placeholder
 * @param {Function} resolveValue - Function that resolves the replacement value from formData and opts
 * @param {Object} opts - Configuration options
 * @returns {Function} Function that returns the computed title string
 */
const makeTitleValue = (title, resolveValue, opts) => ({ formData }) =>
  fillTitleTemplate(title, resolveValue(formData, opts), opts);

/**
 * Checks if the form certifier is the applicant (self).
 * @param {Object} formData - Form data object
 * @param {Object} opts - Options containing roleKey and matchRole
 * @returns {boolean} True if certifier is self
 */
const isSelf = (formData, opts) => formData?.[opts.roleKey] === opts.matchRole;

/**
 * Resolves a configured value from form data.
 * Supports either a direct form data key or a resolver function.
 *
 * @param {Object} formData - Form data object
 * @param {Object} opts - Options containing dataKey and fallback
 * @returns {string} Resolved value or fallback
 */
const resolveFormDataValue = (formData, opts) => {
  const value =
    typeof opts.dataKey === 'function'
      ? opts.dataKey(formData)
      : formData?.[opts.dataKey];

  return value ?? opts.fallback;
};

/**
 * Generates a label from the applicant's name.
 * @param {Object} formData - Form data object
 * @param {Object} opts - Options for name formatting
 * @returns {string} Formatted name label
 */
const nameLabel = (formData, opts) => {
  const nameObj = formData?.[opts.nameKey] || {};
  const baseName = opts.firstNameOnly ? nameObj.first : formatFullName(nameObj);
  const nameToUse = baseName || opts.other;

  return opts.possessive ? makePossessive(nameToUse) : nameToUse;
};

/**
 * Generates a label from the configured role text.
 * @param {Object} opts - Options containing other and possessive
 * @returns {string} Formatted role label
 */
const roleLabel = opts =>
  opts.possessive ? makePossessive(opts.other) : opts.other;

/**
 * Determines the appropriate subject label based on role and mode.
 * @param {Object} formData - Form data object
 * @param {Object} opts - Configuration options
 * @returns {string} Subject label for title
 */
const subjectLabel = (formData, opts) => {
  if (isSelf(formData, opts)) return opts.self;
  if (opts.mode === 'role') return roleLabel(opts);

  const label = nameLabel(formData, opts);
  return label || roleLabel(opts);
};

/**
 * Creates a text-only title function from a value resolver.
 * Returns a function that accepts formData and computes the title text.
 * No heading wrapper or UI styling applied.
 *
 * @param {string} title - Title template with placeholder
 * @param {Function} resolveValue - Function that resolves the replacement value from formData and opts
 * @param {Object} [options={}] - Configuration options
 * @returns {Function} Function that accepts formData and returns computed title text
 */
const computeTitleText = (title, resolveValue, options = {}) => {
  const opts = mergeOpts(options);
  return formData =>
    fillTitleTemplate(title, resolveValue(formData, opts), opts);
};

/**
 * Factory function that creates title UI helpers from a value resolver.
 * @param {Function} resolveValue - Function that resolves the replacement value from formData and opts
 * @param {Object} baseOptions - Base options to merge with user options
 * @returns {Function} Title UI function
 */
const makeDynamicTitleUI = (resolveValue, baseOptions = {}) => (
  title,
  description = null,
  options = {},
) => {
  const opts = mergeOpts({ ...baseOptions, ...options });
  const computedTitle = makeTitleValue(title, resolveValue, opts);
  const titleValue = wrapTitleForArrayBuilder(computedTitle, opts);

  return titleUI({
    title: titleValue,
    description,
    classNames: opts.classNames,
  });
};

/**
 * Creates a dynamic title that adapts based on the certifier's role.
 *
 * Displays different text depending on whether the user is the applicant (self)
 * or someone filling out the form on behalf of the beneficiary (other).
 * Always uses role-based text, not names.
 *
 * @param {string} title - Title template with placeholder for role-based text
 * @param {string|React.Component} [description=null] - Optional description element
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.capitalize=true] - Whether to capitalize the first letter
 * @param {string} [options.placeholder='%s'] - Placeholder token to replace
 * @param {string} [options.roleKey='certifierRole'] - Form data key containing the role
 * @param {string} [options.matchRole='applicant'] - Role value that indicates self
 * @param {string} [options.self='Your'] - Text to use when user is applicant
 * @param {string} [options.other='Beneficiary'] - Text to use when user is not applicant
 * @param {boolean} [options.possessive=true] - Whether to add possessive 's to other
 * @param {boolean} [options.arrayBuilder=false] - Whether to apply array builder edit title behavior
 * @param {boolean} [options.lowercase=false] - Whether array builder edit titles should remain lowercase
 * @param {string} [options.classNames] - Optional CSS classes to apply to the title
 * @returns {Object} UI schema object for titleUI
 *
 * @example
 * // "Your mailing address" or "Beneficiary's mailing address"
 * titleWithRoleUI('%s mailing address')
 *
 * @example
 * // "Their contact info"
 * titleWithRoleUI('%s contact info', null, {
 *   self: 'your',
 *   other: 'their',
 *   capitalize: false,
 *   possessive: false,
 * })
 */
export const titleWithRoleUI = makeDynamicTitleUI(subjectLabel, {
  mode: 'role',
});

/**
 * Creates a dynamic title using the applicant's name or role-based text.
 *
 * When the certifier is the applicant (self), displays role-based text.
 * When filling out for someone else, displays the beneficiary's name with
 * optional possessive form. Includes PII masking CSS classes for privacy protection.
 *
 * @param {string} title - Title template with placeholder for name or role text
 * @param {string|React.Component} [description=null] - Optional description element
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.capitalize=true] - Whether to capitalize the first letter
 * @param {boolean} [options.firstNameOnly=true] - Whether to use only first name or full name
 * @param {boolean} [options.possessive=true] - Whether to add possessive 's to the name
 * @param {string} [options.placeholder='%s'] - Placeholder token to replace
 * @param {string} [options.nameKey='applicantName'] - Form data key containing the name object
 * @param {string} [options.roleKey='certifierRole'] - Form data key containing the role
 * @param {string} [options.matchRole='applicant'] - Role value that indicates self
 * @param {string} [options.self='Your'] - Text to use when user is applicant
 * @param {string} [options.other='Beneficiary'] - Fallback text when name is unavailable
 * @param {string} [options.classNames] - Custom CSS classes
 * @param {boolean} [options.arrayBuilder=false] - Whether to apply array builder edit title behavior
 * @param {boolean} [options.lowercase=false] - Whether array builder edit titles should remain lowercase
 * @returns {Object} UI schema object for titleUI with PII protection
 *
 * @example
 * // "Your identification information" or "John's identification information"
 * titleWithNameUI('%s identification information')
 *
 * @example
 * // "Contact information for John Michael Smith"
 * titleWithNameUI('Contact information for %s', null, {
 *   firstNameOnly: false,
 *   possessive: false,
 * })
 */
export const titleWithNameUI = makeDynamicTitleUI(subjectLabel, {
  mode: 'name',
  classNames: DEFAULT_OPTS.piiClassNames,
});

/**
 * Creates a dynamic title using a configurable form data value.
 *
 * Replaces a placeholder in the title template with a value resolved from form data.
 * The value may come from a direct form data key or from a resolver function.
 * Can be used for standard pages or array builder pages. When used with
 * `arrayBuilder: true`, automatically adds edit title behavior for existing items.
 *
 * @param {string} title - Title template with placeholder for the form data value
 * @param {string|React.Component} [description=null] - Optional description element
 * @param {Object} [options] - Configuration options
 * @param {string|Function} [options.dataKey='provider'] - Form data key or resolver function that returns the value to display
 * @param {string} [options.fallback=''] - Fallback value when the resolved value is missing
 * @param {boolean} [options.capitalize=true] - Whether to capitalize the inserted value
 * @param {string} [options.placeholder='%s'] - Placeholder token to replace
 * @param {string} [options.classNames] - Optional CSS classes to apply to the title
 * @param {boolean} [options.arrayBuilder=false] - Whether to apply array builder edit title behavior
 * @param {boolean} [options.lowercase=false] - Whether array builder edit titles should remain lowercase
 * @returns {Object} UI schema object for titleUI
 *
 * @example
 * // "Cigna prescription coverage"
 * titleWithFormDataUI('%s prescription coverage', null, {
 *   dataKey: 'provider',
 *   capitalize: false,
 * })
 *
 * @example
 * // "Explanation of benefits for Aetna"
 * titleWithFormDataUI('Explanation of benefits for %s', null, {
 *   dataKey: formData => formData?.policies?.[0]?.name,
 *   capitalize: false,
 * })
 */
export const titleWithFormDataUI = makeDynamicTitleUI(resolveFormDataValue);

/**
 * Creates a text-only dynamic title using the applicant's name or role-based text.
 * Returns plain text (no titleUI / heading wrapper), useful when embedding inside
 * existing headings (for example array-builder summary titles).
 *
 * @param {string} title - Title template with placeholder
 * @param {Object} [options] - Same options as titleWithNameUI
 * @returns {Function} Function that accepts formData and returns title text
 */
export const titleWithNameText = (title, options = {}) =>
  computeTitleText(title, subjectLabel, { mode: 'name', ...options });
