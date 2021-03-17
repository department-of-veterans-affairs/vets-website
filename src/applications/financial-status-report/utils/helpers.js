import { omit } from 'lodash/fp';

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

  if (questions.vetIsEmployed) {
    history = [
      ...history,
      omit('deductions', employmentHistory.veteran.currentEmployment),
    ];
  }

  if (questions.spouseIsEmployed) {
    history = [
      ...history,
      omit('deductions', employmentHistory.spouse.currentEmployment),
    ];
  }

  if (questions.vetPreviouslyEmployed) {
    const { previousEmployment } = employmentHistory.veteran;
    const employmentRecords = previousEmployment.map(record => ({
      ...record,
      veteranOrSpouse: 'VETERAN',
    }));
    history = [...history, ...employmentRecords];
  }

  if (questions.spousePreviouslyEmployed) {
    const { previousEmployment } = employmentHistory.spouse;
    const employmentRecords = previousEmployment.map(record => ({
      ...record,
      veteranOrSpouse: 'SPOUSE',
    }));
    history = [...history, ...employmentRecords];
  }

  return history;
};

export const getTotalAssets = ({ assets, realEstateRecords }) => {
  const totVehicles = assets.automobiles
    .map(vehicle => vehicle.resaleValue || 0)
    .reduce((acc, amount) => acc + amount, 0);

  const totRecVehicles = assets.trailersBoatsCampers
    .map(vehicle => vehicle.recreationalVehicleAmount || 0)
    .reduce((acc, amount) => acc + amount, 0);

  const totRealEstate = realEstateRecords
    .map(record => record.realEstateAmount || 0)
    .reduce((acc, amount) => acc + amount, 0);

  const totAssets = Object.values(assets)
    .map(asset => (Number.isInteger(asset) ? asset : null))
    .reduce((acc, amount) => acc + amount, 0);

  const totOtherAssets = assets.otherAssets
    .map(asset => asset.amount || 0)
    .reduce((acc, amount) => acc + amount, 0);

  return (
    totVehicles + totRecVehicles + totAssets + totRealEstate + totOtherAssets
  );
};

export const getIncome = ({ questions, personalData, additionalIncome }) => {
  const { employmentHistory } = personalData;

  const defaultObj = {
    monthlyGrossSalary: null,
    deductions: {
      taxes: null,
      retirement: null,
      socialSecurity: null,
      otherDeductions: {
        name: null,
        amount: null,
      },
    },
    totalDeductions: null,
    netTakeHomePay: null,
    otherIncome: {
      name: null,
      amount: null,
    },
    totalMonthlyNetIncome: null,
  };

  let income = [
    { veteranOrSpouse: 'VETERAN', ...defaultObj },
    { veteranOrSpouse: 'SPOUSE', ...defaultObj },
  ];

  if (questions.vetIsEmployed) {
    income = income.map(item => {
      if (item.veteranOrSpouse === 'VETERAN') {
        return {
          ...item,
          deductions: {
            ...item.deductions,
            otherDeductions: [
              ...employmentHistory.veteran.currentEmployment.deductions,
            ],
          },
          monthlyGrossSalary:
            employmentHistory.veteran.currentEmployment.monthlyGrossSalary,
        };
      }
      return item;
    });
  }

  if (questions.spouseIsEmployed) {
    income = income.map(item => {
      if (item.veteranOrSpouse === 'SPOUSE') {
        return {
          ...item,
          deductions: {
            ...item.deductions,
            otherDeductions: [
              ...employmentHistory.spouse.currentEmployment.deductions,
            ],
          },
          monthlyGrossSalary:
            employmentHistory.spouse.currentEmployment.monthlyGrossSalary,
        };
      }
      return item;
    });
  }

  if (questions.hasAdditionalIncome) {
    income = income.map(item => {
      if (item.veteranOrSpouse === 'VETERAN') {
        return {
          ...item,
          otherIncome: additionalIncome.additionalIncomeRecords,
        };
      }
      return item;
    });
  }

  if (questions.spouseHasAdditionalIncome) {
    income = income.map(item => {
      if (item.veteranOrSpouse === 'SPOUSE') {
        return {
          ...item,
          otherIncome: additionalIncome.spouse.additionalIncomeRecords,
        };
      }
      return item;
    });
  }

  return income;
};
