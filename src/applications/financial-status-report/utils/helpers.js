import moment from 'moment';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { addDays, format, isValid } from 'date-fns';
import { get } from 'lodash';
import { deductionCodes } from '../constants/deduction-codes';

export const fsrWizardFeatureToggle = state => {
  return toggleValues(state)[
    FEATURE_FLAG_NAMES.showFinancialStatusReportWizard
  ];
};

export const fsrFeatureToggle = state => {
  return toggleValues(state)[FEATURE_FLAG_NAMES.showFinancialStatusReport];
};

export const combinedFSRFeatureToggle = state => {
  return toggleValues(state)[FEATURE_FLAG_NAMES.combinedFinancialStatusReport];
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

export const fsrConfirmationEmailToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.fsrConfirmationEmail];

export const allEqual = arr => arr.every(val => val === arr[0]);

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

export const getFsrReason = (debts, combinedFSR) => {
  const reasons = combinedFSR
    ? debts.map(({ resolutionOption }) => fsrReasonDisplay(resolutionOption))
    : debts.map(({ resolution }) => resolution.resolutionType);
  const uniqReasons = [...new Set(reasons)];

  return uniqReasons.join(', ');
};

export const getAmountCanBePaidTowardDebt = (debts, combinedFSR) => {
  return combinedFSR
    ? debts
        .filter(item => item.resolutionComment !== undefined)
        .reduce(
          (acc, debt) =>
            acc +
            Number(debt.resolutionComment?.replaceAll(/[^0-9.-]/g, '') ?? 0),
          0,
        )
    : debts
        .filter(item => item.resolution.offerToPay !== undefined)
        .reduce(
          (acc, debt) =>
            acc +
            Number(
              debt.resolution?.offerToPay?.replaceAll(/[^0-9.-]/g, '') ?? 0,
            ),
          0,
        );
};

export const mergeAdditionalComments = (additionalComments, expenses) => {
  const individualExpenses = expenses
    ?.map(expense => `${expense.name} (${currency(expense.amount)})`)
    .join(', ');

  const individualExpensesStr = `Individual expense amount: ${individualExpenses}`;

  return individualExpenses
    ? `${additionalComments}\n${individualExpensesStr}`
    : additionalComments;
};

export const getMonthlyIncome = ({
  additionalIncome: {
    addlIncRecords,
    spouse: { spAddlIncome },
  },
  personalData: {
    employmentHistory: {
      veteran: { employmentRecords = [] },
      spouse: { spEmploymentRecords = [] },
    },
  },
  socialSecurity,
  benefits,
  currEmployment,
  spCurrEmployment,
  income,
  'view:enhancedFinancialStatusReport': enhancedFSRActive,
}) => {
  // deduction filters
  const taxFilters = ['State tax', 'Federal tax', 'Local tax'];
  const retirementFilters = ['401K', 'IRA', 'Pension'];
  const socialSecFilters = ['FICA (Social Security and Medicare)'];
  const allFilters = [...taxFilters, ...retirementFilters, ...socialSecFilters];

  // veteran
  const vetGrossSalary = enhancedFSRActive
    ? sumValues(employmentRecords, 'grossMonthlyIncome')
    : sumValues(currEmployment, 'veteranGrossSalary');
  const vetAddlInc = sumValues(addlIncRecords, 'amount');
  const vetSocSecAmt = !enhancedFSRActive
    ? Number(socialSecurity.socialSecAmt?.replaceAll(/[^0-9.-]/g, '') ?? 0)
    : 0;
  const vetComp = sumValues(income, 'compensationAndPension');
  const vetEdu = sumValues(income, 'education');
  const vetBenefits = vetComp + vetEdu;
  const vetDeductions = enhancedFSRActive
    ? employmentRecords
        ?.filter(emp => emp.isCurrent)
        .map(emp => emp.deductions)
        .flat() ?? 0
    : currEmployment?.map(emp => emp.deductions).flat() ?? 0;
  const vetTaxes = filterReduceByName(vetDeductions, taxFilters);
  const vetRetirement = filterReduceByName(vetDeductions, retirementFilters);
  const vetSocialSec = filterReduceByName(vetDeductions, socialSecFilters);
  const vetOther = otherDeductionsAmt(vetDeductions, allFilters);
  const vetTotDeductions = vetTaxes + vetRetirement + vetSocialSec + vetOther;
  const vetOtherIncome = vetAddlInc + vetBenefits + vetSocSecAmt;
  const vetNetIncome = vetGrossSalary - vetTotDeductions;

  // spouse
  const spGrossSalary = enhancedFSRActive
    ? sumValues(spEmploymentRecords, 'grossMonthlyIncome')
    : sumValues(spCurrEmployment, 'spouseGrossSalary');

  const spAddlInc = sumValues(spAddlIncome, 'amount');
  const spSocialSecAmt = !enhancedFSRActive
    ? Number(
        socialSecurity.spouse?.socialSecAmt?.replaceAll(/[^0-9.-]/g, '') ?? 0,
      )
    : 0;
  const spComp = Number(
    benefits.spouseBenefits.compensationAndPension?.replaceAll(
      /[^0-9.-]/g,
      '',
    ) ?? 0,
  );
  const spEdu = Number(
    benefits.spouseBenefits.education?.replaceAll(/[^0-9.-]/g, '') ?? 0,
  );
  const spBenefits = spComp + spEdu;
  const spDeductions = enhancedFSRActive
    ? spEmploymentRecords
        ?.filter(emp => emp.isCurrent)
        .map(emp => emp.deductions)
        .flat() ?? 0
    : spCurrEmployment?.map(emp => emp.deductions).flat() ?? 0;

  const spTaxes = filterReduceByName(spDeductions, taxFilters);
  const spRetirement = filterReduceByName(spDeductions, retirementFilters);
  const spSocialSec = filterReduceByName(spDeductions, socialSecFilters);
  const spOtherAmt = otherDeductionsAmt(spDeductions, allFilters);
  const spTotDeductions = spTaxes + spRetirement + spSocialSec + spOtherAmt;
  const spOtherIncome = spAddlInc + spBenefits + spSocialSecAmt;
  const spNetIncome = spGrossSalary - spTotDeductions;

  return vetNetIncome + vetOtherIncome + spNetIncome + spOtherIncome;
};

