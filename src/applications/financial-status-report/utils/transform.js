import moment from 'moment';
import {
  sumValues,
  dateFormatter,
  getMonthlyIncome,
  getMonthlyExpenses,
  getEmploymentHistory,
  getTotalAssets,
  filterDeductions,
  otherDeductionsName,
  otherDeductionsAmt,
} from '../utils/helpers';

export const transform = (formConfig, form) => {
  const {
    questions,
    personalIdentification,
    personalData: {
      veteranFullName: {
        first: vetFirst = '',
        middle: vetMiddle = '',
        last: vetLast = '',
      },
      spouseFullName: {
        first: spouseFirst = '',
        middle: spouseMiddle = '',
        last: spouseLast = '',
      },
      address: {
        street,
        street2 = '',
        street3 = '',
        city,
        state,
        postalCode,
        country,
      },
      telephoneNumber,
      dateOfBirth,
      dependents,
    },
    expenses,
    otherExpenses,
    utilityRecords,
    assets,
    installmentContracts,
    additionalData,
    selectedDebts,
    realEstateRecords,
    currEmployment,
    spCurrEmployment,
    additionalIncome: {
      addlIncRecords,
      spouse: { spAddlIncome },
    },
  } = form.data;

  const amountCanBePaidTowardDebt = selectedDebts
    .filter(item => item.resolution.offerToPay !== undefined)
    .reduce((acc, debt) => acc + Number(debt.resolution?.offerToPay), 0);

  const monthlyIncome = getMonthlyIncome(form.data);
  const monthlyExpenses = getMonthlyExpenses(form.data);
  const employmentHistory = getEmploymentHistory(form.data);
  const totalAssets = getTotalAssets(form.data);

  // veteran income
  const vetGrossSalary = sumValues(currEmployment, 'veteranGrossSalary');
  const deductions = currEmployment?.map(emp => emp.deductions).flat() ?? 0;
  const vetTotDeductions = sumValues(deductions, 'amount');
  const vetNetPay = vetGrossSalary - vetTotDeductions;
  const vetOtherAmt = sumValues(addlIncRecords, 'amount');
  const vetOtherName = addlIncRecords?.map(({ name }) => name).join(', ') ?? '';

  // spouse income
  const spGrossSalary = sumValues(spCurrEmployment, 'spouseGrossSalary');
  const spDeductions = spCurrEmployment?.map(emp => emp.deductions).flat() ?? 0;
  const spTotDeductions = sumValues(spDeductions, 'amount');
  const spNetPay = spGrossSalary - spTotDeductions;
  const spOtherAmt = sumValues(spAddlIncome, 'amount');
  const spOtherName = spAddlIncome?.map(({ name }) => name).join(', ') ?? '';

  // deduction filters
  const taxFilters = ['State tax', 'Federal tax', 'Local tax'];
  const retirementFilters = ['401K', 'IRA', 'Pension'];
  const socialSecFilters = ['FICA (Social Security and Medicare)'];
  const allFilters = [...taxFilters, ...retirementFilters, ...socialSecFilters];

  // veteran deductions
  const vetTaxes = filterDeductions(deductions, taxFilters);
  const vetRetirement = filterDeductions(deductions, retirementFilters);
  const vetSocialSec = filterDeductions(deductions, socialSecFilters);
  const vetOtherDeductionsName = otherDeductionsName(deductions, allFilters);
  const vetOtherDeductionsAmt = otherDeductionsAmt(deductions, allFilters);

  // spouse deductions
  const spTaxes = filterDeductions(spDeductions, taxFilters);
  const spRetirement = filterDeductions(spDeductions, retirementFilters);
  const spSocialSec = filterDeductions(spDeductions, socialSecFilters);
  const spOtherDeductionsName = otherDeductionsName(spDeductions, allFilters);
  const spOtherDeductionsAmt = otherDeductionsAmt(spDeductions, allFilters);

  const submissionObj = {
    personalIdentification: {
      ssn: personalIdentification.ssn,
      fileNumber: personalIdentification.fileNumber,
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
      telephoneNumber,
      dateOfBirth: moment(dateOfBirth).format('MM/DD/YYYY'),
      married: questions.isMarried,
      spouseFullName: {
        first: spouseFirst,
        middle: spouseMiddle,
        last: spouseLast,
      },
      agesOfOtherDependents:
        dependents?.map(dependent => dependent.dependentAge) ?? [],
      employmentHistory,
    },
    income: [
      {
        veteranOrSpouse: 'VETERAN',
        monthlyGrossSalary: vetGrossSalary,
        deductions: {
          taxes: vetTaxes,
          retirement: vetRetirement,
          socialSecurity: vetSocialSec,
          otherDeductions: {
            name: vetOtherDeductionsName,
            amount: vetOtherDeductionsAmt,
          },
        },
        totalDeductions: vetTotDeductions,
        netTakeHomePay: vetNetPay,
        otherIncome: {
          name: vetOtherName,
          amount: vetOtherAmt,
        },
        totalMonthlyNetIncome: vetNetPay + vetOtherAmt,
      },
      {
        veteranOrSpouse: 'SPOUSE',
        monthlyGrossSalary: spGrossSalary,
        deductions: {
          taxes: spTaxes,
          retirement: spRetirement,
          socialSecurity: spSocialSec,
          otherDeductions: {
            name: spOtherDeductionsName,
            amount: spOtherDeductionsAmt,
          },
        },
        totalDeductions: spTotDeductions,
        netTakeHomePay: spNetPay,
        otherIncome: {
          name: spOtherName,
          amount: spOtherAmt,
        },
        totalMonthlyNetIncome: spNetPay + spOtherAmt,
      },
    ],
    expenses: {
      rentOrMortgage: expenses.rentOrMortgage,
      food: expenses.food,
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
      bankruptcy: {
        hasBeenAdjudicatedBankrupt: questions.hasBeenAdjudicatedBankrupt,
        dateDischarged: dateFormatter(additionalData.bankruptcy.dateDischarged),
        courtLocation: additionalData.bankruptcy.courtLocation,
        docketNumber: additionalData.bankruptcy.docketNumber,
      },
      additionalComments: additionalData.additionalComments,
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
