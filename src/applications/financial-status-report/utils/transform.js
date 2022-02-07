import moment from 'moment';
import {
  sumValues,
  dateFormatter,
  getFsrReason,
  getMonthlyIncome,
  getMonthlyExpenses,
  getEmploymentHistory,
  getTotalAssets,
  filterDeductions,
  otherDeductionsName,
  otherDeductionsAmt,
  nameStr,
} from './helpers';

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
    income,
    socialSecurity,
    benefits,
  } = form.data;

  // deduction filters
  const taxFilters = ['State tax', 'Federal tax', 'Local tax'];
  const retirementFilters = ['401K', 'IRA', 'Pension'];
  const socialSecFilters = ['FICA (Social Security and Medicare)'];
  const allFilters = [...taxFilters, ...retirementFilters, ...socialSecFilters];

  // veteran
  const vetGrossSalary = sumValues(currEmployment, 'veteranGrossSalary');
  const vetAddlInc = sumValues(addlIncRecords, 'amount');
  const vetSocSecAmt = Number(socialSecurity.socialSecAmt ?? 0);
  const vetComp = sumValues(income, 'compensationAndPension');
  const vetEdu = sumValues(income, 'education');
  const vetBenefits = vetComp + vetEdu;
  const vetDeductions = currEmployment?.map(emp => emp.deductions).flat() ?? 0;
  const vetTaxes = filterDeductions(vetDeductions, taxFilters);
  const vetRetirement = filterDeductions(vetDeductions, retirementFilters);
  const vetSocialSec = filterDeductions(vetDeductions, socialSecFilters);
  const vetOther = otherDeductionsAmt(vetDeductions, allFilters);
  const vetTotDeductions = vetTaxes + vetRetirement + vetSocialSec + vetOther;
  const vetOtherIncome = vetAddlInc + vetBenefits + vetSocSecAmt;
  const vetNetIncome = vetGrossSalary - vetTotDeductions;

  // spouse
  const spGrossSalary = sumValues(spCurrEmployment, 'spouseGrossSalary');
  const spAddlInc = sumValues(spAddlIncome, 'amount');
  const spSocialSecAmt = Number(socialSecurity.socialSecAmt ?? 0);
  const spComp = Number(benefits.spouseBenefits.compensationAndPension ?? 0);
  const spEdu = Number(benefits.spouseBenefits.education ?? 0);
  const spBenefits = spComp + spEdu;
  const spDeductions = spCurrEmployment?.map(emp => emp.deductions).flat() ?? 0;
  const spTaxes = filterDeductions(spDeductions, taxFilters);
  const spRetirement = filterDeductions(spDeductions, retirementFilters);
  const spSocialSec = filterDeductions(spDeductions, socialSecFilters);
  const spOtherAmt = otherDeductionsAmt(spDeductions, allFilters);
  const spTotDeductions = spTaxes + spRetirement + spSocialSec + spOtherAmt;
  const spOtherIncome = spAddlInc + spBenefits + spSocialSecAmt;
  const spNetIncome = spGrossSalary - spTotDeductions;

  // generate name strings
  const vetOtherName = nameStr(vetSocSecAmt, vetComp, vetEdu, addlIncRecords);
  const spOtherName = nameStr(spSocialSecAmt, spComp, spEdu, spAddlIncome);
  const vetOtherDeductionsName = otherDeductionsName(vetDeductions, allFilters);
  const spOtherDeductionsName = otherDeductionsName(spDeductions, allFilters);

  const amountCanBePaidTowardDebt = selectedDebts
    .filter(item => item.resolution.offerToPay !== undefined)
    .reduce((acc, debt) => acc + Number(debt.resolution?.offerToPay), 0);

  const totMonthlyNetIncome = getMonthlyIncome(form.data);
  const totMonthlyExpenses = getMonthlyExpenses(form.data);
  const employmentHistory = getEmploymentHistory(form.data);
  const totalAssets = getTotalAssets(form.data);
  const fsrReason = getFsrReason(selectedDebts);

  const submissionObj = {
    personalIdentification: {
      ssn: personalIdentification.ssn,
      fileNumber: personalIdentification.fileNumber,
      fsrReason,
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
      dateOfBirth: moment(dateOfBirth, 'YYYY-MM-DD').format('MM/DD/YYYY'),
      married: questions.isMarried,
      spouseFullName: {
        first: spouseFirst,
        middle: spouseMiddle,
        last: spouseLast,
      },
      agesOfOtherDependents: dependents?.map(dep => dep.dependentAge) ?? [],
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
            amount: vetOther,
          },
        },
        totalDeductions: vetTotDeductions,
        netTakeHomePay: vetNetIncome,
        otherIncome: {
          name: vetOtherName,
          amount: vetOtherIncome,
        },
        totalMonthlyNetIncome: vetNetIncome + vetOtherIncome,
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
            amount: spOtherAmt,
          },
        },
        totalDeductions: spTotDeductions,
        netTakeHomePay: spNetIncome,
        otherIncome: {
          name: spOtherName,
          amount: spOtherIncome,
        },
        totalMonthlyNetIncome: spNetIncome + spOtherIncome,
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
      totalMonthlyExpenses: totMonthlyExpenses,
    },
    discretionaryIncome: {
      netMonthlyIncomeLessExpenses: totMonthlyNetIncome - totMonthlyExpenses,
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
        stateOrProvince: '',
        zipOrPostalCode: '',
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
