export const transform = ({ data }) => {
  const {
    questions,
    personalData,
    expenses,
    assets,
    installmentContractsAndOtherDebts,
    additionalData,
  } = data;

  const { agesOfOtherDependents, address, employmentHistory } = personalData;

  const formObj = {
    personalData: {
      ...personalData,
      agesOfOtherDependents: agesOfOtherDependents
        ? agesOfOtherDependents.map(item => item.dependentAge)
        : null,
      address: {
        street: address.addressLine1,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
      },
      married: questions.maritalStatus === 'Married',
      spouseFullName: {
        first: '',
        middle: '',
        last: '',
      },
      employmentHistory: {
        veteran: [
          employmentHistory.veteran.currentEmployment,
          ...(employmentHistory.veteran.previousEmployment || []),
        ],
        spouse: [
          employmentHistory.spouse.currentEmployment,
          ...(employmentHistory.spouse.previousEmployment || []),
        ],
      },
    },
    income: {
      veteran: {
        monthlyGrossSalary: null,
        deductions: {
          taxes: null,
          retirement: null,
          socialSecurity: null,
          other: [
            ...(employmentHistory.veteran.currentEmployment.deductions || []),
          ],
        },
        totalDeductions: null,
        netTakeHomePay: null,
        otherIncome: [
          {
            name: null,
            amount: null,
          },
        ],
        totalMonthlyNetIncome: null,
      },
      spouse: {
        monthlyGrossSalary: null,
        deductions: {
          taxes: null,
          retirement: null,
          socialSecurity: null,
          other: [
            ...(employmentHistory.spouse.currentEmployment.deductions || []),
          ],
        },
        totalDeductions: null,
        netTakeHomePay: null,
        otherIncome: [
          {
            name: null,
            amount: null,
          },
        ],
        totalMonthlyNetIncome: null,
      },
    },
    expenses: {
      ...expenses,
    },
    discretionaryIncome: {
      netMonthlyIncomeLessExpenses: null,
      amountCanBePaidTowardDebt: null,
    },
    assets: {
      ...assets,
    },
    installmentContractsAndOtherDebts: [
      ...(installmentContractsAndOtherDebts || []),
    ],
    additionalData: {
      ...additionalData,
    },
  };

  // console.log('incoming data: ', data);
  // console.log('transformed data: ', formObj);

  return Promise.resolve(JSON.stringify(formObj));
};
