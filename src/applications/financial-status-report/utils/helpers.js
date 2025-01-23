import { parse, addDays, format, isAfter, isFuture, isValid } from 'date-fns';
import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import { formatDateLong } from 'platform/utilities/date';
import { deductionCodes } from '../constants/deduction-codes';
import { ignoreFields } from '../constants/ignoreFields';

export const fsrWizardFeatureToggle = state => {
  return toggleValues(state)[
    FEATURE_FLAG_NAMES.showFinancialStatusReportWizard
  ];
};

export const fsrFeatureToggle = state => {
  return toggleValues(state)[FEATURE_FLAG_NAMES.showFinancialStatusReport];
};

export const reviewPageNavigationFeatureToggle = state => {
  return toggleValues(state)[
    FEATURE_FLAG_NAMES.financialStatusReportReviewPageNavigation
  ];
};

export const fsrConfirmationEmailToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.fsrConfirmationEmail];

export const allEqual = arr => arr.every(val => val === arr[0]);

export const isNumber = value => {
  const pattern = /^\d*$/; // This pattern ensures only whole numbers
  return pattern.test(value);
};

/**
 * Helper function to format date strings with only month and year
 *
 * @param {string} dateString - e.g. '2021-01-XX' or '2021-01'
 * @returns {string} e.g. '01/2021'
 */
export const monthYearFormatter = dateString => {
  if (!dateString) return '';

  // Replace any '-XX' legacy markers with '-01'
  const safeDate = dateString.replace(/-XX$/, '-01');

  // If it’s only "YYYY-MM" (length 7), parse it as year-month
  let parsedDate;
  if (safeDate.length === 7) {
    parsedDate = parse(safeDate, 'yyyy-MM', new Date());
  } else {
    // Otherwise assume "YYYY-MM-dd"
    parsedDate = parse(safeDate, 'yyyy-MM-dd', new Date());
  }

  // If parsed successfully, format as "MM/yyyy"
  return isValid(parsedDate) ? format(parsedDate, 'MM/yyyy') : '';
};

export const endDate = (date, days) => {
  if (!date) return '';
  const parsed = new Date(date);
  return isValid(parsed) ? formatDateLong(addDays(parsed, days)) : '';
};

export const currency = amount => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  const value =
    typeof amount === 'number'
      ? amount
      : parseFloat(amount?.replaceAll(/[^0-9.-]/g, '') ?? 0);
  return formatter.format(value);
};

const hasProperty = (arr, key) => {
  return arr.filter(item => item[key]).length > 0 ?? false;
};

export const sumValues = (arr, key) => {
  const isArrValid = Array.isArray(arr) && arr.length && hasProperty(arr, key);
  if (!isArrValid) return 0;
  return arr.reduce(
    (acc, item) =>
      acc + (item[key] ? Number(item[key]?.replaceAll(/[^0-9.-]/g, '')) : 0),
    0,
  );
};

export const filterReduceByName = (deductions, filters) => {
  if (!deductions?.length) return 0;
  return deductions
    .filter(({ name = '' }) => filters.includes(name))
    .reduce(
      (acc, curr) =>
        acc + Number(curr.amount?.replaceAll(/[^0-9.-]/g, '') ?? 0),
      0,
    );
};

export const otherDeductionsName = (deductions, filters) => {
  if (!deductions.length) return '';
  return deductions
    .filter(({ name = '' }) => !filters.includes(name))
    .map(({ name }) => name)
    .join(', ');
};

export const otherDeductionsAmt = (deductions, filters) => {
  if (!deductions.length) return 0;
  return deductions
    .filter(({ name = '' }) => name && !filters.includes(name))
    .reduce(
      (acc, curr) =>
        acc + Number(curr.amount?.replaceAll(/[^0-9.-]/g, '') ?? 0),
      0,
    );
};

