import { transformForSubmit as transformFormConfigForSubmit } from 'platform/forms-system/src/js/helpers';
import fieldMapping, {
  transformSSN,
  transformDate,
  transformPostalCode,
  transformFullName,
} from './field-mapping';

/* ========================================================================
 * HELPER FUNCTIONS - Reduce cognitive complexity through extraction
 * ======================================================================== */

/**
 * Safely get value with default fallback
 * @param {*} value - Value to check
 * @param {string} fallback - Fallback value
 * @returns {string} Value or fallback
 */
const withDefault = (value, fallback = '') => value || fallback;

/**
 * Transform checkbox value to PDF format
 * @param {boolean} value - Checkbox value
 * @returns {string} PDF checkbox value
 */
const transformCheckbox = value => (value ? '1' : 'Off');

/**
 * Transform radio button value to PDF format
 * @param {boolean} value - Radio button value
 * @returns {string} PDF radio value
 */
const transformRadio = value => (value ? '1' : '0');

/**
 * Format amount with dollar sign
 * @param {number|string} amount - Amount to format
 * @returns {string} Formatted amount
 */
const formatCurrency = amount => (amount ? `$${amount}` : '');

/**
 * Transform full name to PDF fields
 * @param {Object} fullName - Full name object
 * @param {Object} mapping - Field mapping
 * @returns {Object} PDF fields
 */
const transformNameFields = (fullName, mapping) => {
  if (!fullName || !mapping) return {};

  return {
    [mapping.first]: withDefault(fullName.first),
    [mapping.middle]: withDefault(fullName.middle),
    [mapping.last]: withDefault(fullName.last),
  };
};

/**
 * Transform SSN to PDF fields
 * @param {string} ssn - Social Security Number
 * @param {Object} mapping - Field mapping
 * @returns {Object} PDF fields
 */
const transformSsnFields = (ssn, mapping) => {
  if (!ssn || !mapping) return {};

  const ssnParts = transformSSN(ssn);
  return {
    [mapping.first3]: withDefault(ssnParts.first3),
    [mapping.middle2]: withDefault(ssnParts.middle2),
    [mapping.last4]: withDefault(ssnParts.last4),
  };
};

/**
 * Transform date to PDF fields
 * @param {string} date - Date string
 * @param {Object} mapping - Field mapping
 * @returns {Object} PDF fields
 */
const transformDateFields = (date, mapping) => {
  if (!date || !mapping) return {};

  const dateParts = transformDate(date);
  return {
    [mapping.month]: withDefault(dateParts.month),
    [mapping.day]: withDefault(dateParts.day),
    [mapping.year]: withDefault(dateParts.year),
  };
};

/**
 * Transform address to PDF fields
 * @param {Object} address - Address object
 * @param {Object} mapping - Field mapping
 * @returns {Object} PDF fields
 */
const transformAddressFields = (address, mapping) => {
  if (!address || !mapping) return {};

  const postalParts = transformPostalCode(address.postalCode);

  return {
    [mapping.street]: withDefault(address.street),
    [mapping.street2]: withDefault(address.street2),
    [mapping.city]: withDefault(address.city),
    [mapping.state]: withDefault(address.state),
    [mapping.country]: withDefault(address.country),
    [mapping.postalCode.first5]: withDefault(postalParts.first5),
    [mapping.postalCode.last4]: withDefault(postalParts.last4),
  };
};

/**
 * Build address string from parts
 * @param {Object} address - Address object
 * @returns {string} Formatted address
 */
