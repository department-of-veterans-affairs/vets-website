/**
 * @module config/submit-transformer
 * @description Transform form data from vets-website format to vets-api format for VA Form 21-4192
 *
 * This transformer maps the frontend form structure to the API schema defined in:
 * vets-api/app/openapi/openapi/requests/form214192.rb
 */

/**
 * Format a date string from YYYY-MM-DD to API format (YYYY-MM-DD)
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string|null} Formatted date string or null if invalid
 */
const formatDate = dateString => {
  if (!dateString || dateString === '') return null;
  // API expects YYYY-MM-DD format which is what we already have
  return dateString;
};

/**
 * Format currency string to number (remove $ and commas)
 * @param {string} currencyString - Currency string like "$1,234.56"
 * @returns {number|null} Numeric value or null if invalid
 */
const formatCurrency = currencyString => {
  if (!currencyString || currencyString === '') return null;
  const numericValue = parseFloat(currencyString.replace(/[$,]/g, '').trim());
  return Number.isNaN(numericValue) ? null : numericValue;
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
 * Convert yes/no string to boolean
 * @param {string} value - 'yes' or 'no' string
 * @returns {boolean|null} Boolean value or null if not set
 */
const yesNoToBoolean = value => {
  if (value === 'yes') return true;
  if (value === 'no') return false;
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

  return {
    fullName: {
      first: veteranInfo.firstName || '',
      middle: veteranInfo.middleName || '',
      last: veteranInfo.lastName || '',
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
  const employerAddress = employerInfo.employerAddress
    ? {
        street: employerInfo.employerAddress.street || '',
        street2: employerInfo.employerAddress.street2 || null,
        city: employerInfo.employerAddress.city || '',
        state: employerInfo.employerAddress.state || '',
        country: employerInfo.employerAddress.country || 'USA',
        postalCode: employerInfo.employerAddress.postalCode || '',
      }
    : null;

  return {
    employerName: employerInfo.employerName || '',
    employerAddress,
    typeOfWorkPerformed: earningsHours.typeOfWork || '',
    beginningDateOfEmployment: formatDate(employmentDates.beginningDate),
    endingDateOfEmployment: employmentDates.currentlyEmployed
      ? null
      : formatDate(employmentDates.endingDate),
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
 * @returns {Object} Transformed duty status for API
 */
const transformMilitaryDutyStatus = data => {
  const dutyStatus = data?.dutyStatus || {};
  const dutyDetails = data?.dutyStatusDetails || {};

  // Only include this section if the veteran is in Reserve/Guard
  if (dutyStatus.reserveOrGuardStatus !== 'yes') {
    return null;
  }

  return {
    currentDutyStatus: dutyDetails.currentDutyStatus || null,
    veteranDisabilitiesPreventMilitaryDuties: yesNoToBoolean(
      dutyDetails.disabilitiesPreventDuties,
    ),
  };
};

/**
 * Transform benefit entitlement and payments section
 * @param {Object} data - Form data object
 * @returns {Object} Transformed benefits information for API
 */
const transformBenefitEntitlementPayments = data => {
  const benefitsInfo = data?.benefitsInformation || {};
  const benefitsDetails = data?.benefitsDetails || {};
  const remarks = data?.remarks || {};

  return {
    sickRetirementOtherBenefits: yesNoToBoolean(
      benefitsInfo.benefitEntitlement,
    ),
    typeOfBenefit:
      benefitsInfo.benefitEntitlement === 'yes'
        ? benefitsDetails.benefitType || null
        : null,
    grossMonthlyAmountOfBenefit:
      benefitsInfo.benefitEntitlement === 'yes'
        ? formatCurrency(benefitsDetails.grossMonthlyAmount)
        : null,
    dateBenefitBegan:
      benefitsInfo.benefitEntitlement === 'yes'
        ? formatDate(benefitsDetails.startReceivingDate)
        : null,
    dateFirstPaymentIssued:
      benefitsInfo.benefitEntitlement === 'yes'
        ? formatDate(benefitsDetails.firstPaymentDate)
        : null,
    dateBenefitWillStop:
      benefitsInfo.benefitEntitlement === 'yes'
        ? formatDate(benefitsDetails.stopReceivingDate)
        : null,
    remarks: remarks.remarks || null,
  };
};

/**
 * Main submit transformer function
 * Transforms form data from frontend structure to API schema
 *
 * @param {Object} formConfig - Form configuration object
 * @param {Object} form - Complete form data from frontend
 * @returns {Object} Transformed data matching API schema
 */
export const transformForSubmit = (formConfig, form) => {
  const { data } = form;

  const transformed = {
    veteranInformation: transformVeteranInformation(data),
    employmentInformation: transformEmploymentInformation(data),
    militaryDutyStatus: transformMilitaryDutyStatus(data),
    benefitEntitlementPayments: transformBenefitEntitlementPayments(data),
    // Employer certification will be handled separately or added by backend
    employerCertification: {
      signature: '', // This would be filled by employer
    },
  };

  // Remove null sections to keep payload clean
  if (transformed.militaryDutyStatus === null) {
    delete transformed.militaryDutyStatus;
  }

  return transformed;
};

export default transformForSubmit;