export const nameStr = (socialSecurity, compensation, education, addlInc) => {
  const benefitTypes = [];
  if (socialSecurity) {
    benefitTypes.push('Social Security');
  }
  if (compensation) {
    benefitTypes.push('Disability Compensation');
  }
  if (education) {
    benefitTypes.push('Education');
  }
  const vetAddlNames = addlInc?.map(({ name }) => name) ?? [];
  const otherIncNames = [...benefitTypes, ...vetAddlNames];

  return otherIncNames?.map(item => item).join(', ') ?? '';
};

// safeNumber will return 0 if input is null, undefined, or NaN
export const safeNumber = input => {
  if (!input) return 0;
  const num = Number(input.replaceAll(/[^0-9.-]/g, ''));
  return Number.isNaN(num) ? 0 : num;
};

export const fsrReasonDisplay = resolutionOption => {
  switch (resolutionOption) {
    case 'monthly':
      return 'Extended monthly payments';
    case 'waiver':
      return 'Waiver';
    case 'compromise':
      return 'Compromise';
    default:
      return '';
  }
};

export const getFsrReason = debts => {
  const reasons = debts.map(({ resolutionOption }) =>
    fsrReasonDisplay(resolutionOption),
  );
  const uniqReasons = [...new Set(reasons)];

  return uniqReasons.join(', ');
};

export const getAmountCanBePaidTowardDebt = debts => {
  return debts
    .filter(item => item.resolutionComment !== undefined)
    .reduce(
      (acc, debt) =>
        acc + Number(debt.resolutionComment?.replaceAll(/[^0-9.-]/g, '') ?? 0),
      0,
    );
};

export const mergeAdditionalComments = (additionalComments, expenses) => {
  const individualExpenses = expenses
    ?.map(expense => `${expense.name} (${currency(expense.amount)})`)
    .join(', ');

  const individualExpensesStr = `Individual expense amount: ${individualExpenses}`;

  return individualExpenses
    ? `${
        additionalComments !== undefined ? additionalComments : ''
      }\n${individualExpensesStr}`
    : additionalComments;
};

export const getTotalAssets = ({ assets, questions }) => {
  const totOtherAssets = sumValues(assets.otherAssets, 'amount');
  const totRecVehicles = Number(
    assets?.recVehicleAmount?.replaceAll(/[^0-9.-]/g, '') ?? 0,
  );
  const totVehicles = questions?.hasVehicle
    ? sumValues(assets.automobiles, 'resaleValue')
    : 0;
  const realEstate = Number(
    assets.realEstateValue?.replaceAll(/[^0-9.-]/g, '') ?? 0,
  );

  const totAssets = sumValues(assets.monetaryAssets, 'amount');

  return totVehicles + totRecVehicles + totOtherAssets + realEstate + totAssets;
};

export const getEmploymentHistory = ({ questions, personalData }) => {
  const { employmentHistory } = personalData;
  let history = [];

  const defaultObj = {
    veteranOrSpouse: '',
    occupationName: '',
    from: '',
    to: '',
    present: false,
    employerName: '',
    employerAddress: {
      addresslineOne: '',
      addresslineTwo: '',
      addresslineThree: '',
      city: '',
      stateOrProvince: '',
      zipOrPostalCode: '',
      countryName: '',
    },
  };

  if (questions.vetIsEmployed) {
    const { employmentRecords } = employmentHistory.veteran;
    const vetEmploymentHistory = employmentRecords.map(employment => ({
      ...defaultObj,
      veteranOrSpouse: 'VETERAN',
      occupationName: employment.type,
      from: monthYearFormatter(employment.from),
      to: employment.isCurrent ? '' : monthYearFormatter(employment.to),
      present: employment.isCurrent ? employment.isCurrent : false,
      employerName: employment.employerName,
    }));
    history = [...history, ...vetEmploymentHistory];
  }

  if (questions.spouseIsEmployed) {
    const { spEmploymentRecords } = employmentHistory.spouse;
    const spouseEmploymentHistory = spEmploymentRecords.map(employment => ({
      ...defaultObj,
      veteranOrSpouse: 'SPOUSE',
      occupationName: employment.type,
      from: monthYearFormatter(employment.from),
      to: employment.isCurrent ? '' : monthYearFormatter(employment.to),
      present: employment.isCurrent ? employment.isCurrent : false,
      employerName: employment.employerName,
    }));
    history = [...history, ...spouseEmploymentHistory];
  }

  return history;
};

