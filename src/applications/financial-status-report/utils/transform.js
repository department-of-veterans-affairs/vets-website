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

  const formObj = {
    personalIdentification: {
      fsrReason: selectedDebts
        .map(({ resolution }) => resolution.resolutionType)
        .join(', '),
    },
    personalData: {
      veteranFullName: personalData.veteranFullName,
      agesOfOtherDependents: personalData.agesOfOtherDependents
        ? personalData.agesOfOtherDependents.map(
            dependent => dependent.dependentAge,
          )
        : [],
      address: {
        addresslineOne: personalData.address.addressLine1,
        addresslineTwo: personalData.address.addressLine2,
        addresslineThree: '',
        city: personalData.address.city,
        stateOrProvince: personalData.address.stateCode,
        zipOrPostalCode: personalData.address.zipCode,
        countryName: personalData.address.countryCodeIso3,
      },
      married: questions.maritalStatus === 'Married',
      spouseFullName: {
        first: personalData.spouseFullName.first,
        middle: '',
        last: personalData.spouseFullName.last,
      },
      employmentHistory,
      telephoneNumber: personalData.telephoneNumber,
      dateOfBirth: moment(personalData.dateOfBirth).format('MM/DD/YYYY'),
    },
    income,
    expenses: {
      ...expenses,
      utilities: utilityRecords
        ?.map(record => record.monthlyUtilityAmount || 0)
        .reduce((acc, amount) => acc + amount, 0),
      otherLivingExpenses: otherExpenses,
      expensesInstallmentContractsAndOtherDebts: installmentContractsAndOtherDebts?.reduce(
        (acc, debt) => acc + debt.amountDueMonthly,
        0,
      ),
      totalMonthlyExpenses: totalExpenses,
    },
    discretionaryIncome: {
      netMonthlyIncomeLessExpenses: totalIncome - totalExpenses,
      amountCanBePaidTowardDebt: selectedDebts
        ?.map(debt => debt.resolution.offerToPay || 0)
        .reduce((acc, offer) => acc + offer, 0),
    },
    assets: {
      ...assets,
      trailersBoatsCampers: assets.trailersBoatsCampers
        ?.map(record => record.recreationalVehicleAmount || 0)
        .reduce((acc, amount) => acc + amount, 0),
      realEstateOwned: realEstateRecords
        ?.map(record => record.realEstateAmount || 0)
        .reduce((acc, amount) => acc + amount, 0),
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
        dateDischarged: dateFormatter(additionalData.bankruptcy.dateDischarged),
      },
    },
  };

  // console.log('incoming data: ', data);
  // console.log('transformed data: ', formObj);

  return Promise.resolve(JSON.stringify(formObj));
};
