import { addDays, format, isAfter, isFuture, isValid } from 'date-fns';
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
 * @param {string} date - date string in ISO-ish; example: '2021-01-XX'
 * @returns formatted date string 'MM/yyyy'; example: 01/2021
 *
 */
export const monthYearFormatter = date => {
  // Slicing off '-XX' from date string
  // replacing - with / since date-fns will be off by 1 month if we don't
  const newDate = new Date(date?.slice(0, -3).replace(/-/g, '/'));
  return isValid(newDate) ? format(newDate, 'MM/yyyy') : undefined;
};

export const endDate = (date, days) => {
  return isValid(new Date(date))
    ? formatDateLong(addDays(new Date(date), days))
    : '';
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

const employmentDateTemplate = 'YYYY-MM-XX';
const isEmploymentDateComplete = date =>
  date?.length === employmentDateTemplate.length;

/**
 * Helper function to determine if date value is valid starting date:
 * - date is in the past or today
 * - date is complete
 * - date is not in the future
 *
 * @param {string} date - date string in ISO-ish; example: '2021-01-XX'
 * @returns true if date meets requirements above
 *
 */
export const isValidStartDate = date => {
  const formattedDate = new Date(date?.slice(0, -3).replace(/-/g, '/'));

  if (isValid(formattedDate) && isEmploymentDateComplete(date)) {
    return !isFuture(formattedDate);
  }
  return false;
};

/**
 * Helper function to determine if date value is valid ending date:
 * - ending date not in the future
 * - ending date is after start date
 * - ending date is complete
 *
 * @param {string} startDate - date string in ISO-ish; example: '2021-01-XX'
 * @param {string} endedDate - date string in ISO-ish; example: '2021-01-XX'
 * @returns true if date meets requirements above
 *
 */
export const isValidEndDate = (startDate, endedDate) => {
  const formattedStartDate = new Date(
    startDate?.slice(0, -3).replace(/-/g, '/'),
  );
  const formattedEndDate = new Date(endedDate?.slice(0, -3).replace(/-/g, '/'));

  if (isValid(formattedEndDate) && isEmploymentDateComplete(endedDate)) {
    // end date is *not* in the future
    // end date is *after* start date
    return (
      !isFuture(formattedEndDate) &&
      isAfter(formattedEndDate, formattedStartDate)
    );
  }
  return false;
};

/**
 * Generates a unique key based on the given data fields and an optional index.
 * @example
 * const keyFieldsForCreditCard = ['amountDueMonthly', 'amountPastDue', 'unpaidBalance'];
 * key={generateUniqueKey(bills, keyFieldsForCreditCard, index)}
 * Output: "200-50-1000-2"
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
