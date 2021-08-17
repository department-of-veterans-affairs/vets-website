import moment from 'moment';
import {
  dateFormatter,
  getIncome,
  getMonthlyIncome,
  getMonthlyExpenses,
  getEmploymentHistory,
  getTotalAssets,
  sumValues,
} from '../utils/helpers';

export const transform = (formConfig, form) => {
  const {
    questions,
    personalData,
    expenses,
    otherExpenses,
    utilityRecords,
    assets,
    installmentContracts,
    additionalData,
    selectedDebts,
    realEstateRecords,
  } = form.data;

  const {
    first: vetFirst = '',
    middle: vetMiddle = '',
    last: vetLast = '',
  } = personalData.veteranFullName;

  const {
    first: spouseFirst = '',
    middle: spouseMiddle = '',
    last: spouseLast = '',
  } = personalData.spouseFullName;

  const {
    street,
    street2 = '',
    street3 = '',
    city,
    state,
    postalCode,
    country,
  } = personalData.address;

  const monthlyIncome = getMonthlyIncome(form.data);
  const monthlyExpenses = getMonthlyExpenses(form.data);
  const employmentHistory = getEmploymentHistory(form.data);
  const totalAssets = getTotalAssets(form.data);
  const income = getIncome(form.data);

  const amountCanBePaidTowardDebt = selectedDebts
    .filter(item => item.resolution.offerToPay !== undefined)
    .reduce((acc, debt) => acc + Number(debt.resolution?.offerToPay), 0);

  const submissionObj = {
    personalIdentification: {
      fileNumber: '',
      fsrReason: selectedDebts
        .map(({ resolution }) => resolution.resolutionType)
        .join(', '),
    },
    personalData: {
      veteranFullName: {
        first: vetFirst,
        middle: vetMiddle,
        last: vetLast,
      },
      address: {
        addresslineOne: street,
        addresslineTwo: street2,
        addresslineThree: street3,
        city,
        stateOrProvince: state,
        zipOrPostalCode: postalCode,
        countryName: country,
      },
      telephoneNumber: personalData.telephoneNumber,
      dateOfBirth: moment(personalData.dateOfBirth).format('MM/DD/YYYY'),
      married: questions.isMarried,
      spouseFullName: {
        first: spouseFirst,
        middle: spouseMiddle,
        last: spouseLast,
      },
      agesOfOtherDependents: personalData.dependents
        ? personalData.dependents.map(dependent => dependent.dependentAge)
        : [],
      employmentHistory,
    },
    income,
    expenses: {
      ...expenses,
      utilities: sumValues(utilityRecords, 'monthlyUtilityAmount'),
      otherLivingExpenses: {
        name: otherExpenses?.map(expense => expense.name).join(', '),
        amount: sumValues(otherExpenses, 'amount'),
      },
      expensesInstallmentContractsAndOtherDebts: sumValues(
        installmentContracts,
        'amountDueMonthly',
      ),
      totalMonthlyExpenses: monthlyExpenses,
    },
    discretionaryIncome: {
      netMonthlyIncomeLessExpenses: monthlyIncome - monthlyExpenses,
      amountCanBePaidTowardDebt,
    },
    assets: {
      cashInBank: assets.cashInBank,
      cashOnHand: assets.cashOnHand,
      automobiles: assets.automobiles,
      trailersBoatsCampers: sumValues(assets.recVehicles, 'recVehicleAmount'),
      usSavingsBonds: assets.usSavingsBonds,
      stocksAndOtherBonds: assets.stocksAndOtherBonds,
      realEstateOwned: sumValues(realEstateRecords, 'realEstateAmount'),
      otherAssets: assets.otherAssets,
      totalAssets,
    },
    installmentContractsAndOtherDebts: installmentContracts?.map(debt => ({
      ...debt,
      dateStarted: dateFormatter(debt.dateStarted),
      creditorAddress: {
        addresslineOne: '',
        addresslineTwo: '',
        addresslineThree: '',
        city: '',
        stateORProvince: '',
        zipORPostalCode: '',
        countryName: '',
      },
    })),
    totalOfInstallmentContractsAndOtherDebts: {
      originalAmount: sumValues(installmentContracts, 'originalAmount'),
      unpaidBalance: sumValues(installmentContracts, 'unpaidBalance'),
      amountDueMonthly: sumValues(installmentContracts, 'amountDueMonthly'),
      amountPastDue: sumValues(installmentContracts, 'amountPastDue'),
    },
    additionalData: {
      ...additionalData,
      bankruptcy: {
        ...additionalData.bankruptcy,
        hasBeenAdjudicatedBankrupt: questions.hasBeenAdjudicatedBankrupt,
        dateDischarged: dateFormatter(additionalData.bankruptcy.dateDischarged),
      },
    },
    applicantCertifications: {
      veteranSignature: `${vetFirst} ${vetMiddle} ${vetLast}`,
      veteranDateSigned: moment().format('MM/DD/YYYY'),
    },
  };

  // calculated values should formatted then converted to string
  // input values use form validation and are formatted correctly
  const convertIntegerToString = (key, value) => {
    return typeof value === 'number' ? value.toFixed(2).toString() : value;
  };

  return JSON.stringify(submissionObj, convertIntegerToString);
};
