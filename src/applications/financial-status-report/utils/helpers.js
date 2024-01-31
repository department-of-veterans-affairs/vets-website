import moment from 'moment';
import { addDays, format, isValid } from 'date-fns';
import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
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

export const enhancedFSRFeatureToggle = state => {
  return toggleValues(state)[
    FEATURE_FLAG_NAMES.combinedFinancialStatusReportEnhancements
  ];
};

export const streamlinedWaiverFeatureToggle = state => {
  return toggleValues(state)[
    FEATURE_FLAG_NAMES.financialStatusReportStreamlinedWaiver
  ];
};

export const streamlinedWaiverAssetUpdateFeatureToggle = state => {
  return toggleValues(state)[
    FEATURE_FLAG_NAMES.financialStatusReportStreamlinedWaiverAssets
  ];
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

export const dateFormatter = date => {
  if (!date) return undefined;
  const formatDate = date?.slice(0, -3);
  return moment(formatDate, 'YYYY-MM').format('MM/YYYY');
};

export const formatDate = date => {
  return format(new Date(date), 'MMMM d, yyyy');
};

export const endDate = (date, days) => {
  return isValid(new Date(date))
    ? formatDate(addDays(new Date(date), days))
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

export const getTotalAssets = ({
  assets,
  realEstateRecords,
  questions,
  'view:enhancedFinancialStatusReport': enhancedFSRActive,
}) => {
  const formattedREValue = Number(
    assets.realEstateValue?.replaceAll(/[^0-9.-]/g, '') ?? 0,
  );
  const totOtherAssets = sumValues(assets.otherAssets, 'amount');
  const totRecVehicles = enhancedFSRActive
    ? Number(assets?.recVehicleAmount?.replaceAll(/[^0-9.-]/g, '') ?? 0)
    : 0;
  const totVehicles = questions?.hasVehicle
    ? sumValues(assets.automobiles, 'resaleValue')
    : 0;
  const realEstate = !enhancedFSRActive
    ? sumValues(realEstateRecords, 'realEstateAmount')
    : formattedREValue;
  const totAssets = !enhancedFSRActive
    ? Object.values(assets)
        .filter(item => item && !Array.isArray(item))
        .reduce(
          (acc, amount) =>
            acc + Number(amount?.replaceAll(/[^0-9.-]/g, '') ?? 0),
          0,
        )
    : sumValues(assets.monetaryAssets, 'amount');

  return totVehicles + totRecVehicles + totOtherAssets + realEstate + totAssets;
};

export const getEmploymentHistory = ({
  questions,
  personalData,
  'view:enhancedFinancialStatusReport': enhancedFSRActive,
}) => {
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
      from: dateFormatter(employment.from),
      to: employment.isCurrent ? '' : dateFormatter(employment.to),
      present: employment.isCurrent ? employment.isCurrent : false,
      employerName: employment.employerName,
    }));
    history = [...history, ...vetEmploymentHistory];
  }

  if (questions.spouseIsEmployed) {
    if (enhancedFSRActive) {
      const { spEmploymentRecords } = employmentHistory.spouse;
      const spouseEmploymentHistory = spEmploymentRecords.map(employment => ({
        ...defaultObj,
        veteranOrSpouse: 'SPOUSE',
        occupationName: employment.type,
        from: dateFormatter(employment.from),
        to: employment.isCurrent ? '' : dateFormatter(employment.to),
        present: employment.isCurrent ? employment.isCurrent : false,
        employerName: employment.employerName,
      }));
      history = [...history, ...spouseEmploymentHistory];
    } else {
      const { employmentRecords } = employmentHistory.spouse;
      const spouseEmploymentHistory = employmentRecords.map(employment => ({
        ...defaultObj,
        veteranOrSpouse: 'SPOUSE',
        occupationName: employment.type,
        from: dateFormatter(employment.from),
        to: employment.isCurrent ? '' : dateFormatter(employment.to),
        present: employment.isCurrent ? employment.isCurrent : false,
        employerName: employment.employerName,
      }));
      history = [...history, ...spouseEmploymentHistory];
    }
  }

  return history;
};

// receiving formatted date strings in the response
// so we need to convert back to moment before sorting
export const sortStatementsByDate = statements => {
  const dateFormat = 'MM-DD-YYYY';
  return statements.sort(
    (a, b) =>
      moment(b.pSStatementDate, dateFormat) -
      moment(a.pSStatementDate, dateFormat),
  );
};

// Returns name of debt depending on the type
export const getDebtName = debt => {
  return debt.debtType === 'COPAY'
    ? debt.station.facilityName
    : deductionCodes[debt.deductionCode] || debt.benefitType;
};

export const dateTemplate = 'YYYY-MM-DD';

export const maxDate = moment().add(100, 'year');
export const getDate = date => moment(date, dateTemplate);
export const isDateComplete = date => date?.length === dateTemplate.length;
export const isDateInFuture = date => date?.diff(moment()) > 0;
export const isDateBeyondMax = date => moment(date).isAfter(maxDate);

export const isValidFromDate = date => {
  if (date && isDateComplete(date)) {
    const dateObj = getDate(date);
    return !isDateInFuture(dateObj) && !isDateBeyondMax(dateObj);
  }
  return false;
};

export const isValidToDate = (fromDate, toDate) => {
  if (
    fromDate &&
    toDate &&
    isDateComplete(fromDate) &&
    isDateComplete(toDate)
  ) {
    const fromDateObj = getDate(fromDate);
    const toDateObj = getDate(toDate);

    return (
      !isDateInFuture(toDateObj) &&
      !moment(toDateObj).isBefore(fromDateObj) &&
      !isDateBeyondMax(toDateObj)
    );
  }
  return false;
};

export const getDiffInDays = date => {
  const dateDischarge = moment(date, dateTemplate);
  const dateToday = moment();
  return dateDischarge.diff(dateToday, 'days');
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
