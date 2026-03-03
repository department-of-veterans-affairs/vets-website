/**
 * @fileoverview Submit transformer for VA Form 21-2680 Examination for House-bound Status
 * @module config/submit-transformer
 */

import { filterViewFields } from 'platform/forms-system/src/js/helpers';

/**
 * Removes dashes and spaces from a string (used for SSN and phone formatting)
 * @param {string} value - The value to clean
 * @returns {string} Cleaned value with only digits
 */
function cleanNumericString(value) {
  if (!value) return '';
  return value.replace(/[^0-9]/g, '');
}

/**
 * Maps frontend relationship value to backend enum
 * Frontend: veteran, spouse, parent, child
 * Backend: self, spouse, parent, child
 * @param {string} relationship - Frontend relationship value
 * @returns {string} Backend relationship value
 */
function mapRelationship(relationship) {
  if (relationship === 'veteran') return 'self';
  return relationship || 'self';
}

/**
 * Maps frontend benefit type to backend benefitSelection enum
 * Frontend: SMC, SMP (uppercase)
 * Backend: smc, smp (lowercase)
 * @param {string} benefitType - Frontend benefit type value
 * @returns {string} Backend benefitSelection value (lowercase)
 */
function mapBenefitType(benefitType) {
  if (!benefitType) return 'smc';
  return benefitType.toLowerCase();
}

/**
 * Builds veteranInformation section for backend submission
 * @param {Object} cleanedData - Cleaned form data
 * @returns {Object} Veteran information object
 */
function buildVeteranInformation(cleanedData) {
  const veteranInfo = cleanedData.veteranInformation || {};
  const veteranSsn = cleanNumericString(veteranInfo.veteranSsn);
  const veteranVaFileNumber = cleanNumericString(
    veteranInfo.veteranVaFileNumber,
  );

  const veteranInformation = {
    fullName: {
      first: veteranInfo.veteranFullName?.first || '',
      middle: veteranInfo.veteranFullName?.middle || '',
      last: veteranInfo.veteranFullName?.last || '',
    },
    ssn: veteranSsn,
    dateOfBirth: veteranInfo.veteranDob || '',
  };

  // Only include vaFileNumber if it's not empty
  if (veteranVaFileNumber) {
    veteranInformation.vaFileNumber = veteranVaFileNumber;
  }

  return veteranInformation;
}

/**
 * Builds address object from form data
 * @param {Object} addressData - Address data from form
 * @returns {Object} Formatted address object
 */
function buildAddress(addressData) {
  return {
    street: addressData?.street || '',
    street2: addressData?.street2 || '',
    city: addressData?.city || '',
    state: addressData?.state || '',
    postalCode: addressData?.postalCode || '',
    country: addressData?.country || 'US',
  };
}

/**
 * Builds claimantInformation section for backend submission
 * @param {Object} cleanedData - Cleaned form data
 * @param {Object} veteranInformation - Built veteran information
 * @returns {Object} Claimant information object
 */
function buildClaimantInformation(cleanedData, veteranInformation) {
  const isVeteranClaimant =
    cleanedData.claimantRelationship?.relationship === 'veteran';

  const claimantInfo = cleanedData.claimantInformation || {};
  const claimantSsnData = cleanedData.claimantSsn || {};
  const claimantAddr = cleanedData.claimantAddress || {};
  const claimantContactData = cleanedData.claimantContact || {};
  const veteranAddr = cleanedData.veteranAddress || {};

  // Clean and validate SSN and phone
  const claimantSsn = isVeteranClaimant
    ? veteranInformation.ssn
    : cleanNumericString(claimantSsnData.claimantSsn);
  let claimantPhone = cleanNumericString(
    claimantContactData.claimantPhoneNumber?.contact,
  );
  const countryCode =
    claimantContactData.claimantPhoneNumber?.countryCode || 'US';
  if (claimantPhone && countryCode !== 'US') {
    // combine calling code with contact number for international numbers
    const callingCode =
      claimantContactData.claimantPhoneNumber?.callingCode || '';
    claimantPhone = `+${callingCode}${claimantPhone}`;
  }

  // Build base claimant information
  const claimantInformation = {
    fullName: isVeteranClaimant
      ? veteranInformation.fullName
      : {
          first: claimantInfo.claimantFullName?.first || '',
          middle: claimantInfo.claimantFullName?.middle || '',
          last: claimantInfo.claimantFullName?.last || '',
        },
    relationship: mapRelationship(
      cleanedData.claimantRelationship?.relationship,
    ),
    address: isVeteranClaimant
      ? buildAddress(veteranAddr.veteranAddress)
      : buildAddress(claimantAddr.claimantAddress),
  };

  // Add optional fields if they meet validation requirements
  if (claimantSsn && claimantSsn.length === 9) {
    claimantInformation.ssn = claimantSsn;
  }

  const claimantDob = isVeteranClaimant
    ? veteranInformation.dateOfBirth
    : claimantInfo.claimantDob || '';
  if (claimantDob) {
    claimantInformation.dateOfBirth = claimantDob;
  }

  if (claimantPhone && countryCode === 'US' && claimantPhone.length === 10) {
    claimantInformation.phoneNumber = claimantPhone;
  } else if (claimantPhone && countryCode !== 'US') {
    claimantInformation.internationalPhoneNumber = claimantPhone;
  }

  const email = claimantContactData.claimantEmail || '';
  if (email) {
    claimantInformation.email = email;
  }

  return claimantInformation;
}

