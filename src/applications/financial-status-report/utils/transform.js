import { omit } from 'lodash/fp';
import { getMonthlyIncome, getMonthlyExpenses } from '../utils/helpers';

export const transform = ({ data }) => {
  const {
    questions,
    personalData,
    expenses,
    utilityRecords,
    assets,
    installmentContractsAndOtherDebts,
    additionalData,
  } = data;

  const { agesOfOtherDependents, address, employmentHistory } = personalData;

  const totalIncome = getMonthlyIncome(data);
  const totalExpenses = getMonthlyExpenses(data);

  const formObj = {
    personalIdentification: {
      fsrReason: null,
    },
    personalData: {
      ...personalData,
      agesOfOtherDependents: agesOfOtherDependents
        ? agesOfOtherDependents.map(dependent => dependent.dependentAge)
        : null,
      address: {
        street: address.addressLine1,
        city: address.city,
        stateCode: address.stateCode,
        countryName: address.countryName,
        zipCode: address.zipCode,
      },
      married: questions.maritalStatus === 'Married',
      spouseFullName: {
        first: '',
        middle: '',
        last: '',
      },
      employmentHistory: {
        veteran: [
          omit('deductions', employmentHistory.veteran.currentEmployment),
          ...(employmentHistory.veteran.previousEmployment || []),
        ],
        spouse: [
          omit('deductions', employmentHistory.spouse.currentEmployment),
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
      utilities: utilityRecords
        ? utilityRecords
            .map(record => record.monthlyUtilityAmount)
            .reduce((acc, amount) => acc + amount, 0)
        : null,
      other: null,
      installmentContractsAndOtherDebts: null,
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
    additionalData: {
      ...additionalData,
    },
  };

  // console.log('incoming data: ', data);
  // console.log('transformed data: ', formObj);

  return Promise.resolve(JSON.stringify(formObj));
};
