// TODO: Break this file into smaller modules.
// Suggested organization:
// - sharedUtils.js (formatting, name helpers, conditional required checks)
// - arrayBuilderHelpers.js (ArrayBuilder-specific logic and utilities)
// - sessionHelpers.js (localStorage/sessionStorage/browser-based logic)

import get from 'platform/utilities/data/get';
import { capitalize } from 'lodash';
import { fullNameNoSuffixUI } from '~/platform/forms-system/src/js/web-component-patterns';

import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';

export const showUpdatedContent = () =>
  window.sessionStorage.getItem('showUpdatedContent') === 'true';

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

export const formatCurrency = num =>
  typeof num === 'number' ? `$${num.toLocaleString()}` : '';

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

export const otherTransferMethodExplanationRequired = (form, index) =>
  get(['assetTransfers', index, 'transferMethod'], form) === 'OTHER';

export const recipientNameRequired = (form, index, arrayKey) =>
  get([arrayKey, index, 'recipientRelationship'], form) !== 'VETERAN';

export const updatedRecipientNameRequired = (form, index, arrayKey) => {
  if (!showUpdatedContent()) {
    return recipientNameRequired(form, index, arrayKey);
  }
  const recipientRelationship = get(
    [arrayKey, index, 'recipientRelationship'],
    form,
  );
  return (
    recipientRelationship === 'CHILD' ||
    recipientRelationship === 'PARENT' ||
    recipientRelationship === 'CUSTODIAN' ||
    recipientRelationship === 'OTHER'
  );
};

export const surrenderValueRequired = (form, index) =>
  get(['annuities', index, 'canBeLiquidated'], form);

export const isRecipientInfoIncomplete = item =>
  !isDefined(item?.recipientRelationship) ||
  (!isDefined(item?.recipientName) &&
    item?.recipientRelationship !== 'VETERAN') ||
  (!isDefined(item?.otherRecipientRelationshipType) &&
    item?.recipientRelationship === 'OTHER');

export const updatedIsRecipientInfoIncomplete = item => {
  if (!showUpdatedContent()) {
    return isRecipientInfoIncomplete(item);
  }
  return (
    !isDefined(item?.recipientRelationship) ||
    (!isDefined(item?.recipientName) &&
      item?.recipientRelationship !== 'VETERAN' &&
      item?.recipientRelationship !== 'SPOUSE') ||
    (!isDefined(item?.otherRecipientRelationshipType) &&
      item?.recipientRelationship === 'OTHER')
  );
};

export const isIncomeTypeInfoIncomplete = item =>
  !isDefined(item?.incomeType) ||
  (!isDefined(item?.otherIncomeType) && item?.incomeType === 'OTHER');

export const sharedRecipientRelationshipBase = {
  title: 'Who receives this income?',
  hint: 'You’ll be able to add individual incomes separately',
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '3',
};

/**
 * Returns a reusable UI schema config for the "otherRecipientRelationshipType" field.
 *
 * @param {string} arrayKey - The array key this field belongs to (e.g., 'unassociatedIncomes')
 * @param {string} otherRecipientRelationshipTypeKey - The field key this field belongs
 */
export function otherRecipientRelationshipTypeUI(
  arrayKey,
  otherRecipientRelationshipTypeKey = 'recipientRelationship',
) {
  return {
    'ui:title': 'Describe their relationship to the Veteran',
    'ui:webComponentField': VaTextInputField,
    'ui:options': {
      expandUnder: otherRecipientRelationshipTypeKey,
      expandUnderCondition: 'OTHER',
      expandedContentFocus: true,
    },
    'ui:required': (formData, index) =>
      otherRecipientRelationshipExplanationRequired(formData, index, arrayKey),
  };
}

/**
 * Returns a reusable updateSchema method to allow proper validation for expanded fields within arrays.
 * Used at the top-level of the uiSchema
 * uiSchema: {
 * 'ui:options': {
 *    ...existingUIoptions
 *    ...requireExpandedArrayField('otherRecipientRelationshipType'),
 *    }
 * }
 *
 * @param {string} expandedFieldKey - The key the expanded field belongs to (e.g., 'otherRecipientRelationshipType').
 */
export const requireExpandedArrayField = expandedFieldKey => {
  return {
    updateSchema: (formData, formSchema) => {
      const existingRequired = (formSchema.required || []).filter(
        field => field !== expandedFieldKey,
      );

      if (formSchema.properties[expandedFieldKey]['ui:collapsed']) {
        return {
          ...formSchema,
          required: existingRequired,
        };
      }

      return {
        ...formSchema,
        required: [...existingRequired, expandedFieldKey],
      };
    },
  };
};

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
    : `This will delete this ${props.nounSingular} from your list of ${props.nounPlural}.`;
};

/**
 * Resolve the recipient's full name to display on summary cards.
 *
 * - If the recipient is the Veteran, use `veteranFullName`
 * - If the recipient is not the Veteran, use `recipientName`
 *
 * This helper is useful across multiple arrayBuilder pages where we conditionally display
 * either the Veteran's name or the name of another recipient.
 *
 * @param {object} item - The array item object containing recipient data.
 * @param {object} formData - The overall form data, which includes applicant names
 * @returns {string} The formatted full name string or undefined if no name is resolvable
 */