export const sortStatementsByDate = statements => {
  return statements.sort(
    (a, b) =>
      new Date(b.pSStatementDateOutput) - new Date(a.pSStatementDateOutput),
  );
};

// Returns name of debt depending on the type
export const getDebtName = debt => {
  return debt.debtType === 'COPAY'
    ? debt.station.facilityName
    : deductionCodes[debt.deductionCode] || debt.benefitType;
};

/**
 * Helper function to determine if date value is valid starting date:
 * - date is in the past or today
 * - date is not in the future
 *
 * @param {string} date - date string in ISO format ('YYYY-MM' or 'YYYY-MM-DD')
 * @returns {boolean} true if date meets requirements above
 */
export const isValidStartDate = date => {
  if (!date) return false;

  // Ensure the date is in a valid format (either YYYY-MM-DD or YYYY-MM)
  const isProperFormat = date.length === 10 || date.length === 7;
  if (!isProperFormat) return false;

  // If only "YYYY-MM" is provided, append "-01" to make it complete
  const safeDate = date.length === 7 ? `${date}-01` : date;

  // Parse the date and check its validity
  const parsedDate = new Date(safeDate.replace(/-/g, '/'));

  const year = parsedDate.getFullYear();
  if (year < 1900) return false;

  // Check that it's a real date, and not in the future
  return isValid(parsedDate) && !isFuture(parsedDate);
};

/**
 * Helper function to determine if date value is valid ending date:
 * - ending date is not in the future
 * - ending date is after start date
 *
 * @param {string} startDate - date string in ISO format ('YYYY-MM' or 'YYYY-MM-DD')
 * @param {string} endingDate - date string in ISO format ('YYYY-MM' or 'YYYY-MM-DD')
 * @returns {boolean} true if date meets requirements above
 */

export const isValidEndDate = (startDate, endingDate) => {
  if (!startDate || !endingDate) return false;

  // Ensure both dates are in a valid format
  const isProperStartFormat = startDate.length === 10 || startDate.length === 7;
  const isProperEndFormat = endingDate.length === 10 || endingDate.length === 7;

  if (!isProperStartFormat || !isProperEndFormat) return false;

  // Append "-01" to incomplete dates this applies to months and days
  const safeStart = startDate.length === 7 ? `${startDate}-01` : startDate;
  const safeEnd = endingDate.length === 7 ? `${endingDate}-01` : endingDate;

  // Parse the dates
  const parsedStart = new Date(safeStart.replace(/-/g, '/'));
  const parsedEnd = new Date(safeEnd.replace(/-/g, '/'));

  if (!isValid(parsedEnd) || !isValid(parsedStart)) return false;

  const year = parsedEnd.getFullYear();
  if (year < 1900) return false;

  // Ensure the end date is not in the future and is after the start date
  return !isFuture(parsedEnd) && isAfter(parsedEnd, parsedStart);
};

/**
 * Generates a unique key based on the given data fields and an optional index.
 */
export const generateUniqueKey = (data, fields, index = null) => {
  if (data === null || !fields.length) {
    return `default-key-${index}`;
  }
  const keyParts = fields.map(field => data[field] ?? 'undefined');
  if (index !== null) {
    keyParts.push(index);
  }
  return keyParts.join('-');
};

export const firstLetterLowerCase = str => {
  if (!str || str.length === 0) return '';
  // Check if the string is in the ignoreFields array
  if (ignoreFields.includes(str)) {
    return str;
  }
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const setDocumentTitle = title => {
  document.title = `${title} | FSR (VA Form 5655) | Veterans Affairs`;
};
