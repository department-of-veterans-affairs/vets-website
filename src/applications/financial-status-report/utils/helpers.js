import moment from 'moment';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const fsrWizardFeatureToggle = state => {
  return toggleValues(state)[
    FEATURE_FLAG_NAMES.showFinancialStatusReportWizard
  ];
};

export const fsrFeatureToggle = state => {
  return toggleValues(state)[FEATURE_FLAG_NAMES.showFinancialStatusReport];
};

export const dateFormatter = date => {
  if (!date) return undefined;
  const formatDate = date?.slice(0, -3);
  return moment(formatDate).format('MM/YYYY');
};

export const sumValues = (arr, key) => {
  if (!Array.isArray(arr) || !arr.length) return 0;
  return arr?.reduce((acc, item) => acc + Number(item[key]) ?? 0, 0);
};

export const getMonthlyIncome = ({
  additionalIncome: {
    addlIncRecords,
    spouse: { spAddlIncome },
  },
  socialSecurity,
  benefits,
  currEmployment,
  spCurrEmployment,
}) => {
  const vetGrossSalary = sumValues(currEmployment, 'veteranGrossSalary');
  const spGrossSalary = sumValues(spCurrEmployment, 'spouseGrossSalary');
  const vetOtherAmt = sumValues(addlIncRecords, 'amount');
  const spOtherAmt = sumValues(spAddlIncome, 'amount');
  const socialSecAmt = Number(socialSecurity.socialSecAmt ?? 0);
  const spSocialSecAmt = Number(socialSecurity.spouse.socialSecAmt ?? 0);
  const spBenefits = Number(benefits.spouseBenefits.benefitAmount ?? 0);

  return (
    vetGrossSalary +
    spGrossSalary +
    vetOtherAmt +
    spOtherAmt +
    socialSecAmt +
    spSocialSecAmt +
    spBenefits
  );
};

export const getMonthlyExpenses = formData => {
  const {
    expenses,
    otherExpenses,
    utilityRecords,
    installmentContracts,
  } = formData;

  const expVals = Object.values(expenses);
  const totalExp = expVals.reduce((acc, expense) => acc + Number(expense), 0);
  const utilities = sumValues(utilityRecords, 'monthlyUtilityAmount');
  const installments = sumValues(installmentContracts, 'amountDueMonthly');
  const otherExp = sumValues(otherExpenses, 'amount');

  return totalExp + utilities + installments + otherExp;
};

export const getTotalAssets = ({ assets, realEstateRecords }) => {
  const totOtherAssets = sumValues(assets.otherAssets, 'amount');
  const totRecVehicles = sumValues(assets.recVehicles, 'recVehicleAmount');
  const totVehicles = sumValues(assets.automobiles, 'resaleValue');
  const realEstate = sumValues(realEstateRecords, 'realEstateAmount');
  const totAssets = Object.values(assets)
    .filter(item => !Array.isArray(item))
    .reduce((acc, amount) => acc + Number(amount), 0);

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
      from: dateFormatter(employment.from),
      to: employment.isCurrent ? '' : dateFormatter(employment.to),
      present: employment.isCurrent ? employment.isCurrent : false,
      employerName: employment.employerName,
    }));
    history = [...history, ...vetEmploymentHistory];
  }

  if (questions.spouseIsEmployed) {
    const { employmentRecords } = employmentHistory.spouse;
    const spouseEmploymentHistory = employmentRecords.map(employment => ({
      ...defaultObj,
      veteranOrSpouse: 'SPOUSE',
      from: dateFormatter(employment.from),
      to: employment.isCurrent ? '' : dateFormatter(employment.to),
      present: employment.isCurrent ? employment.isCurrent : false,
      employerName: employment.employerName,
    }));
    history = [...history, ...spouseEmploymentHistory];
  }

  return history;
};
