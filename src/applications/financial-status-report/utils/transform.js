import {
  getMonthlyIncome,
  getMonthlyExpenses,
  getEmploymentHistory,
} from '../utils/helpers';

export const transform = ({ data }) => {
  const {
    questions,
    personalData,
    expenses,
    otherExpenses,
    utilityRecords,
    assets,
    installmentContractsAndOtherDebts,
    additionalData,
    selectedDebts,
  } = data;

  const { agesOfOtherDependents, address, employmentHistory } = personalData;

  const totalIncome = getMonthlyIncome(data);
  const totalExpenses = getMonthlyExpenses(data);
  const workHistory = getEmploymentHistory(data);

  const formObj = {
    personalIdentification: {
      fsrReason: selectedDebts
        .map(({ resolution }) => resolution.resolutionType)
        .join(', '),
    },
    personalData: {
      ...personalData,
      agesOfOtherDependents: agesOfOtherDependents
        ? agesOfOtherDependents.map(dependent => dependent.dependentAge)
        : null,
      address: {
        addresslineOne: address.addressLine1,
        addresslineTwo: address.addressLine2,
        addresslineThree: address.addressLine3,
        city: address.city,
        stateOrProvince: address.stateCode,
        zipOrPostalCode: address.zipCode,
        countryName: address.countryCodeIso3,
      },
      married: questions.maritalStatus === 'Married',
      spouseFullName: {
        first: null,
        middle: null,
        last: null,
      },
      employmentHistory: workHistory,
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
      utilities: utilityRecords
        ? utilityRecords
            .map(record => record.monthlyUtilityAmount)
            .reduce((acc, amount) => acc + amount, 0)
        : null,
      otherLivingExpenses: otherExpenses,
      expensesInstallmentContractsAndOtherDebts: null,
      totalMonthlyExpenses: totalExpenses,
    },
    discretionaryIncome: {
      netMonthlyIncomeLessExpenses: totalIncome - totalExpenses,
      amountCanBePaidTowardDebt: null,
    },
    assets: {
      ...assets,
    },
    installmentContractsAndOtherDebts: [
      ...(installmentContractsAndOtherDebts || []),
    ],
    totalOfInstallmentContractsAndOtherDebts: {
      originalAmount: installmentContractsAndOtherDebts.reduce(
        (acc, debt) => acc + debt.originalAmount,
        0,
      ),
      unpaidBalance: installmentContractsAndOtherDebts.reduce(
        (acc, debt) => acc + debt.unpaidBalance,
        0,
      ),
      amountDueMonthly: installmentContractsAndOtherDebts.reduce(
        (acc, debt) => acc + debt.amountDueMonthly,
        0,
      ),
      amountPastDue: installmentContractsAndOtherDebts.reduce(
        (acc, debt) => acc + debt.amountPastDue,
        0,
      ),
    },
    additionalData: {
      ...additionalData,
    },
  };

  // console.log('incoming data: ', data);
  // console.log('transformed data: ', formObj);

  return Promise.resolve(JSON.stringify(formObj));
};
