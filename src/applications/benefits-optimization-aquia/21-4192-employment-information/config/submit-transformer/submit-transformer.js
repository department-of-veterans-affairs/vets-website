/**
 * @module config/submit-transformer
 * @description Transform form data from vets-website format to vets-api format for VA Form 21-4192
 *
 * This transformer maps the frontend form structure to the API schema defined in:
 * vets-api/app/openapi/openapi/requests/form214192.rb
 */

import countries from 'platform/user/profile/vap-svc/constants/countries.json';

/**
 * Convert country code to 2-letter ISO format (ISO 3166-1 alpha-2)
 * API requires 2-character country codes
 *
 * @param {string} countryCode - Country code (2 or 3 letters, or country name)
 * @returns {string} 2-letter country code (ISO 3166-1 alpha-2)
 */
const formatCountryCode = countryCode => {
  if (!countryCode) return 'US'; // Default to US

  const input = countryCode.toString().trim();

  // Already 2 characters, return as-is
  if (input.length === 2) return input.toUpperCase();

  // 3 characters, look up in platform countries data
  if (input.length === 3) {
    const country = countries.find(
      c => c.countryCodeISO3 === input.toUpperCase(),
    );
    return country?.countryCodeISO2 || 'US';
  }

  // Might be a country name, try to match
  const country = countries.find(
    c => c.countryName?.toLowerCase() === input.toLowerCase(),
  );
  return country?.countryCodeISO2 || 'US';
};

/**
 * Recursively remove null and undefined values from an object
 * Note: Empty strings are preserved for API validation (required fields can be empty strings)
 * @param {*} obj - Object to clean
 * @returns {*} Cleaned object without null/undefined values
 */
const removeNullUndefined = obj => {
  if (obj === null || obj === undefined) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    return obj
      .map(item => removeNullUndefined(item))
      .filter(item => item !== undefined);
  }

  if (typeof obj === 'object') {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
      const value = removeNullUndefined(obj[key]);
      if (value !== undefined) {
        cleaned[key] = value;
      }
    });
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  return obj;
};

/**
 * Format a date string to API format (YYYY-MM-DD with zero-padding)
 * @param {string} dateString - Date in YYYY-MM-DD or YYYY-M-D format
 * @returns {string|null} Formatted date string with zero-padding or null if invalid
 */
const formatDate = dateString => {
  if (!dateString || dateString === '') return null;

  // Split the date string and ensure zero-padding
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;

  const [year, month, day] = parts;

  // Ensure year is 4 digits, month and day are 2 digits with zero-padding
  const paddedYear = year.padStart(4, '0');
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');

  return `${paddedYear}-${paddedMonth}-${paddedDay}`;
};

/**
 * Format currency value to number (handle both string and number inputs)
 * @param {string|number} currencyValue - Currency string like "$1,234.56" or number
 * @returns {number|null} Numeric value or null if invalid
 */
const formatCurrency = currencyValue => {
  if (
    currencyValue === null ||
    currencyValue === undefined ||
    currencyValue === ''
  ) {
    return null;
  }

  // If already a number, return it
  if (typeof currencyValue === 'number') {
    return Number.isNaN(currencyValue) ? null : currencyValue;
  }

  // If string, remove $ and commas then parse
  if (typeof currencyValue === 'string') {
    const numericValue = parseFloat(currencyValue.replace(/[$,]/g, '').trim());
    return Number.isNaN(numericValue) ? null : numericValue;
  }

  return null;
};

/**
 * Format hours to number
 * @param {string|number} hours - Hours value
 * @returns {number|null} Numeric hours or null if invalid
 */
const formatHours = hours => {
  if (!hours || hours === '') return null;
  const numericValue = parseFloat(hours);
  return Number.isNaN(numericValue) ? null : numericValue;
};

/**
 * Convert yes/no string or boolean to boolean
 * @param {string|boolean} value - 'yes'/'no' string or true/false boolean
 * @returns {boolean|null} Boolean value or null if not set
 */
const yesNoToBoolean = value => {
  if (value === 'yes' || value === true) return true;
  if (value === 'no' || value === false) return false;
  return null;
};

/**
 * Transform veteran information section
 * @param {Object} data - Form data object
 * @returns {Object} Transformed veteran information for API
 */
const transformVeteranInformation = data => {
  const veteranInfo = data?.veteranInformation || {};
  const contactInfo = data?.veteranContactInformation || {};
  const fullName = veteranInfo.veteranFullName || {};

  return {
    fullName: {
      first: fullName.first || '',
      middle: fullName.middle || '',
      last: fullName.last || '',
    },
    ssn: contactInfo.ssn?.replace(/-/g, '') || null, // Remove dashes for 9-digit format
    vaFileNumber: contactInfo.vaFileNumber || null,
    dateOfBirth: formatDate(veteranInfo.dateOfBirth),
    // Address is not collected in this form but included in schema for completeness
    address: null,
  };
};

/**
 * Transform employer and employment information section
 * @param {Object} data - Form data object
 * @returns {Object} Transformed employment information for API
 */
