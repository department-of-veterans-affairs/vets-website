import {
  arrayBuilderItemSubsequentPageTitleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
import MedicarePageTitle from '../components/FormDescriptions/MedicarePageTitle';
import content from '../locales/en/content.json';
import {
  capitalizeFirst,
  formatFullName,
  makePossessive,
  replaceStrValues,
} from './helpers/formatting';

const DEFAULT_OPTS = {
  // common template behavior
  placeholder: '%s',
  capitalize: true,

  // role logic
  roleKey: 'certifierRole',
  matchRole: 'applicant',
  self: content['noun--your'],
  other: content['noun--veteran'],

  // name logic
  nameKey: 'applicantName',
  firstNameOnly: true,
  possessive: true,

  // titleWithNameUI styling
  piiClassNames:
    'vads-u-color--black vads-u-margin-top--0 mobile-lg:vads-u-font-size--h2 vads-u-font-size--h3 dd-privacy-hidden',
};

/**
 * Fills a title template by replacing placeholder with a value.
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
 * Checks if the form certifier is the applicant (self).
 * @param {Object} formData - Form data object
 * @param {Object} opts - Options containing roleKey and matchRole
 * @returns {boolean} True if certifier is self
 */
const isSelf = (formData, opts) => formData?.[opts.roleKey] === opts.matchRole;

/**
 * Merges user options with defaults.
 * @param {Object} opts - User-provided options
 * @returns {Object} Merged options object
 */
const mergeOpts = (opts = {}) => ({ ...DEFAULT_OPTS, ...opts });

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
 * Generates a label from the role text.
 * @param {Object} opts - Options containing other and possessive
 * @returns {string} Formatted role label
 */
const roleLabel = opts =>
  opts.possessive ? makePossessive(opts.other) : opts.other;

/**
 * Determines the appropriate subject label based on role and mode.
 * @param {Object} formData - Form data object
 * @param {Object} options - Configuration options
 * @returns {string} Subject label for title
 */
const subjectLabel = (formData, options = {}) => {
  const opts = mergeOpts(options);
  if (isSelf(formData, opts)) return opts.self;
  if (opts.mode === 'role') return roleLabel(opts);
  const label = nameLabel(formData, opts);
  return label || roleLabel(opts);
};

/**
 * Factory function that creates title UI functions with preset options.
 * @param {Object} baseOptions - Base options to merge with user options
 * @returns {Function} Title UI function
 */
const makeSubjectTitleUI = (baseOptions = {}) => (
  title,
  description = null,
  options = {},
) => {
  const opts = mergeOpts({ ...baseOptions, ...options });
  return titleUI({
    title: ({ formData }) =>
      fillTitleTemplate(title, subjectLabel(formData, opts), opts),
    description,
    classNames: opts.classNames,
  });
};

/**
 * Creates a dynamic health insurance page title with provider name.
 *
 * Replaces a placeholder in the title template with the insurance provider name
 * from form data. Used within array builder patterns for multiple insurance policies.
 *
 * @param {string} title - Title template with placeholder
 * @param {string|React.Component} [description=null] - Optional description element
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.lowercase=false] - Whether to lowercase the title
 * @param {string} [options.placeholder='%s'] - Placeholder token to replace
 * @returns {Object} UI schema object for arrayBuilderItemSubsequentPageTitleUI
 *
 * @example
 * // "Cigna prescription coverage"
 * healthInsurancePageTitleUI('%s prescription coverage')
 *
 * @example
 * // "Type of insurance for Cigna"
 * healthInsurancePageTitleUI('Type of insurance for %s')
 *
 * @example
 * // Custom placeholder: "Upload [Cigna] card"
 * healthInsurancePageTitleUI('Upload [%p] card', null, { placeholder: '%p' })
 */
export const healthInsurancePageTitleUI = (
  title,
  description = null,
  { lowercase = false, placeholder = DEFAULT_OPTS.placeholder } = {},
) =>
  arrayBuilderItemSubsequentPageTitleUI(
    ({ formData }) =>
      fillTitleTemplate(
        title,
        formData?.provider,
        mergeOpts({ placeholder, capitalize: false }),
      ),
    description,
    lowercase,
  );

/**
 * Creates a dynamic Medicare page title with participant name.
 * Uses a component that accesses Redux to get the full form data.
 * Generates titles like "Jane Doe's Medicare plan types"
 *
 * @param {string} title - The page-specific title (e.g., 'Medicare plan types')
 * @param {string|React.Component} [description=null] - Optional description
 * @returns {Object} UI schema object for titleUI
 */
export const medicarePageTitleUI = (title, description = null) => {
  const pageTitle = ({ formData: item }) => (
    <MedicarePageTitle item={item} title={title} />
  );
  return titleUI(pageTitle, description);
};

/**
 * Creates a dynamic title that adapts based on the certifier's role.
 *
 * Displays different text depending on whether the user is the applicant (self)
 * or someone filling out the form on behalf of the Veteran or beneficiary (other).
 * Always uses role-based text (e.g., "Your" or "Veteran's"), not names.
 *
 * @param {string} title - Title template with placeholder for role-based text
 * @param {string|React.Component} [description=null] - Optional description element
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.capitalize=true] - Whether to capitalize the first letter
 * @param {string} [options.placeholder='%s'] - Placeholder token to replace
 * @param {string} [options.roleKey='certifierRole'] - Form data key containing the role
 * @param {string} [options.matchRole='applicant'] - Role value that indicates self
 * @param {string} [options.self='Your'] - Text to use when user is applicant
 * @param {string} [options.other='Veteran'] - Text to use when user is not applicant
 * @param {boolean} [options.possessive=true] - Whether to add possessive 's to other
 * @returns {Object} UI schema object for titleUI
 *
 * @example
 * // "Your mailing address" or "Veteran's mailing address"
 * titleWithRoleUI('%s mailing address')
 *
 * @example
 * // "Their contact info" (lowercase, no possessive)
 * titleWithRoleUI('%s contact info', null, {
 *   self: 'your',
 *   other: 'their',
 *   capitalize: false,
 *   possessive: false
 * })
 *
 * @example
 * // Custom role key and match value
 * titleWithRoleUI('%s preferences', null, {
 *   roleKey: 'relationship',
 *   matchRole: 'self'
 * })
 */
export const titleWithRoleUI = makeSubjectTitleUI({ mode: 'role' });

/**
 * Creates a dynamic title using the applicant's name or role-based text.
 *
 * When the certifier is the applicant (self), displays role-based text (e.g., "Your").
 * When filling out for someone else, displays the Veteran's name with optional
 * possessive form. Includes PII masking CSS classes for privacy protection.
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
 * @param {string} [options.other='Veteran'] - Fallback text when name is unavailable
 * @param {string} [options.classNames] - Custom CSS classes (defaults to PII masking classes)
 * @returns {Object} UI schema object for titleUI with PII protection
 *
 * @example
 * // "Your identification information" or "John's identification information"
 * titleWithNameUI('%s identification information')
 *
 * @example
 * // "Contact information for John Michael Smith" (full name, no possessive)
 * titleWithNameUI('Contact information for %s', null, {
 *   firstNameOnly: false,
 *   possessive: false
 * })
 *
 * @example
 * // Custom name key and fallback text
 * titleWithNameUI('%s medical history', null, {
 *   nameKey: 'patientName',
 *   other: 'Patient'
 * })
 *
 * @example
 * // Multiple placeholders with custom placeholder token
 * titleWithNameUI('Review %p information before submitting', null, {
 *   placeholder: '%p'
 * })
 */
export const titleWithNameUI = makeSubjectTitleUI({
  mode: 'name',
  classNames: DEFAULT_OPTS.piiClassNames,
});
