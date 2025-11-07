/**
 * @fileoverview Submit transformer for VA Form 21-2680 Examination for House-bound Status
 * @module config/submit-transformer
 *
 * This module transforms form data before submission to the Simple Forms API.
 *
 * Key transformations:
 * 1. Maps nested frontend structure to flat Simple Forms API structure
 * 2. Converts field names from camelCase to snake_case
 * 3. Formats dates to YYYY-MM-DD format
 * 4. Formats SSN to 9-digit format (removes dashes)
 * 5. When claimant is veteran, copies veteran information to claimant fields
 * 6. When not hospitalized, removes stale hospitalization details
 * 7. Builds metadata object required by Lighthouse Benefits Intake API
 */

/**
 * Helper function to format SSN by removing dashes
 * @param {string} ssn - SSN with or without dashes
 * @returns {string} 9-digit SSN without dashes
 */
function formatSSN(ssn) {
  if (!ssn) return '';
  return ssn.replace(/-/g, '');
}

/**
 * Helper function to ensure date is in YYYY-MM-DD format
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Date in YYYY-MM-DD format
 */
function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') {
    // Already a string, ensure it's in correct format
    return date.split('T')[0]; // Remove time portion if present
  }
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return '';
}

/**
 * Transforms form data before submission to Simple Forms API
 *
 * This transformer maps the nested frontend data structure to the flat
 * structure expected by the Simple Forms API endpoint.
 *
 * @param {Object} formConfig - The form configuration object
 * @param {Object} formData - The form data collected from the user
 * @returns {Object} The transformed form data ready for Simple Forms API submission
 *
 * @example
 * const transformed = submitTransformer(formConfig, {
 *   veteranIdentification: {
 *     veteranFullName: { first: 'John', middle: 'M', last: 'Doe' },
 *     veteranDOB: '1980-01-01',
 *     veteranSSN: '123-45-6789'
 *   },
 *   veteranAddress: {
 *     veteranAddress: { street: '123 Main St', city: 'Springfield', ... }
 *   },
 *   claimantRelationship: { claimantRelationship: 'veteran' },
 *   benefitType: { benefitType: 'SMC' },
 *   hospitalizationStatus: { isCurrentlyHospitalized: 'no' }
 * });
 * // Returns flat structure for Simple Forms API
 */
