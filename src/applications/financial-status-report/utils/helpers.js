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
  return arr?.reduce((acc, item) => acc + Number(item[key]) ?? 0, 0);
};

export const getMonthlyIncome = ({
  questions,
  additionalIncome,
  socialSecurity,
  benefits,
  currentEmployment,
  spouseCurrentEmployment,
}) => {
  let totalArr = [];

  if (questions.vetIsEmployed) {
    const monthlyGrossSalary = currentEmployment
      .map(record => Number(record.veteranMonthlyGrossSalary))
      .reduce((acc, amount) => acc + amount, 0);
    totalArr = [...totalArr, monthlyGrossSalary];
  }

  if (questions.spouseIsEmployed) {
    const monthlyGrossSalary = spouseCurrentEmployment
      .map(record => Number(record.spouseMonthlyGrossSalary))
      .reduce((acc, amount) => acc + amount, 0);
    totalArr = [...totalArr, monthlyGrossSalary];
  }

  if (questions.hasAdditionalIncome) {
    const vetAddl = additionalIncome.additionalIncomeRecords.map(record =>
      Number(record.amount),
    );
    totalArr = [...totalArr, ...vetAddl];
  }

  if (questions.spouseHasAdditionalIncome) {
    const spouseAddl = additionalIncome.spouse.spouseAdditionalIncomeRecords.map(
      record => Number(record.amount),
    );
    totalArr = [...totalArr, ...spouseAddl];
  }

  if (questions.hasSocialSecurity) {
    const { socialSecurityAmount } = socialSecurity;
    totalArr = [...totalArr, socialSecurityAmount];
  }

  if (questions.spouseHasSocialSecurity) {
    const { socialSecurityAmount } = socialSecurity.spouse;
    totalArr = [...totalArr, socialSecurityAmount];
  }

  if (questions.spouseHasBenefits) {
    const { benefitAmount, educationAmount } = benefits.spouseBenefits;
    totalArr = [...totalArr, benefitAmount, educationAmount];
  }

  return totalArr.reduce((acc, income) => acc + Number(income), 0) ?? 0;
};

