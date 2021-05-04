import moment from 'moment';
import {
  dateFormatter,
  getIncome,
  getMonthlyIncome,
  getMonthlyExpenses,
  getEmploymentHistory,
  getTotalAssets,
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
    realEstateRecords,
  } = data;

  const totalIncome = getMonthlyIncome(data);
  const totalExpenses = getMonthlyExpenses(data);
  const employmentHistory = getEmploymentHistory(data);
  const totalAssets = getTotalAssets(data);
  const income = getIncome(data);

  const totalAmountCanBePaidTowardDebt = selectedDebts
    .filter(item => item.resolution.offerToPay !== undefined)
    .reduce((acc, debt) => acc + Number(debt.resolution?.offerToPay), 0);

  const formObj = {
    personalIdentification: {
      fileNumber: '',
      fsrReason: selectedDebts
        .map(({ resolution }) => resolution.resolutionType)
        .join(', '),
    },
    personalData: {
      veteranFullName: {
        first: personalData.veteranFullName.first || '',
        middle: personalData.veteranFullName.middle || '',
        last: personalData.veteranFullName.last || '',
      },
      agesOfOtherDependents: personalData.agesOfOtherDependents
        ? personalData.agesOfOtherDependents.map(
            dependent => dependent.dependentAge,
          )
        : [],
      address: {
        addresslineOne: personalData.address.street,
        addresslineTwo: personalData.address.street2 || '',
        addresslineThree: '',
        city: personalData.address.city,
        stateOrProvince: personalData.address.state,
        zipOrPostalCode: personalData.address.postalCode,
        countryName: personalData.address.country,
      },
      married: questions.isMarried,
      spouseFullName: {
        first: personalData.spouseFullName.first || '',
        middle: '',
        last: personalData.spouseFullName.last || '',
      },
      employmentHistory,
      telephoneNumber: personalData.telephoneNumber,
      dateOfBirth: moment(personalData.dateOfBirth).format('MM/DD/YYYY'),
    },
    income,
    expenses: {
      ...expenses,
      utilities: utilityRecords?.reduce(
        (acc, record) => acc + record.monthlyUtilityAmount || 0,
        0,
      ),
      otherLivingExpenses: {
        name: otherExpenses?.map(expense => expense.name).join(', '),
        amount: otherExpenses?.reduce(
          (acc, expense) => acc + expense.amount || 0,
          0,
        ),
      },
      expensesInstallmentContractsAndOtherDebts: installmentContractsAndOtherDebts?.reduce(
        (acc, debt) => acc + debt.amountDueMonthly || 0,
        0,
      ),
      totalMonthlyExpenses: totalExpenses,
    },
    discretionaryIncome: {
      netMonthlyIncomeLessExpenses: totalIncome - totalExpenses,
      amountCanBePaidTowardDebt: totalAmountCanBePaidTowardDebt,
    },
    assets: {
      ...assets,
      trailersBoatsCampers: assets.trailersBoatsCampers?.reduce(
        (acc, record) => acc + record.recreationalVehicleAmount || 0,
        0,
      ),
      realEstateOwned: realEstateRecords?.reduce(
        (acc, record) => acc + record.realEstateAmount || 0,
        0,
      ),
      totalAssets,
    },
    installmentContractsAndOtherDebts: installmentContractsAndOtherDebts?.map(
      debt => ({
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
      }),
    ),
    totalOfInstallmentContractsAndOtherDebts: {
      originalAmount: installmentContractsAndOtherDebts?.reduce(
        (acc, debt) => acc + debt.originalAmount || 0,
        0,
      ),
      unpaidBalance: installmentContractsAndOtherDebts?.reduce(
        (acc, debt) => acc + debt.unpaidBalance || 0,
        0,
      ),
      amountDueMonthly: installmentContractsAndOtherDebts?.reduce(
        (acc, debt) => acc + debt.amountDueMonthly || 0,
        0,
      ),
      amountPastDue: installmentContractsAndOtherDebts?.reduce(
        (acc, debt) => acc + debt.amountPastDue || 0,
        0,
      ),
    },
    additionalData: {
      ...additionalData,
      bankruptcy: {
        ...additionalData.bankruptcy,
        hasBeenAdjudicatedBankrupt: questions.hasBeenAdjudicatedBankrupt,
        dateDischarged: dateFormatter(additionalData.bankruptcy.dateDischarged),
      },
    },
  };

  const convertIntegerToString = (key, value) => {
    return typeof value === 'number' ? value.toString() : value;
  };

  return JSON.stringify(formObj, convertIntegerToString);
};