export function resolveRecipientFullName(item, formData) {
  const { recipientRelationship, recipientName } = item;
  const { veteranFullName } = formData;

  const isVeteran = recipientRelationship === 'VETERAN';

  return isVeteran
    ? formatFullNameNoSuffix(veteranFullName)
    : formatFullNameNoSuffix(recipientName);
}

/**
 * Resolve the recipient's full name to display on summary cards.
 * Post-MVP updates
 *
 * - If the recipientRelationship is "VETERAN", use `veteranFullName`
 * - If the recipientRelationship is "SPOUSE", use "Spouse"
 * - If the recipient is not the Veteran, use `recipientName`
 *
 * This helper is useful across multiple arrayBuilder pages where we conditionally display
 * either the Veteran's name or the name of another recipient.
 *
 * @param {object} item - The array item object containing recipient data.
 * @param {object} formData - The overall form data, which includes applicant names
 * @returns {string} The formatted full name string or undefined if no name is resolvable
 */
export function updatedResolveRecipientFullName(item, formData) {
  const { recipientRelationship, recipientName } = item;
  const { veteranFullName } = formData;

  const isVeteran = recipientRelationship === 'VETERAN';

  if (isVeteran) {
    return formatFullNameNoSuffix(veteranFullName);
  }
  const isSpouse = recipientRelationship === 'SPOUSE';
  if (showUpdatedContent() && isSpouse) {
    return 'Spouse';
  }

  return formatFullNameNoSuffix(recipientName);
}

export function fullNameUIHelper() {
  return {
    ...fullNameNoSuffixUI(),
    first: {
      ...fullNameNoSuffixUI().first,
      'ui:title': 'First or given name',
    },
    middle: {
      ...fullNameNoSuffixUI().middle,
      'ui:title': 'Middle name',
    },
    last: {
      ...fullNameNoSuffixUI().last,
      'ui:title': 'Last or family name',
    },
  };
}

export const sharedYesNoOptionsBase = {
  labelHeaderLevel: '2',
  labelHeaderLevelStyle: '3',
};

/**
 * Filters and classifies owned assets based on upload status and type.
 *
 * @param {Object} formData - The form data object.
 * @param {string[]} [assetTypeAllowlist=['BUSINESS', 'FARM']] - Asset types to include.
 * @returns {{
 *   alertAssets: Array<Object>,
 *   hasFarm: boolean,
 *   hasBusiness: boolean,
 *   missingAssetTypes: string[],
 * }} An object with filtered assets and derived flags.
 */
export const getIncompleteOwnedAssets = (
  formData,
  assetTypeAllowlist = ['BUSINESS', 'FARM'],
) => {
  const assets = formData?.ownedAssets || [];

  // Filter for assets where user either declined to upload OR said yes but didn't upload
  const alertAssets = assets.filter(asset => {
    const isFarmOrBusiness = assetTypeAllowlist.includes(asset.assetType);
    const declinedUpload = asset['view:addFormQuestion'] === false;
    const saidYesButNoUpload =
      asset['view:addFormQuestion'] === true &&
      (!asset?.uploadedDocuments || !asset.uploadedDocuments.name);

    return isFarmOrBusiness && (declinedUpload || saidYesButNoUpload);
  });

  const missingAssetTypes = [
    ...new Set(alertAssets.map(asset => asset.assetType)),
  ];

  return {
    alertAssets,
    missingAssetTypes,
    hasFarm: missingAssetTypes.includes('FARM'),
    hasBusiness: missingAssetTypes.includes('BUSINESS'),
  };
};

/**
 * Determines whether uploaded documents exist and contain at least one file.
 *
 * @param {Array} uploadedDocuments - Array for files
 * @returns {boolean} True if uploaded documents exist
 */
export const hasUploadedDocuments = uploadedDocuments =>
  Array.isArray(uploadedDocuments) &&
  uploadedDocuments.some(doc => Boolean(doc?.name));

/**
 * Determines whether at least one trust is incomplete.
 *
 * A trust is considered incomplete if:
 * - The user declined to upload documents, OR
 * - The user said they would upload documents but none were provided
 *
 * @param {Array} trusts - Trusts array from form data
 * @return {boolean} True if at least one trust is incomplete
 */
export const hasIncompleteTrust = trusts =>
  (trusts ?? []).some(trust => {
    const declinedUpload = trust?.['view:addFormQuestion'] === false;

    const saidYesButNoUpload =
      trust?.['view:addFormQuestion'] === true &&
      !hasUploadedDocuments(trust?.uploadedDocuments);

    return declinedUpload || saidYesButNoUpload;
  });

/**
 * Determines whether to show the declined upload alert for owned assets.
 *
 * @param {Object} ownedAssets - The owned assets data.
 * @returns {boolean} True if any farm or business asset declined upload or has no uploaded document.
 */
export const shouldShowDeclinedAlert = ownedAssets =>
  ownedAssets?.some(item => {
    const isFarmOrBusiness =
      item?.assetType === 'FARM' || item?.assetType === 'BUSINESS';
    const declinedUpload = item?.['view:addFormQuestion'] === false;
    const saidYesButEmptyArray =
      item?.['view:addFormQuestion'] === true &&
      (!item?.uploadedDocuments || !item.uploadedDocuments.name);

    return isFarmOrBusiness && (declinedUpload || saidYesButEmptyArray);
  });