const transformEmploymentInformation = data => {
  const employerInfo = data?.employerInformation || {};
  const employmentDates = data?.employmentDates || {};
  const earningsHours = data?.employmentEarningsHours || {};
  const concessions = data?.employmentConcessions || {};
  const termination = data?.employmentTermination || {};
  const lastPayment = data?.employmentLastPayment || {};

  // Transform employer address
  // API requires: street, city, state, postalCode, country (all required)
  // API country code must be 2 characters (e.g., 'US' not 'USA')
  const employerAddress = employerInfo.employerAddress
    ? {
        street: employerInfo.employerAddress.street || '',
        street2: employerInfo.employerAddress.street2 || null,
        city: employerInfo.employerAddress.city || '',
        state: employerInfo.employerAddress.state || '',
        postalCode: employerInfo.employerAddress.postalCode || '',
        // Convert any 3-letter country code to 2-letter ISO format for API compatibility
        country: formatCountryCode(employerInfo.employerAddress.country),
      }
    : null;

  return {
    employerName: employerInfo.employerName || '',
    employerAddress,
    typeOfWorkPerformed: earningsHours.typeOfWork || '',
    beginningDateOfEmployment: formatDate(employmentDates.beginningDate),
    endingDateOfEmployment: formatDate(employmentDates.endingDate),
    amountEarnedLast12MonthsOfEmployment: formatCurrency(
      earningsHours.amountEarned,
    ),
    timeLostLast12MonthsOfEmployment: earningsHours.timeLost || null,
    hoursWorkedDaily: formatHours(earningsHours.dailyHours),
    hoursWorkedWeekly: formatHours(earningsHours.weeklyHours),
    concessions: concessions.concessions || null,
    terminationReason: termination.terminationReason || null,
    dateLastWorked: formatDate(termination.dateLastWorked),
    lastPaymentDate: formatDate(lastPayment.dateOfLastPayment),
    lastPaymentGrossAmount: formatCurrency(lastPayment.grossAmountLastPayment),
    lumpSumPaymentMade: yesNoToBoolean(lastPayment.lumpSumPayment),
    grossAmountPaid:
      lastPayment.lumpSumPayment === 'yes'
        ? formatCurrency(lastPayment.grossAmountPaid)
        : null,
    datePaid:
      lastPayment.lumpSumPayment === 'yes'
        ? formatDate(lastPayment.datePaid)
        : null,
  };
};

/**
 * Transform military duty status section
 * @param {Object} data - Form data object
 * @returns {Object|null} Transformed duty status for API or null if not applicable
 */
const transformMilitaryDutyStatus = data => {
  const dutyStatus = data?.dutyStatus || {};
  const dutyDetails = data?.dutyStatusDetails || {};

  // Check if user answered the Reserve/Guard question
  const { reserveOrGuardStatus } = dutyStatus;

  // If user answered "No" to Reserve/Guard, still send data with false value
  // so backend can fill "NO" in the PDF
  if (reserveOrGuardStatus === 'no' || reserveOrGuardStatus === false) {
    return null;
  }

  // If user answered "Yes" to Reserve/Guard, send details
  if (reserveOrGuardStatus === 'yes' || reserveOrGuardStatus === true) {
    return {
      currentDutyStatus: dutyDetails.currentDutyStatus || null,
      veteranDisabilitiesPreventMilitaryDuties: yesNoToBoolean(
        dutyDetails.disabilitiesPreventDuties,
      ),
    };
  }

  // If question not answered, return null
  return null;
};

/**
 * Transform benefit entitlement and payments section
 * @param {Object} data - Form data object
 * @returns {Object|null} Transformed benefits information for API or null if not applicable
 */
const transformBenefitEntitlementPayments = data => {
  const benefitsInfo = data?.benefitsInformation || {};
  const benefitsDetails = data?.benefitsDetails || {};
  const remarks = data?.remarks || {};

  // Check if user answered the benefit entitlement question
  const { benefitEntitlement } = benefitsInfo;

  // If user answered "No" to benefit entitlement, still send data with false value
  // so backend can fill "NO" in the PDF
  if (benefitEntitlement === 'no' || benefitEntitlement === false) {
    return {
      sickRetirementOtherBenefits: false,
      remarks: remarks.remarks || null,
    };
  }

  // If user answered "Yes" to benefit entitlement, send details
  if (benefitEntitlement === 'yes' || benefitEntitlement === true) {
    return {
      sickRetirementOtherBenefits: true,
      typeOfBenefit: benefitsDetails.benefitType || null,
      grossMonthlyAmountOfBenefit: formatCurrency(
        benefitsDetails.grossMonthlyAmount,
      ),
      dateBenefitBegan: formatDate(benefitsDetails.startReceivingDate),
      dateFirstPaymentIssued: formatDate(benefitsDetails.firstPaymentDate),
      dateBenefitWillStop: formatDate(benefitsDetails.stopReceivingDate),
      remarks: remarks.remarks || null,
    };
  }

  // If question not answered, return null
  return null;
};

/**
 * Main submit transformer function
 * Transforms form data from frontend structure to API schema
 *
 * @param {Object} formConfig - Form configuration object
 * @param {Object} form - Complete form data from frontend
 * @returns {string} JSON stringified transformed data matching API schema
 */
export const transformForSubmit = (formConfig, form) => {
  const { data } = form;

  const transformed = {
    veteranInformation: transformVeteranInformation(data),
    employmentInformation: transformEmploymentInformation(data),
    militaryDutyStatus: transformMilitaryDutyStatus(data),
    benefitEntitlementPayments: transformBenefitEntitlementPayments(data),
  };

  // Remove null sections to keep payload clean
  if (transformed.militaryDutyStatus === null) {
    delete transformed.militaryDutyStatus;
  }

  if (transformed.benefitEntitlementPayments === null) {
    delete transformed.benefitEntitlementPayments;
  }

  transformed.certification = {
    signature: data?.statementOfTruthSignature,
    certified: Boolean(data?.statementOfTruthCertified),
  };

  // Remove all null and undefined values from the payload
  const cleanedPayload = removeNullUndefined(transformed);

  return JSON.stringify(cleanedPayload);
};

export default transformForSubmit;
