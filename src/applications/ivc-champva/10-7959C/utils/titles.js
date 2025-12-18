import {
  arrayBuilderItemSubsequentPageTitleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { replaceStrValues } from '../helpers/formatting';
import content from '../locales/en/content.json';

/**
 * Creates a dynamic Health Insurance page title with provider name.
 *
 * @param {string} title - The page-specific title. Use placeholder token for provider name.
 * @param {string|React.Component} [description=null] - Optional description element
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.lowercase=false] - Whether to lowercase the title
 * @param {string} [options.placeholder='%s'] - Placeholder token to replace with provider name
 * @returns {Object} UI schema object for arrayBuilderItemSubsequentPageTitleUI
 *
 * @example
 * // Basic usage: "Cigna prescription coverage"
 * healthInsurancePageTitleUI('%s prescription coverage')
 *
 * @example
 * // Provider in middle: "Type of insurance for Cigna"
 * healthInsurancePageTitleUI('Type of insurance for %s')
 *
 * @example
 * // Custom placeholder: "Upload [Cigna] card"
 * healthInsurancePageTitleUI('Upload [%p] card', null, { placeholder: '%p' })
 */
export const healthInsurancePageTitleUI = (
  title,
  description = null,
  { lowercase = false, placeholder = '%s' } = {},
) =>
  arrayBuilderItemSubsequentPageTitleUI(
    ({ formData }) => {
      const provider = formData?.provider;
      return replaceStrValues(title, provider, placeholder);
    },
    description,
    lowercase,
  );

/**
 * Creates a dynamic title that adapts based on the certifier's role.
 *
 * Displays different text depending on whether the user is the applicant (self)
 * or someone filling out the form on behalf of the beneficiary (other).
 *
 * @param {string} title - The title template with placeholder for role-based text
 * @param {string|React.Component} [description=null] - Optional description element
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.capitalize=true] - Whether to capitalize the first letter
 * @param {string} [options.placeholder='%s'] - Placeholder token to replace with role-based text
 * @param {string} [options.matchRole='applicant'] - Role value that indicates self
 * @param {string} [options.roleKey='certifierRole'] - Form data key containing the role
 * @param {string} [options.self='Your'] - Text to use when user is applicant
 * @param {string} [options.other='Beneficiary'] - Text to use when user is not applicant (adds possessive 's)
 * @returns {Object} UI schema object for titleUI
 *
 * @example
 * // When certifierRole === 'applicant': "Your mailing address"
 * // When certifierRole !== 'applicant': "Beneficiary's mailing address"
 * titleWithRoleUI('%s mailing address')
 *
 * @example
 * // Custom role text: "Their contact info"
 * titleWithRoleUI('%s contact info', null, { self: 'your', other: 'their', capitalize: false })
 */
export const titleWithRoleUI = (
  title,
  description = null,
  {
    capitalize = true,
    placeholder = '%s',
    matchRole = 'applicant',
    roleKey = 'certifierRole',
    self = content['noun--your'],
    other = content['noun--beneficiary'],
  } = {},
) =>
  titleUI(({ formData }) => {
    if (!title) return '';

    const target = formData?.[roleKey] === matchRole ? self : `${other}\u2019s`;
    const formattedTarget =
      capitalize && target
        ? target.charAt(0).toUpperCase() + target.slice(1)
        : target;

    return replaceStrValues(title, formattedTarget, placeholder);
  }, description);

/**
 * Creates a dynamic title using the applicant's name or role-based text.
 *
 * When the certifier is the applicant (self), displays role-based text (e.g., "Your").
 * When filling out for someone else, displays the beneficiary's name with optional
 * possessive form and returns privacy class for PII masking.
 *
 * @param {string} title - The title template with placeholder for name or role text
 * @param {string|React.Component} [description=null] - Optional description element
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.capitalize=true] - Whether to capitalize the first letter
 * @param {boolean} [options.firstNameOnly=true] - Whether to use only first name or full name
 * @param {boolean} [options.possessive=true] - Whether to add possessive 's to the name
 * @param {string} [options.placeholder='%s'] - Placeholder token to replace with name/role text
 * @param {string} [options.nameKey='applicantName'] - Form data key containing the name object
 * @param {string} [options.matchRole='applicant'] - Role value that indicates self
 * @param {string} [options.roleKey='certifierRole'] - Form data key containing the role
 * @param {string} [options.self='Your'] - Text to use when user is applicant
 * @param {string} [options.other='Beneficiary'] - Fallback text when name is unavailable
 * @returns {Object} UI schema object for titleUI with title and classNames properties
 *
 * @example
 * // When certifierRole === 'applicant': "Your identification information"
 * // When certifierRole !== 'applicant': "John's identification information"
 * titleWithNameUI('%s identification information')
 *
 * @example
 * // Full name without possessive: "Contact information for John Michael Smith"
 * titleWithNameUI('Contact information for %s', null, { firstNameOnly: false, possessive: false })
 */
export const titleWithNameUI = (
  title,
  description = null,
  {
    capitalize = true,
    firstNameOnly = true,
    possessive = true,
    placeholder = '%s',
    nameKey = 'applicantName',
    matchRole = 'applicant',
    roleKey = 'certifierRole',
    self = content['noun--your'],
    other = content['noun--beneficiary'],
  } = {},
) =>
  titleUI({
    title: ({ formData }) => {
      if (!title) return '';

      const isSelf = formData?.[roleKey] === matchRole;
      const target = isSelf
        ? self
        : (() => {
            const nameObj = formData?.[nameKey] || {};
            const baseName = firstNameOnly
              ? nameObj.first || other
              : [nameObj.first, nameObj.middle, nameObj.last, nameObj.suffix]
                  .filter(Boolean)
                  .join(' ') || other;
            return possessive ? `${baseName}\u2019s` : baseName;
          })();
      const formattedTarget =
        capitalize && target
          ? target.charAt(0).toUpperCase() + target.slice(1)
          : target;

      return replaceStrValues(title, formattedTarget, placeholder);
    },
    description,
    classNames: 'dd-privacy-hidden',
  });