const buildAddressString = address => {
  if (!address) return '';

  return [
    address.street,
    address.street2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(', ');
};

/* ========================================================================
 * SECTION TRANSFORMERS - Each section as a separate function
 * ======================================================================== */

/**
 * Transform veteran information section
 * @param {Object} data - Form data
 * @returns {Object} PDF fields
 */
const transformVeteranSection = data => {
  const fields = {};

  Object.assign(
    fields,
    transformNameFields(data.veteranFullName, fieldMapping.veteranFullName),
    transformSsnFields(data.veteranSsn, fieldMapping.veteranSsn),
  );

  if (data.veteranVaFileNumber) {
    fields[fieldMapping.veteranVaFileNumber] = data.veteranVaFileNumber;
  }

  return fields;
};

/**
 * Transform beneficiary information section
 * @param {Object} data - Form data
 * @returns {Object} PDF fields
 */
const transformBeneficiarySection = data => {
  const fields = {};

  // Only fill if beneficiary is different from veteran
  if (!data.beneficiaryIsVeteran) {
    Object.assign(
      fields,
      transformNameFields(
        data.beneficiaryFullName,
        fieldMapping.beneficiaryFullName,
      ),
    );
  }

  Object.assign(
    fields,
    transformDateFields(
      data.beneficiaryDateOfDeath,
      fieldMapping.beneficiaryDateOfDeath,
    ),
  );

  return fields;
};

/**
 * Transform claimant information section
 * @param {Object} data - Form data
 * @returns {Object} PDF fields
 */
const transformClaimantSection = data => {
  const fields = {};
  const relationshipMap = {
    spouse: 'Spouse',
    child: 'Child',
    parent: 'Parent',
    executor: 'Executor/Administrator',
    creditor: 'Creditor',
  };

  Object.assign(
    fields,
    transformNameFields(data.claimantFullName, fieldMapping.claimantFullName),
    transformSsnFields(data.claimantSsn, fieldMapping.claimantSsn),
    transformDateFields(
      data.claimantDateOfBirth,
      fieldMapping.claimantDateOfBirth,
    ),
    transformAddressFields(data.claimantAddress, fieldMapping.claimantAddress),
  );

  fields[fieldMapping.claimantPhone] = withDefault(data.claimantPhone);
  fields[fieldMapping.claimantEmail] = withDefault(data.claimantEmail);
  fields[fieldMapping.relationshipToDeceased] = withDefault(
    relationshipMap[data.relationshipToDeceased] || data.relationshipToDeceased,
  );

  return fields;
};

/**
 * Transform surviving relatives checkboxes
 * @param {Object} data - Form data
 * @returns {Object} PDF fields
 */
const transformSurvivingRelativesCheckboxes = data => ({
  [fieldMapping.hasSpouse]: transformCheckbox(data.hasSpouse),
  [fieldMapping.hasChildren]: transformCheckbox(data.hasChildren),
  [fieldMapping.hasParents]: transformCheckbox(data.hasParents),
  [fieldMapping.hasNone]: transformCheckbox(data.hasNone),
});

/**
 * Transform a single surviving relative
 * @param {Object} relative - Relative data
 * @param {Object} mapping - Field mapping
 * @returns {Object} PDF fields
 */
const transformSingleRelative = (relative, mapping) => {
  if (!relative || !mapping) return {};

  return {
    [mapping.fullName]: transformFullName(relative.fullName),
    [mapping.relationship]: withDefault(relative.relationship),
    [mapping.dateOfBirth]: withDefault(relative.dateOfBirth),
    [mapping.address]: buildAddressString(relative.address),
  };
};

/**
 * Transform surviving relatives list
 * @param {Array} relatives - Relatives array
 * @returns {Object} PDF fields
 */
const transformSurvivingRelativesList = relatives => {
  const fields = {};

  if (!relatives || !relatives.length) return fields;

  relatives.slice(0, 4).forEach((relative, index) => {
    const mapping = fieldMapping.survivingRelatives[index];
    Object.assign(fields, transformSingleRelative(relative, mapping));
  });

  return fields;
};

/**
 * Transform a single expense
 * @param {Object} expense - Expense data
 * @param {Object} mapping - Field mapping
 * @returns {Object} PDF fields
 */
const transformSingleExpense = (expense, mapping) => {
  if (!expense || !mapping) return {};

  return {
    [mapping.creditorName]: withDefault(expense.creditorName),
    [mapping.expenseType]: withDefault(expense.expenseType),
    [mapping.amount]: formatCurrency(expense.amount),
    [mapping.isPaid]: expense.isPaid ? '0' : '1', // 0 = Yes paid, 1 = No unpaid
    [mapping.paidBy]: withDefault(expense.paidBy),
  };
};

/**
 * Transform expenses section
 * @param {Object} data - Form data
 * @returns {Object} PDF fields
 */
const transformExpensesSection = data => {
  const fields = {};

  if (data.lastIllnessExpenses && data.lastIllnessExpenses.length > 0) {
    data.lastIllnessExpenses.slice(0, 4).forEach((expense, index) => {
      const mapping = fieldMapping.lastIllnessExpenses[index];
      Object.assign(fields, transformSingleExpense(expense, mapping));
    });
  }

  if (data.reimbursementAmount) {
    fields[fieldMapping.reimbursementAmount] = data.reimbursementAmount;
  }

  if (data.isEstateBeingAdministered !== undefined) {
    fields[fieldMapping.isEstateBeingAdministered] = transformRadio(
      data.isEstateBeingAdministered,
    );
  }

  return fields;
};

/**
 * Transform a single debt
 * @param {Object} debt - Debt data
 * @param {Object} mapping - Field mapping
 * @returns {Object} PDF fields
 */
const transformSingleDebt = (debt, mapping) => {
  if (!debt || !mapping) return {};

  return {
    [mapping.nature]: withDefault(debt.nature),
    [mapping.amount]: formatCurrency(debt.amount),
  };
};

/**
 * Transform debts section
 * @param {Object} data - Form data
 * @returns {Object} PDF fields
 */
const transformDebtsSection = data => {
  const fields = {};

  if (!data.otherDebts || !data.otherDebts.length) return fields;

  data.otherDebts.slice(0, 4).forEach((debt, index) => {
    const mapping = fieldMapping.otherDebts[index];
    Object.assign(fields, transformSingleDebt(debt, mapping));
  });

  return fields;
};

/**
 * Transform miscellaneous fields
 * @param {Object} data - Form data
 * @returns {Object} PDF fields
 */
const transformMiscSection = data => {
  const fields = {};
  const today = new Date();

  // Substitution waiver
  if (data.wantsToWaiveSubstitution !== undefined) {
    fields[fieldMapping.substitutionWaiver] = transformRadio(
      data.wantsToWaiveSubstitution,
    );
  }

  // Date signed
  fields[fieldMapping.dateSigned] = `${(today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${today
    .getDate()
    .toString()
    .padStart(2, '0')}/${today.getFullYear()}`;

  // Remarks
  if (data.remarks) {
    fields[fieldMapping.remarks] = data.remarks;
  }

  return fields;
};

/* ========================================================================
 * MAIN TRANSFORM FUNCTION
 * ======================================================================== */

/**
 * Transform form data to match backend PDF field structure
 */
const transformForSubmit = (formConfig, form) => {
  const transformedData = transformFormConfigForSubmit(formConfig, form);
  const { data } = transformedData;

  // Transform each section
  const pdfData = {
    ...transformVeteranSection(data),
    ...transformBeneficiarySection(data),
    ...transformClaimantSection(data),
    ...transformSurvivingRelativesCheckboxes(data),
    ...transformSurvivingRelativesList(data.survivingRelatives),
    ...transformExpensesSection(data),
    ...transformDebtsSection(data),
    ...transformMiscSection(data),
  };

  // Return transformed data with PDF fields
  return {
    ...transformedData,
    formData: {
      ...data,
      pdfFields: pdfData,
    },
  };
};

export default transformForSubmit;