export function submitTransformer(_formConfig, formData) {
  const transformedData = { ...formData };

  // Clean up duplicate/unnecessary data before submission
  // Remove the 'veteran' object added by platform (duplicates veteranIdentification)
  delete transformedData.veteran;

  // Extract veteran information from nested structure
  const veteranName =
    transformedData.veteranIdentification?.veteranFullName || {};
  const veteranDOB = transformedData.veteranIdentification?.veteranDOB || '';
  const veteranSSN = transformedData.veteranIdentification?.veteranSSN || '';
  const veteranAddr = transformedData.veteranAddress?.veteranAddress || {};

  // Extract claimant relationship
  const claimantRel =
    transformedData.claimantRelationship?.claimantRelationship || '';
  const isVeteranClaimant = claimantRel === 'veteran';

  // If the veteran is the claimant, copy veteran information to claimant fields
  // This ensures the backend receives complete claimant data even though
  // the user didn't fill out separate claimant pages
  if (isVeteranClaimant) {
    transformedData.claimantInformation = {
      claimantFullName: {
        first: veteranName.first || '',
        middle: veteranName.middle || '',
        last: veteranName.last || '',
        suffix: veteranName.suffix || '',
      },
      claimantDOB: veteranDOB,
    };

    transformedData.claimantSSN = {
      claimantSSN: veteranSSN,
    };

    transformedData.claimantAddress = {
      claimantAddress: {
        street: veteranAddr.street || '',
        street2: veteranAddr.street2 || '',
        street3: veteranAddr.street3 || '',
        city: veteranAddr.city || '',
        state: veteranAddr.state || '',
        postalCode: veteranAddr.postalCode || '',
        country: veteranAddr.country || 'USA',
        isMilitary: veteranAddr.isMilitary || false,
      },
    };
  }

  // Extract claimant information (either from claimant pages or copied from veteran)
  const claimantName =
    transformedData.claimantInformation?.claimantFullName || {};
  const claimantDOB = transformedData.claimantInformation?.claimantDOB || '';
  const claimantSSN = transformedData.claimantSSN?.claimantSSN || '';
  const claimantAddr = transformedData.claimantAddress?.claimantAddress || {};
  const claimantContact = transformedData.claimantContact || {};

  // Extract benefit type
  const benefitType = transformedData.benefitType?.benefitType || '';

  // Extract hospitalization information
  const isCurrentlyHospitalized =
    transformedData.hospitalizationStatus?.isCurrentlyHospitalized === 'yes';

  // If not currently hospitalized, remove any stale hospitalization details
  if (!isCurrentlyHospitalized) {
    delete transformedData.hospitalizationDate;
    delete transformedData.hospitalizationFacility;
  }

  const admissionDate =
    transformedData.hospitalizationDate?.admissionDate || '';
  const facilityName =
    transformedData.hospitalizationFacility?.facilityName || '';
  const facilityAddr =
    transformedData.hospitalizationFacility?.facilityAddress || {};

  // Build the Simple Forms API payload structure
  // Note: API requires snake_case field names (external contract)
  /* eslint-disable camelcase */
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const apiPayload = {
    // Form identification
    form_number: '21-2680',
    form_name:
      'Examination for Housebound Status or Permanent Need for Regular Aid and Attendance',

    // Veteran information (required for metadata)
    veteran_full_name: {
      first: veteranName.first || '',
      middle: veteranName.middle || '',
      last: veteranName.last || '',
      suffix: veteranName.suffix || '',
    },

    // Veteran ID (SSN formatted without dashes)
    veteran_id: {
      ssn: formatSSN(veteranSSN),
    },

    // Veteran date of birth
    veteran_date_of_birth: formatDate(veteranDOB),

    // Veteran mailing address
    veteran_mailing_address: {
      country: veteranAddr.country || 'USA',
      street: veteranAddr.street || '',
      street2: veteranAddr.street2 || '',
      street3: veteranAddr.street3 || '',
      city: veteranAddr.city || '',
      state: veteranAddr.state || '',
      postal_code: veteranAddr.postalCode || '',
      is_military: veteranAddr.isMilitary || false,
    },

    // Claimant relationship
    claimant_relationship: claimantRel,

    // Claimant information (if different from veteran)
    claimant_full_name: {
      first: claimantName.first || '',
      middle: claimantName.middle || '',
      last: claimantName.last || '',
      suffix: claimantName.suffix || '',
    },

    // Claimant ID (SSN formatted without dashes)
    claimant_ssn: formatSSN(claimantSSN),

    // Claimant date of birth
    claimant_date_of_birth: formatDate(claimantDOB),

    // Claimant mailing address
    claimant_mailing_address: {
      country: claimantAddr.country || 'USA',
      street: claimantAddr.street || '',
      street2: claimantAddr.street2 || '',
      street3: claimantAddr.street3 || '',
      city: claimantAddr.city || '',
      state: claimantAddr.state || '',
      postal_code: claimantAddr.postalCode || '',
      is_military: claimantAddr.isMilitary || false,
    },

    // Contact information (required for confirmation email)
    phone_number: claimantContact.claimantPhoneNumber || '',
    mobile_phone_number: claimantContact.claimantMobilePhone || '',
    email: claimantContact.claimantEmail || '',

    // Benefit type (SMC or SMP)
    benefit_type: benefitType,

    // Hospitalization status
    currently_hospitalized: isCurrentlyHospitalized,

    // Hospitalization details (only if currently hospitalized)
    ...(isCurrentlyHospitalized && {
      hospitalization_admission_date: formatDate(admissionDate),
      hospitalization_facility_name: facilityName,
      hospitalization_facility_address: {
        country: facilityAddr.country || 'USA',
        street: facilityAddr.street || '',
        street2: facilityAddr.street2 || '',
        street3: facilityAddr.street3 || '',
        city: facilityAddr.city || '',
        state: facilityAddr.state || '',
        postal_code: facilityAddr.postalCode || '',
        is_military: facilityAddr.isMilitary || false,
      },
    }),

    // Statement of truth (required by Simple Forms API)
    statement_of_truth_signature: `${claimantName.first ||
      ''} ${claimantName.last || ''}`.trim(),
    statement_of_truth_certified: true,
  };
  /* eslint-enable camelcase */

  return apiPayload;
}