export const getMonthlyExpenses = formData => {
  const {
    questions,
    expenses,
    otherExpenses,
    utilityRecords,
    installmentContracts,
  } = formData;

  let totalArr = [];

  const householdExpenses = Object.values(expenses);
  totalArr = [...totalArr, ...householdExpenses];

  if (questions.hasUtilities) {
    const utilities = utilityRecords.map(
      utility => utility.monthlyUtilityAmount,
    );
    totalArr = [...totalArr, ...utilities];
  }

  if (questions.hasRepayments) {
    const installments = installmentContracts.map(
      installment => installment.amountDueMonthly,
    );
    totalArr = [...totalArr, ...installments];
  }

  if (questions.hasOtherExpenses) {
    const other = otherExpenses.map(expense => expense.amount);
    totalArr = [...totalArr, ...other];
  }

  return totalArr.reduce((acc, expense) => acc + Number(expense), 0) ?? 0;
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

export const getTotalAssets = ({ assets, realEstateRecords }) => {
  const totVehicles = sumValues(assets.automobiles, 'resaleValue');
  const totOtherAssets = sumValues(assets.otherAssets, 'amount');
  const totRealEstate = sumValues(realEstateRecords, 'realEstateAmount');
  const totRecVehicles = sumValues(assets.recVehicles, 'recVehicleAmount');

  const totAssets = Object.values(assets)
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

export const getIncome = ({
  questions,
  additionalIncome,
  currentEmployment,
  spouseCurrentEmployment,
}) => {
  const defaultObj = {
    monthlyGrossSalary: '',
    deductions: {
      taxes: '',
      retirement: '',
      socialSecurity: '',
      otherDeductions: {
        name: '',
        amount: '',
      },
    },
    totalDeductions: '',
    netTakeHomePay: '',
    otherIncome: {
      name: '',
      amount: '',
    },
    totalMonthlyNetIncome: '',
  };

  let income = [
    { veteranOrSpouse: 'VETERAN', ...defaultObj },
    { veteranOrSpouse: 'SPOUSE', ...defaultObj },
  ];

  if (questions.vetIsEmployed) {
    const veteranMonthlyGrossSalary = currentEmployment
      .map(record => record.veteranMonthlyGrossSalary)
      .reduce((acc, amount) => acc + Number(amount), 0);

    const deductions = currentEmployment
      .map(record => record.deductions)
      .flat();

    const totalDeductions = sumValues(deductions, 'amount');

    income = income.map(item => {
      if (item.veteranOrSpouse === 'VETERAN') {
        return {
          ...item,
          deductions: {
            ...item.deductions,
            otherDeductions: {
              name: deductions
                .map(deduction => deduction?.name ?? '')
                .join(', '),
              amount: deductions.reduce(
                (acc, deduction) => acc + Number(deduction?.amount) ?? 0,
                0,
              ),
            },
          },
          monthlyGrossSalary: veteranMonthlyGrossSalary,
          totalDeductions,
          netTakeHomePay: veteranMonthlyGrossSalary - totalDeductions,
          totalMonthlyNetIncome: veteranMonthlyGrossSalary - totalDeductions,
        };
      }
      return item;
    });
  }

  if (questions.spouseIsEmployed) {
    const spouseMonthlyGrossSalary = spouseCurrentEmployment
      .map(record => record.spouseMonthlyGrossSalary)
      .reduce((acc, amount) => acc + Number(amount), 0);

    const deductions = spouseCurrentEmployment
      .map(record => record.deductions)
      .flat();

    const totalDeductions = sumValues(deductions, 'amount');

    income = income.map(item => {
      if (item.veteranOrSpouse === 'SPOUSE') {
        return {
          ...item,
          deductions: {
            ...item.deductions,
            otherDeductions: {
              name: deductions
                .map(deduction => deduction?.name ?? '')
                .join(', '),
              amount: deductions.reduce(
                (acc, deduction) => acc + Number(deduction?.amount) ?? 0,
                0,
              ),
            },
          },
          monthlyGrossSalary: spouseMonthlyGrossSalary,
          totalDeductions,
          netTakeHomePay: spouseMonthlyGrossSalary - totalDeductions,
          totalMonthlyNetIncome: spouseMonthlyGrossSalary - totalDeductions,
        };
      }
      return item;
    });
  }

  if (questions.hasAdditionalIncome) {
    const veteranMonthlyGrossSalary = currentEmployment
      .map(record => record.veteranMonthlyGrossSalary)
      .reduce((acc, amount) => acc + Number(amount), 0);

    const deductions = currentEmployment
      .map(record => record.deductions)
      .flat();

    const totalDeductions = sumValues(deductions, 'amount');

    const otherIncome = additionalIncome.additionalIncomeRecords.reduce(
      (acc, record) => acc + Number(record.amount),
      0,
    );

    const totalNetIncome =
      veteranMonthlyGrossSalary + otherIncome - totalDeductions;

    income = income.map(item => {
      if (item.veteranOrSpouse === 'VETERAN') {
        return {
          ...item,
          otherIncome: {
            name: additionalIncome.additionalIncomeRecords
              .map(record => record.name)
              .join(', '),
            amount: additionalIncome.additionalIncomeRecords.reduce(
              (acc, record) => acc + Number(record.amount),
              0,
            ),
          },
          totalMonthlyNetIncome: totalNetIncome,
        };
      }
      return item;
    });
  }

  if (questions.spouseHasAdditionalIncome) {
    const spouseMonthlyGrossSalary = spouseCurrentEmployment
      .map(record => record.spouseMonthlyGrossSalary)
      .reduce((acc, amount) => acc + Number(amount), 0);

    const deductions = spouseCurrentEmployment
      .map(record => record.deductions)
      .flat();

    const totalDeductions = sumValues(deductions, 'amount');

    const otherIncome = additionalIncome.spouse.spouseAdditionalIncomeRecords.reduce(
      (acc, record) => acc + Number(record.amount),
      0,
    );

    const totalNetIncome =
      spouseMonthlyGrossSalary + otherIncome - totalDeductions;

    income = income.map(item => {
      if (item.veteranOrSpouse === 'SPOUSE') {
        return {
          ...item,
          otherIncome: {
            name: additionalIncome.spouse.spouseAdditionalIncomeRecords
              .map(record => record.name)
              .join(', '),
            amount: additionalIncome.spouse.spouseAdditionalIncomeRecords.reduce(
              (acc, record) => acc + Number(record.amount),
              0,
            ),
          },

          totalMonthlyNetIncome: totalNetIncome,
        };
      }
      return item;
    });
  }

  return income;
};
