import { NETWORTH_VALUE } from './constants';
import { processDependents } from '../utils/processDependents';

/**
 * Prefill transformer for 686C-674 form
 * @param {object} pages - list of all pages processed from the form config
 * @param {object} formData - current form data (after any migrations)
 * @param {object} metadata - prefill metadata
 * @returns {object} - transformed pages, formData, and metadata
 */
export default function prefillTransformer(pages, formData, metadata) {
  const {
    veteranSsnLastFour = '',
    veteranVaFileNumberLastFour = '',
    isInReceiptOfPension = -1,
    netWorthLimit = NETWORTH_VALUE,
    dependents = {},
  } = formData?.nonPrefill || {};
  const contact = formData?.veteranContactInformation || {};
  const address = contact.veteranAddress || {};

  // Check if this is saved in-progress data (has returnUrl) vs fresh prefill data
  // If user has saved their progress, we should preserve their edits to the address
  const isSavedInProgressData = !!metadata?.returnUrl;

  const isMilitary =
    ['APO', 'FPO', 'DPO'].includes((address?.city || '').toUpperCase()) ||
    false;

  const { hasError, awarded, notAwarded } = processDependents({
    dependents,
    isPrefill: true,
  });

  // Build the veteran address - preserve user edits if this is saved data
  let veteranAddress;
  if (isSavedInProgressData && address.country) {
    // This is saved in-progress data with an existing address
    // Preserve the user's edits by keeping the existing address structure
    veteranAddress = {
      isMilitary,
      ...address,
    };
  } else {
    // This is fresh prefill data - transform VA Profile format to form format
    veteranAddress = {
      isMilitary,
      country: address.country || address.countryName || 'USA',
      street: address.street || address.addressLine1 || '',
      street2: address.street2 || address.addressLine2 || '',
      street3: address.street3 || address.addressLine3 || '',
      city: address.city || '',
      state: address.state || address.stateCode || '',
      postalCode: address.postalCode || address.zipCode || '',
    };
  }

  return {
    pages,
    formData: {
      veteranInformation: {
        ...formData?.veteranInformation,
        ssnLastFour: veteranSsnLastFour,
        vaFileLastFour: veteranVaFileNumberLastFour,
        isInReceiptOfPension,
      },
      veteranContactInformation: {
        veteranAddress,
        phoneNumber: contact.phoneNumber || null,
        emailAddress: contact.emailAddress || null,
      },
      dependents: {
        hasError,
        hasDependents: awarded.length > 0,
        awarded,
        notAwarded,
      },
      useV2: true,
      netWorthLimit,
      daysTillExpires: 365,
    },
    metadata,
  };
}
