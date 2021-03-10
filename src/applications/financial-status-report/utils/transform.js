export const transform = ({ data }) => {
  // console.log('incoming transform data: ', data);

  const {
    personalData,
    expenses,
    assets,
    installmentContractsAndOtherDebts,
    additionalData,
  } = data;

  const formObj = {
    personalData: {
      ...personalData,
      agesOfOtherDependents: data.personalData.agesOfOtherDependents.map(
        item => item.dependentAge,
      ),
      address: {
        street: personalData.address.addressLine1,
        city: personalData.address.city,
        state: personalData.address.state,
        country: personalData.address.country,
        postalCode: personalData.address.postalCode,
      },
      married: data.questions.maritalStatus === 'Married',
      spouseFullName: {
        first: '',
        middle: '',
        last: '',
      },
      employmentHistory: {
        veteran: [
          personalData.employmentHistory.veteran.currentEmployment,
          ...personalData.employmentHistory.veteran.previousEmployment,
        ],
        spouse: [
          personalData.employmentHistory.spouse.currentEmployment,
          ...personalData.employmentHistory.spouse.previousEmployment,
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
            {
              deductionName: null,
              deductionAmount: null,
            },
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
      spouse: {},
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
    installmentContractsAndOtherDebts: [...installmentContractsAndOtherDebts],
    additionalData: {
      ...additionalData,
    },
  };

  // console.log('formObj: ', formObj);

  return Promise.resolve(JSON.stringify(formObj));
};
