import moment from 'moment';
import {
  sumValues,
  dateFormatter,
  getFsrReason,
  getMonthlyIncome,
  getMonthlyExpenses,
  getEmploymentHistory,
  getTotalAssets,
  otherDeductionsName,
  otherDeductionsAmt,
  nameStr,
  getAmountCanBePaidTowardDebt,
  mergeAdditionalComments,
  filterReduceByName,
} from './helpers';
import { getFormattedPhone } from './contactInformation';

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
      } = {},
      telephoneNumber,
      dateOfBirth,
      dependents,
      employmentHistory: {
        veteran: { employmentRecords = [] },
        spouse: { spEmploymentRecords = [] },
      },
      veteranContactInformation: { address = {}, mobilePhone = {} } = {},
    },
    expenses: {
      creditCardBills = [],
      expenseRecords = [],
      food = 0,
      rentOrMortgage = 0,
    },
    otherExpenses = [],
    utilityRecords,
    assets,
    installmentContracts = [],
    additionalData,
    selectedDebtsAndCopays = [],
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

  // enhanced fsr flag
  const enhancedFSRActive = form.data['view:enhancedFinancialStatusReport'];

  const taxFilters = ['State tax', 'Federal tax', 'Local tax'];
  const retirementFilters = ['401K', 'IRA', 'Pension'];
  const socialSecFilters = ['FICA (Social Security and Medicare)'];
  const allFilters = [...taxFilters, ...retirementFilters, ...socialSecFilters];

  // veteran
  const vetGrossSalary = enhancedFSRActive
    ? sumValues(employmentRecords, 'grossMonthlyIncome')
    : sumValues(currEmployment, 'veteranGrossSalary');
  const vetAddlInc = sumValues(addlIncRecords, 'amount');
  const vetSocSecAmt = !enhancedFSRActive
    ? Number(socialSecurity.socialSecAmt?.replaceAll(/[^0-9.-]/g, '') ?? 0)
    : 0;
  const vetComp = sumValues(income, 'compensationAndPension');
  const vetEdu = sumValues(income, 'education');
  const vetBenefits = vetComp + vetEdu;
  const vetDeductions = enhancedFSRActive
    ? employmentRecords
        ?.filter(emp => emp.isCurrent)
        .map(emp => emp.deductions)
        .flat() ?? 0
    : currEmployment?.map(emp => emp.deductions).flat() ?? 0;
  const vetTaxes = filterReduceByName(vetDeductions, taxFilters);
  const vetRetirement = filterReduceByName(vetDeductions, retirementFilters);
  const vetSocialSec = filterReduceByName(vetDeductions, socialSecFilters);
  const vetOther = otherDeductionsAmt(vetDeductions, allFilters);
  const vetTotDeductions = vetTaxes + vetRetirement + vetSocialSec + vetOther;
  const vetOtherIncome = vetAddlInc + vetBenefits + vetSocSecAmt;
  const vetNetIncome = vetGrossSalary - vetTotDeductions;

  // spouse
  const spGrossSalary = enhancedFSRActive
    ? sumValues(spEmploymentRecords, 'grossMonthlyIncome')
    : sumValues(spCurrEmployment, 'spouseGrossSalary');
  const spAddlInc = sumValues(spAddlIncome, 'amount');
  const spSocialSecAmt = !enhancedFSRActive
    ? Number(
        socialSecurity.spouse?.socialSecAmt?.replaceAll(/[^0-9.-]/g, '') ?? 0,
      )
    : 0;
  const spComp = Number(
    benefits.spouseBenefits.compensationAndPension?.replaceAll(',', '') ?? 0,
  );
  const spEdu = Number(
    benefits.spouseBenefits.education?.replaceAll(/[^0-9.-]/g, '') ?? 0,
  );
  const spBenefits = spComp + spEdu;
  const spDeductions = enhancedFSRActive
    ? spEmploymentRecords
        ?.filter(emp => emp.isCurrent)
        .map(emp => emp.deductions)
        .flat() ?? 0
    : spCurrEmployment?.map(emp => emp.deductions).flat() ?? 0;
  const spTaxes = filterReduceByName(spDeductions, taxFilters);
  const spRetirement = filterReduceByName(spDeductions, retirementFilters);
  const spSocialSec = filterReduceByName(spDeductions, socialSecFilters);
  const spOtherAmt = otherDeductionsAmt(spDeductions, allFilters);
  const spTotDeductions = spTaxes + spRetirement + spSocialSec + spOtherAmt;
  const spOtherIncome = spAddlInc + spBenefits + spSocialSecAmt;
  const spNetIncome = spGrossSalary - spTotDeductions;

  // === expenses ===
  // rent & mortgage expenses for box 18
  const rentOrMortgageExpenses = expenseRecords.filter(
    expense => expense.name === 'Rent' || expense.name === 'Mortgage payment',
  ) || { amount: 0 };

  // food expenses for box 19
  const foodExpenses = otherExpenses?.find(expense =>
    expense?.name?.includes('Food'),
  ) || { amount: 0 };

  // other living expenses box 21
  // Including options from expoenseRecords (living expenses) w/o rent & mortgage
  const filteredExpenses = [
    ...otherExpenses?.filter(
      expense => expense?.name?.toLowerCase().includes('food') === false,
    ),
    ...expenseRecords.filter(
      expense =>
        expense?.name !== 'Rent' && expense?.name !== 'Mortgage payment',
    ),
  ];

  const installmentContractsAndCreditCards = [
    ...installmentContracts,
    ...creditCardBills,
  ];

  // generate name strings
  const vetOtherName = nameStr(vetSocSecAmt, vetComp, vetEdu, addlIncRecords);
  const spOtherName = nameStr(spSocialSecAmt, spComp, spEdu, spAddlIncome);
  const vetOtherDeductionsName = otherDeductionsName(vetDeductions, allFilters);
  const spOtherDeductionsName = otherDeductionsName(spDeductions, allFilters);

  // get monthly totals
  const totMonthlyNetIncome = getMonthlyIncome(form.data);
  const totMonthlyExpenses = getMonthlyExpenses(form.data);
  const employmentHistory = getEmploymentHistory(form.data);
  const totalAssets = getTotalAssets(form.data);

  // monetary asset filters
  const cashFilters = ['Cash'];
  const bankFilters = ['Checking accounts', 'Savings accounts'];
  const usSavingsFilters = ['U.S. Savings Bonds'];
  const otherStocksFilters = [
    'Other stocks and bonds (not in your retirement accounts)',
    'Retirement accounts (401k, IRAs, 403b, TSP)',
    'Pension',
    'Cryptocurrency',
  ];

  // monetary assets
  const { monetaryAssets } = assets;
  const calculatedCashOnHand = filterReduceByName(monetaryAssets, cashFilters);
  const calculatedCashInBank = filterReduceByName(monetaryAssets, bankFilters);
  const calculatedUsSavingsBonds = filterReduceByName(
    monetaryAssets,
    usSavingsFilters,
  );
  const calculatedStocksAndOther = filterReduceByName(
    monetaryAssets,
    otherStocksFilters,
  );

  // combined fsr options
  const fsrReason = getFsrReason(selectedDebtsAndCopays);
  const amountCanBePaidTowardDebt = getAmountCanBePaidTowardDebt(
    selectedDebtsAndCopays,
  );
  // handle dependents
  const enhancedDependent =
    enhancedFSRActive && questions?.hasDependents > 0
      ? dependents
          ?.slice(0, parseInt(questions.hasDependents, 10))
          .map(dep => dep.dependentAge)
      : [];
  const standardDependents = dependents?.map(dep => dep.dependentAge) ?? [];

  // Contact Information
  const submitAddress = {
    addresslineOne: enhancedFSRActive ? address.addressLine1 : street,
    addresslineTwo: enhancedFSRActive ? address.addressLine2 || '' : street2,
    addresslineThree: enhancedFSRActive ? address.addressLine3 || '' : street3,
    city: enhancedFSRActive ? address.city : city,
    stateOrProvince: enhancedFSRActive ? address.stateCode : state,
    zipOrPostalCode: enhancedFSRActive ? address.zipCode : postalCode,
    countryName: enhancedFSRActive ? address.countryCodeIso2 : country,
  };
  const submitPhone = enhancedFSRActive
    ? getFormattedPhone(mobilePhone)
    : telephoneNumber;

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
        addresslineOne: submitAddress.addresslineOne,
        addresslineTwo: submitAddress.addresslineTwo,
        addresslineThree: submitAddress.addresslineThree,
        city: submitAddress.city,
        stateOrProvince: submitAddress.stateOrProvince,
        zipOrPostalCode: submitAddress.zipOrPostalCode,
        countryName: submitAddress.countryName,
      },
      telephoneNumber: submitPhone,
      dateOfBirth: moment(dateOfBirth, 'YYYY-MM-DD').format('MM/DD/YYYY'),
      married: questions.isMarried,
      spouseFullName: {
        first: spouseFirst,
        middle: spouseMiddle,
        last: spouseLast,
      },
      agesOfOtherDependents: enhancedFSRActive
        ? enhancedDependent
        : standardDependents,
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
      rentOrMortgage: enhancedFSRActive
        ? sumValues(rentOrMortgageExpenses, 'amount')
        : rentOrMortgage,
      food: enhancedFSRActive ? foodExpenses?.amount : food,
      utilities: enhancedFSRActive
        ? sumValues(utilityRecords, 'amount')
        : sumValues(utilityRecords, 'monthlyUtilityAmount'),
      otherLivingExpenses: {
        name: enhancedFSRActive
          ? filteredExpenses?.map(expense => expense.name).join(', ')
          : otherExpenses?.map(expense => expense.name).join(', '),
        amount: enhancedFSRActive
          ? sumValues(filteredExpenses, 'amount')
          : sumValues(otherExpenses, 'amount'),
      },
      expensesInstallmentContractsAndOtherDebts: sumValues(
        installmentContractsAndCreditCards,
        'amountDueMonthly',
      ),
      totalMonthlyExpenses: totMonthlyExpenses,
    },
    discretionaryIncome: {
      netMonthlyIncomeLessExpenses: totMonthlyNetIncome - totMonthlyExpenses,
      amountCanBePaidTowardDebt,
    },
    assets: {
      cashInBank: enhancedFSRActive ? calculatedCashInBank : assets.cashInBank,
      cashOnHand: enhancedFSRActive ? calculatedCashOnHand : assets.cashOnHand,
      automobiles: assets.automobiles,
      trailersBoatsCampers: sumValues(assets.recVehicles, 'recVehicleAmount'),
      usSavingsBonds: enhancedFSRActive
        ? calculatedUsSavingsBonds
        : assets.usSavingsBonds,
      stocksAndOtherBonds: enhancedFSRActive
        ? calculatedStocksAndOther
        : assets.stocksAndOtherBonds,
      realEstateOwned: !enhancedFSRActive
        ? sumValues(realEstateRecords, 'realEstateAmount')
        : Number(assets.realEstateValue?.replaceAll(/[^0-9.-]/g, '') ?? 0),
      otherAssets: assets.otherAssets,
      totalAssets,
    },
    installmentContractsAndOtherDebts: installmentContractsAndCreditCards?.map(
      debt => ({
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
      }),
    ),
    totalOfInstallmentContractsAndOtherDebts: {
      originalAmount: sumValues(
        installmentContractsAndCreditCards,
        'originalAmount',
      ),
      unpaidBalance: sumValues(
        installmentContractsAndCreditCards,
        'unpaidBalance',
      ),
      amountDueMonthly: sumValues(
        installmentContractsAndCreditCards,
        'amountDueMonthly',
      ),
      amountPastDue: sumValues(
        installmentContractsAndCreditCards,
        'amountPastDue',
      ),
    },
    additionalData: {
      bankruptcy: {
        hasBeenAdjudicatedBankrupt: questions.hasBeenAdjudicatedBankrupt,
        dateDischarged: dateFormatter(additionalData.bankruptcy.dateDischarged),
        courtLocation: additionalData.bankruptcy.courtLocation,
        docketNumber: additionalData.bankruptcy.docketNumber,
      },
      additionalComments: mergeAdditionalComments(
        additionalData.additionalComments,
        enhancedFSRActive ? filteredExpenses : otherExpenses,
      ),
    },
    applicantCertifications: {
      veteranSignature: `${vetFirst} ${vetMiddle} ${vetLast}`,
      veteranDateSigned: moment().format('MM/DD/YYYY'),
    },
    selectedDebtsAndCopays: [...selectedDebtsAndCopays],
  };

  // calculated values should formatted then converted to string
  // input values use form validation and are formatted correctly
  const convertIntegerToString = (key, value) => {
    return typeof value === 'number' ? value.toFixed(2).toString() : value;
  };

  return JSON.stringify(submissionObj, convertIntegerToString);
};