/**
 * Builds benefitInformation section for backend submission
 * @param {Object} cleanedData - Cleaned form data
 * @returns {Object} Benefit information object
 */
function buildBenefitInformation(cleanedData) {
  return {
    benefitSelection: mapBenefitType(cleanedData.benefitType?.benefitType),
  };
}

/**
 * Builds additionalInformation section for backend submission
 * @param {Object} cleanedData - Cleaned form data
 * @returns {Object} Additional information object
 */
function buildAdditionalInformation(cleanedData) {
  const hospitalizationStatusData = cleanedData.hospitalizationStatus || {};
  const hospitalizationDateData = cleanedData.hospitalizationDate || {};
  const hospitalizationFacilityData = cleanedData.hospitalizationFacility || {};

  const isCurrentlyHospitalized =
    hospitalizationStatusData.isCurrentlyHospitalized === true;

  const additionalInformation = {
    currentlyHospitalized: isCurrentlyHospitalized,
  };

  // Only include hospitalization details if currently hospitalized
  if (isCurrentlyHospitalized) {
    additionalInformation.admissionDate =
      hospitalizationDateData.admissionDate || '';
    additionalInformation.hospitalName =
      hospitalizationFacilityData.facilityName || '';
    additionalInformation.hospitalAddress = buildAddress(
      hospitalizationFacilityData.facilityAddress,
    );
  }

  return additionalInformation;
}

/**
 * Builds veteranSignature section for backend submission
 * @param {Object} cleanedData - Cleaned form data
 * @returns {Object} Veteran signature object
 */
function buildVeteranSignature(cleanedData) {
  const signatureData = cleanedData.statementOfTruthSignature || '';
  return {
    signature: signatureData,
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  };
}

/**
 * Transforms form data from frontend structure to backend schema
 *
 * Frontend uses flat structure with separate page objects:
 * - veteranInformation, veteranSsn, veteranAddress
 * - claimantRelationship, claimantInformation, claimantSsn, claimantAddress, claimantContact
 * - benefitType
 * - hospitalizationStatus, hospitalizationDate, hospitalizationFacility
 *
 * Backend expects nested structure:
 * - veteranInformation: { fullName, ssn, vaFileNumber, dateOfBirth }
 * - claimantInformation: { fullName, dateOfBirth, ssn, relationship, address, phoneNumber, email }
 * - benefitInformation: { benefitSelection }
 * - additionalInformation: { currentlyHospitalized, admissionDate, hospitalName, hospitalAddress }
 * - veteranSignature: { signature, date }
 *
 * @param {Object} _formConfig - The form configuration object (unused)
 * @param {Object} form - The form state object from Redux
 * @returns {string} JSON string of the transformed form data wrapped in { form: {...} }
 */
export function submitTransformer(_formConfig, form) {
  // Extract the actual form data from the form state object
  // The platform passes { data: {...}, formId: ..., submission: ... }
  // We need just the data portion
  const formData = form?.data || form;
  const cleanedData = filterViewFields(formData);

  // Build each section using helper functions
  const veteranInformation = buildVeteranInformation(cleanedData);
  const claimantInformation = buildClaimantInformation(
    cleanedData,
    veteranInformation,
  );
  const benefitInformation = buildBenefitInformation(cleanedData);
  const additionalInformation = buildAdditionalInformation(cleanedData);
  const veteranSignature = buildVeteranSignature(cleanedData);

  // Assemble final backend-compliant structure
  const backendData = {
    veteranInformation,
    claimantInformation,
    benefitInformation,
    additionalInformation,
    veteranSignature,
  };
  // Return the data as a JSON string wrapped in an object with a 'form' key
  // The backend expects the entire payload to be a stringified JSON object,
  // we do this because we don't want the form data modified by the inflection header
  return JSON.stringify({ form: JSON.stringify(backendData) });
}
