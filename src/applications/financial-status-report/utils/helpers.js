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
  const formatDate = date?.slice(0, -3);
  return moment(formatDate).format('MM/YYYY');
};

export const getMonthlyIncome = ({
  questions,
  personalData,
  additionalIncome,
  socialSecurity,
  benefits,
}) => {
  const { employmentHistory } = personalData;
  let totalArr = [];

  if (questions.vetIsEmployed) {
    const { monthlyGrossSalary } = employmentHistory.veteran.currentEmployment;
    totalArr = [...totalArr, monthlyGrossSalary];
  }

  if (questions.spouseIsEmployed) {
    const { monthlyGrossSalary } = employmentHistory.spouse.currentEmployment;
    totalArr = [...totalArr, monthlyGrossSalary];
  }

  if (questions.hasAdditionalIncome) {
    const vetAddl = additionalIncome.additionalIncomeRecords.map(
      record => record.amount,
    );
    totalArr = [...totalArr, ...vetAddl];
  }

  if (questions.spouseHasAdditionalIncome) {
    const spouseAddl = additionalIncome.spouse.additionalIncomeRecords.map(
      record => record.amount,
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

  return totalArr.reduce((acc, income) => acc + income, 0);
};

export const getMonthlyExpenses = ({
  questions,
  personalData,
  expenses,
  otherExpenses,
  utilityRecords,
  installmentContractsAndOtherDebts,
}) => {
  const { employmentHistory } = personalData;
  let totalArr = [];

  const householdExpenses = Object.values(expenses);
  totalArr = [...totalArr, ...householdExpenses];

  if (questions.vetIsEmployed) {
    const { deductions } = employmentHistory.veteran.currentEmployment;
    const payrollDeductions = deductions.map(deduction => deduction.amount);
    totalArr = [...totalArr, ...payrollDeductions];
  }

  if (questions.hasUtilities) {
    const utilities = utilityRecords.map(
      utility => utility.monthlyUtilityAmount,
    );
    totalArr = [...totalArr, ...utilities];
  }

  if (questions.hasRepayments) {
    const installments = installmentContractsAndOtherDebts.map(
      installment => installment.amountDueMonthly,
    );
    totalArr = [...totalArr, ...installments];
  }

  if (questions.hasOtherExpenses) {
    const other = otherExpenses.map(expense => expense.amount);
    totalArr = [...totalArr, ...other];
  }

  return totalArr.reduce((acc, expense) => acc + expense, 0);
};

export const getEmploymentHistory = ({ questions, personalData }) => {
  const { employmentHistory } = personalData;
  let history = [];

  const defaultObj = {
    veteranOrSpouse: '',
    occupationName: '',
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
    from: '',
    to: '',
    present: false,
  };

  if (questions.vetIsEmployed) {
    const { currentEmployment } = employmentHistory.veteran;
    history = [
      ...history,
      {
        ...defaultObj,
        veteranOrSpouse: 'VETERAN',
        employerName: currentEmployment.employerName,
        from: dateFormatter(currentEmployment.from),
        present: true,
      },
    ];
  }

  if (questions.spouseIsEmployed) {
    const { currentEmployment } = employmentHistory.spouse;
    history = [
      ...history,
      {
        ...defaultObj,
        veteranOrSpouse: 'SPOUSE',
        employerName: currentEmployment.employerName,
        from: dateFormatter(currentEmployment.from),
        present: true,
      },
    ];
  }

  if (questions.vetPreviouslyEmployed) {
    const { previousEmployment } = employmentHistory.veteran;
    const employmentRecords = previousEmployment.map(employment => ({
      ...defaultObj,
      veteranOrSpouse: 'VETERAN',
      employerName: employment.employerName,
      from: dateFormatter(employment.from),
      to: dateFormatter(employment.to),
      present: false,
    }));
    history = [...history, ...employmentRecords];
  }

  if (questions.spousePreviouslyEmployed) {
    const { previousEmployment } = employmentHistory.spouse;
    const employmentRecords = previousEmployment.map(employment => ({
      ...defaultObj,
      veteranOrSpouse: 'SPOUSE',
      employerName: employment.employerName,
      from: dateFormatter(employment.from),
      to: dateFormatter(employment.to),
      present: false,
    }));
    history = [...history, ...employmentRecords];
  }

  return history;
};

export const getTotalAssets = ({ assets, realEstateRecords }) => {
  const totVehicles = assets.automobiles
    ?.map(vehicle => vehicle.resaleValue || 0)
    .reduce((acc, amount) => acc + amount, 0);

  const totRecVehicles = assets.trailersBoatsCampers
    ?.map(vehicle => vehicle.recreationalVehicleAmount || 0)
    .reduce((acc, amount) => acc + amount, 0);

  const totRealEstate = realEstateRecords
    ?.map(record => record.realEstateAmount || 0)
    .reduce((acc, amount) => acc + amount, 0);

  const totAssets = Object.values(assets)
    .map(asset => (Number.isInteger(asset) ? asset : 0))
    .reduce((acc, amount) => acc + amount, 0);

  const totOtherAssets = assets.otherAssets
    ?.map(asset => asset.amount || 0)
    .reduce((acc, amount) => acc + amount, 0);

  const totArr = [
    totVehicles,
    totRecVehicles,
    totAssets,
    totRealEstate,
    totOtherAssets,
  ];

  return totArr
    .map(amount => amount || 0)
    .reduce((acc, amount) => acc + amount, 0);
};

export const getIncome = ({ questions, personalData, additionalIncome }) => {
  const { employmentHistory } = personalData;

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
    const { monthlyGrossSalary } = employmentHistory.veteran.currentEmployment;
    const { deductions } = employmentHistory.veteran.currentEmployment;

    const totalDeductions = deductions
      .map(deduction => deduction.amount)
      .reduce((acc, amount) => acc + amount, 0);

    income = income.map(item => {
      if (item.veteranOrSpouse === 'VETERAN') {
        return {
          ...item,
          deductions: {
            ...item.deductions,
            otherDeductions: [...deductions],
          },
          monthlyGrossSalary,
          totalDeductions,
          netTakeHomePay: monthlyGrossSalary - totalDeductions,
          totalMonthlyNetIncome: monthlyGrossSalary - totalDeductions,
        };
      }
      return item;
    });
  }

  if (questions.spouseIsEmployed) {
    const { monthlyGrossSalary } = employmentHistory.spouse.currentEmployment;
    const { deductions } = employmentHistory.spouse.currentEmployment;

    const totalDeductions = deductions
      .map(deduction => deduction.amount)
      .reduce((acc, amount) => acc + amount, 0);

    income = income.map(item => {
      if (item.veteranOrSpouse === 'SPOUSE') {
        return {
          ...item,
          deductions: {
            ...item.deductions,
            otherDeductions: [...deductions],
          },
          monthlyGrossSalary,
          totalDeductions,
          netTakeHomePay: monthlyGrossSalary - totalDeductions,
          totalMonthlyNetIncome: monthlyGrossSalary - totalDeductions,
        };
      }
      return item;
    });
  }

  if (questions.hasAdditionalIncome) {
    const { monthlyGrossSalary } = employmentHistory.veteran.currentEmployment;
    const { deductions } = employmentHistory.veteran.currentEmployment;

    const totalDeductions = deductions
      .map(deduction => deduction.amount)
      .reduce((acc, amount) => acc + amount, 0);

    const otherIncome = additionalIncome.additionalIncomeRecords
      .map(addtl => addtl.amount)
      .reduce((acc, amount) => acc + amount, 0);

    const totalNetIncome = monthlyGrossSalary + otherIncome - totalDeductions;

    income = income.map(item => {
      if (item.veteranOrSpouse === 'VETERAN') {
        return {
          ...item,
          otherIncome: additionalIncome.additionalIncomeRecords,
          totalMonthlyNetIncome: totalNetIncome,
        };
      }
      return item;
    });
  }

  if (questions.spouseHasAdditionalIncome) {
    const { monthlyGrossSalary } = employmentHistory.spouse.currentEmployment;
    const { deductions } = employmentHistory.spouse.currentEmployment;

    const totalDeductions = deductions
      .map(deduction => deduction.amount)
      .reduce((acc, amount) => acc + amount, 0);

    const otherIncome = additionalIncome.spouse.additionalIncomeRecords
      .map(addtl => addtl.amount)
      .reduce((acc, amount) => acc + amount, 0);

    const totalNetIncome = monthlyGrossSalary + otherIncome - totalDeductions;

    income = income.map(item => {
      if (item.veteranOrSpouse === 'SPOUSE') {
        return {
          ...item,
          otherIncome: additionalIncome.spouse.additionalIncomeRecords,
          totalMonthlyNetIncome: totalNetIncome,
        };
      }
      return item;
    });
  }

  return income;
};
