import get from 'platform/utilities/data/get';
import { capitalize } from 'lodash';

export const annualReceivedIncomeFromAnnuityRequired = (form, index) =>
  get(['annuities', index, 'receivingIncomeFromAnnuity'], form);

export const annualReceivedIncomeFromTrustRequired = (form, index) =>
  get(['trusts', index, 'receivingIncomeFromTrust'], form);

export const isReviewAndSubmitPage = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.includes('review-and-submit');
};

export const hasSession = () => {
  return localStorage.getItem('hasSession') === 'true';
};

export const formatCurrency = num => `$${num.toLocaleString()}`;

/**
 * Formats a name object into a capitalized full name string with middle initial.
 * @param {{ first: string, middle?: string, last: string }} name
 * @returns {string}
 */
export const formatFullNameNoSuffix = name => {
  if (!name?.first || !name?.last) {
    return '';
  }

  const first = capitalize(name.first);
  const trimmedMiddle = name.middle?.trim();
  const middleInitial = trimmedMiddle
    ? `${capitalize(trimmedMiddle.charAt(0))}.`
    : '';
  const last = capitalize(name.last);

  return [first, middleInitial, last].filter(Boolean).join(' ');
};

/**
 * Converts any string (e.g., a person's name or noun) to its possessive form.
 * - "Johnson" -> "Johnson’s"
 * - "Williams" -> "Williams’"
 * - "Business" -> "Business’"
 * - "Emma Lee" -> "Emma Lee’s"
 *
 * @param {string} str - The string to convert (e.g., full name or label)
 * @returns {string} - Possessive form of the string
 */
export const formatPossessiveString = str => {
  if (!str || typeof str !== 'string') return '';
  return str.endsWith('s') ? `${str}’` : `${str}’s`;
};

export const isDefined = value => {
  return value !== '' && typeof value !== 'undefined' && value !== null;
};

export const monthlyMedicalReimbursementAmountRequired = (form, index) =>
  get(['trusts', index, 'monthlyMedicalReimbursementAmount'], form);

export const otherAssetOwnerRelationshipExplanationRequired = (form, index) =>
  get(['unreportedAssets', index, 'assetOwnerRelationship'], form) === 'OTHER';

export const otherRecipientRelationshipExplanationRequired = (
  form,
  index,
  arrayKey,
) => get([arrayKey, index, 'recipientRelationship'], form) === 'OTHER';

export const otherIncomeTypeExplanationRequired = (form, index, arrayIndex) =>
  get([arrayIndex, index, 'incomeType'], form) === 'OTHER';

export const otherGeneratedIncomeTypeExplanationRequired = (form, index) =>
  get(
    ['royaltiesAndOtherProperties', index, 'incomeGenerationMethod'],
    form,
  ) === 'OTHER';

export const otherNewOwnerRelationshipExplanationRequired = (form, index) =>
  get(['assetTransfers', index, 'originalOwnerRelationship'], form) === 'OTHER';

export const otherTransferMethodExplanationRequired = (form, index) =>
  get(['assetTransfers', index, 'transferMethod'], form) === 'OTHER';

export const recipientNameRequired = (form, index, arrayKey) =>
  get([arrayKey, index, 'recipientRelationship'], form) !== 'VETERAN';

export const surrenderValueRequired = (form, index) =>
  get(['annuities', index, 'canBeLiquidated'], form);

export const isRecipientInfoIncomplete = item =>
  !isDefined(item?.recipientRelationship) ||
  (!isDefined(item?.recipientName) &&
    item?.recipientRelationship !== 'VETERAN') ||
  (!isDefined(item?.otherRecipientRelationshipType) &&
    item?.recipientRelationship === 'OTHER');

export const isIncomeTypeInfoIncomplete = item =>
  !isDefined(item?.incomeType) ||
  (!isDefined(item?.otherIncomeType) && item?.incomeType === 'OTHER');

/**
 * Generates the delete description text for an array item.
 *
 * @param {Object} props - Props passed to the deleteDescription text field.
 * @param {Function} getItemName - The getItemName function from the text config.
 * @returns {string} - The description to show in the delete confirmation dialog.
 */
export const generateDeleteDescription = (props, getItemName) => {
  const itemName = getItemName(props.itemData, props.index, props.formData);
  return itemName
    ? `This will delete ${itemName} from your list of ${props.nounPlural}.`
    : `This will delete this ${props.nounSingular} from your list of ${
        props.nounPlural
      }.`;
};

/**
 * Resolve the recipient's full name to display on summary cards.
 *
 * - If the recipientRelationship is "VETERAN":
 *   - Use `veteranFullName` when the user is logged in
 *   - Use `otherVeteranFullName` when the user is not logged in
 * - If the recipient is not the Veteran, use `recipientName`
 *
 * This helper is useful across multiple arrayBuilder pages where we conditionally display
 * either the Veteran's name or the name of another recipient.
 *
 * @param {object} item - The array item object containing recipient data.
 * @param {object} formData - The overall form data, which may include veteran names and logged in.
 * @returns {string} The formatted full name string or undefined if no name is resolvable
 */
export function resolveRecipientFullName(item, formData) {
  const { recipientRelationship, recipientName } = item;
  const {
    veteranFullName,
    otherVeteranFullName,
    isLoggedIn = false,
  } = formData;

  const isVeteran = recipientRelationship === 'VETERAN';

  if (isVeteran) {
    const veteranName = isLoggedIn ? veteranFullName : otherVeteranFullName;
    return formatFullNameNoSuffix(veteranName);
  }

  return formatFullNameNoSuffix(recipientName);
}
