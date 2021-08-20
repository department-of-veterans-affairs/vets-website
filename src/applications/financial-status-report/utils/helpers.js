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
  if (!arr) return 0;
  return arr?.reduce((acc, item) => acc + Number(item[key]) ?? 0, 0);
};

export const getMonthlyIncome = ({
  additionalIncome: {
    additionalIncomeRecords,
    spouse: { spouseAdditionalIncomeRecords },
  },
  socialSecurity,
  benefits,
  currentEmployment,
  spouseCurrentEmployment,
}) => {
  const vetGrossSalary = sumValues(currentEmployment, 'veteranGrossSalary');
  const spGrossSalary = sumValues(spouseCurrentEmployment, 'spouseGrossSalary');
  const vetOtherAmt = sumValues(additionalIncomeRecords, 'amount');
  const spOtherAmt = sumValues(spouseAdditionalIncomeRecords, 'amount');
  const socialSecAmt = Number(socialSecurity.socialSecAmt) ?? 0;
  const spSocialSecAmt = Number(socialSecurity.spouse.socialSecAmt) ?? 0;
  const spBenefits = Number(benefits.spouseBenefits.benefitAmount) ?? 0;

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
  const totVehicles = sumValues(assets.automobiles, 'resaleValue');
  const totOtherAssets = sumValues(assets.otherAssets, 'amount');
  const totRealEstate = sumValues(realEstateRecords, 'realEstateAmount');
  const totRecVehicles = sumValues(assets.recVehicles, 'recVehicleAmount');

  const totAssets = Object.values(assets) // TODO: refactor this to match expVals
    .filter(item => typeof item === 'string')
    .reduce((acc, amount) => acc + Number(amount), 0);

  const totArr = [
    totVehicles,
    totRecVehicles,
    totRealEstate,
    totOtherAssets,
    totAssets,
  ];

  return totArr
    .map(amount => amount ?? 0)
    .reduce((acc, amount) => acc + Number(amount), 0);
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