export const getMonthlyExpenses = ({
  expenses,
  otherExpenses,
  utilityRecords,
  installmentContracts,
  'view:enhancedFinancialStatusReport': enhancedFSRActive = false,
}) => {
  const utilities = enhancedFSRActive
    ? sumValues(utilityRecords, 'amount')
    : sumValues(utilityRecords, 'monthlyUtilityAmount');
  const installments = sumValues(installmentContracts, 'amountDueMonthly');
  const otherExp = sumValues(otherExpenses, 'amount');
  const creditCardBills = sumValues(
    expenses.creditCardBills,
    'amountDueMonthly',
  );

  // efsr note: food is included in otherExpenses
  const food = Number(get(expenses, 'food', 0));
  // efsr note: Rent & Mortgage is included in expenseRecords
  const rentOrMortgage = Number(get(expenses, 'rentOrMortgage', 0));

  const calculatedExpenseRecords =
    expenses?.expenseRecords?.reduce(
      (acc, expense) =>
        acc + Number(expense.amount?.replaceAll(/[^0-9.-]/g, '') ?? 0),
      0,
    ) ?? 0;

  return (
    utilities +
    installments +
    otherExp +
    calculatedExpenseRecords +
    food +
    rentOrMortgage +
    creditCardBills
  );
};

export const getTotalAssets = ({
  assets,
  realEstateRecords,
  questions,
  'view:combinedFinancialStatusReport': combinedFSRActive,
  'view:enhancedFinancialStatusReport': enhancedFSRActive,
}) => {
  const formattedREValue = Number(
    assets.realEstateValue?.replaceAll(/[^0-9.-]/g, '') ?? 0,
  );
  const totOtherAssets = sumValues(assets.otherAssets, 'amount');
  const totRecVehicles = !combinedFSRActive
    ? sumValues(assets.recVehicles, 'recVehicleAmount')
    : Number(assets?.recVehicleAmount?.replaceAll(/[^0-9.-]/g, '') ?? 0);
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

export const getCurrentEmploymentHistoryObject = () => {
  return null;
};

export const dateTemplate = 'YYYY-MM-DD';

export const maxDate = moment().add(100, 'year');
export const getDate = date => moment(date, dateTemplate);
export const isDateComplete = date => date?.length === dateTemplate.length;
export const isDateInFuture = date => date?.diff(moment()) > 0;
export const isDateLessThanMax = date => date?.isBefore(maxDate);

export const isValidPastDate = date => {
  if (date && isDateComplete(date)) {
    const dateObj = getDate(date);
    return !isDateInFuture(dateObj);
  }
  return false;
};

export const getDiffInDays = date => {
  const dateDischarge = moment(date, dateTemplate);
  const dateToday = moment();
  return dateDischarge.diff(dateToday, 'days');
};
