import * as Sentry from '@sentry/browser';
import { formatDateShort } from 'platform/utilities/date';
import { isValid } from 'date-fns';
import {
  isStreamlinedShortForm,
  isStreamlinedLongForm,
} from './streamlinedDepends';
import {
  sumValues,
  monthYearFormatter,
  getFsrReason,
  getEmploymentHistory,
  getTotalAssets,
  getAmountCanBePaidTowardDebt,
  mergeAdditionalComments,
  filterReduceByName,
} from './helpers';
import { getMonthlyIncome } from './calculateIncome';
import { getMonthlyExpenses, getAllExpenses } from './calculateExpenses';
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
      dateOfBirth,
      dependents,
      veteranContactInformation: { address = {}, mobilePhone = {} } = {},
    },
    assets,
    additionalData,
    selectedDebtsAndCopays = [],
  } = form.data;

  try {
    const isShortStreamlined = isStreamlinedShortForm(form.data);
    const isLongStreamlined = isStreamlinedLongForm(form.data);

    // === Date of Birth ===
    const birthDate = new Date(dateOfBirth.replace(/-/g, '/'));
    const formattedBirthDate = isValid(birthDate)
      ? formatDateShort(birthDate)
      : '';

    // === Set Streamlined FSR flag ===
    let streamlinedData;
    if (isShortStreamlined) {
      streamlinedData = {
        value: true,
        type: 'short',
      };
    } else if (isLongStreamlined) {
      streamlinedData = {
        value: true,
        type: 'long',
      };
    } else {
      streamlinedData = {
        value: false,
        type: 'none', // not streamlined
      };
    }

    // === Income ===
    // Extract the values from getMonthlyIncome
    const { vetIncome, spIncome, totalMonthlyNetIncome } = getMonthlyIncome(
      form.data,
    );

    // === Expenses ===
    const totalMonthlyExpenses = getMonthlyExpenses(form.data);

    // Extract the values from getMonthlyExpenses
    const {
      food,
      rentOrMortgage,
      utilities,
      otherLivingExpenses,
      filteredExpenses,
      installmentContractsAndCreditCards,
      expensesInstallmentContractsAndOtherDebts,
    } = getAllExpenses(form.data);

    const employmentHistory = getEmploymentHistory(form.data);
    const totalAssets = getTotalAssets(form.data);

    // monetary asset filters
    const cashFilters = ['Cash', 'Cash on hand (not in bank)'];
    const bankFilters = [
      'Checking accounts',
      'Savings accounts',
      'Cash in a bank (savings and checkings)',
    ];
    const usSavingsFilters = ['U.S. Savings Bonds'];
    const otherStocksFilters = [
      'Other stocks and bonds (not in your retirement accounts)',
      'Retirement accounts (401k, IRAs, 403b, TSP)',
      'Pension',
      'Cryptocurrency',
    ];

    // monetary assets
    const { monetaryAssets } = assets;
    // Cash on hand is stored separately for potential short forms until streamlined asset update
    // Same conditions for the cash on hand page depends
    const cashFilteredMonetaryAssets = filterReduceByName(
      monetaryAssets,
      cashFilters,
    );

    const calculatedCashOnHand = cashFilteredMonetaryAssets;

    const calculatedCashInBank = filterReduceByName(
      monetaryAssets,
      bankFilters,
    );

    const calculatedUsSavingsBonds = filterReduceByName(
      monetaryAssets,
      usSavingsFilters,
    );
    const calculatedStocksAndOther = filterReduceByName(
      monetaryAssets,
      otherStocksFilters,
    );
    const calculateRealEstateOwned = () => {
      try {
        return Number(assets.realEstateValue?.replaceAll(/[^0-9.-]/g, '') ?? 0);
      } catch (error) {
        Sentry.withScope(scope => {
          scope.setExtra('error', error);
          Sentry.captureMessage(`calculateRealEstateOwned failed: ${error}`);
        });

        return 0;
      }
    };

    // combined fsr options
    const fsrReason = getFsrReason(selectedDebtsAndCopays);
    const amountCanBePaidTowardDebt = getAmountCanBePaidTowardDebt(
      selectedDebtsAndCopays,
    );
    // handle dependents
    const enhancedDependent =
      questions?.hasDependents > 0
        ? dependents
            ?.slice(0, parseInt(questions.hasDependents, 10))
            .map(dep => dep.dependentAge)
        : [];

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
          addresslineOne: address.addressLine1,
          addresslineTwo: address.addressLine2 || '',
          addresslineThree: address.addressLine3 || '',
          city: address.city,
          stateOrProvince: address.stateCode,
          zipOrPostalCode: address.zipCode,
          countryName: address.countryCodeIso2,
        },
        telephoneNumber: getFormattedPhone(mobilePhone),
        dateOfBirth: formattedBirthDate,
        married: questions.isMarried,
        spouseFullName: {
          first: spouseFirst,
          middle: spouseMiddle,
          last: spouseLast,
        },
        agesOfOtherDependents: enhancedDependent,
        employmentHistory,
      },
      income: [
        {
          veteranOrSpouse: 'VETERAN',
          monthlyGrossSalary: vetIncome.grossSalary,
          deductions: vetIncome.deductions,
          totalDeductions: vetIncome.totalDeductions,
          netTakeHomePay: vetIncome.netTakeHomePay,
          otherIncome: vetIncome.otherIncome,
          totalMonthlyNetIncome: vetIncome.totalMonthlyNetIncome,
        },
        {
          veteranOrSpouse: 'SPOUSE',
          monthlyGrossSalary: spIncome.grossSalary,
          deductions: spIncome.deductions,
          totalDeductions: spIncome.totalDeductions,
          netTakeHomePay: spIncome.netTakeHomePay,
          otherIncome: spIncome.otherIncome,
          totalMonthlyNetIncome: spIncome.totalMonthlyNetIncome,
        },
      ],
      expenses: {
        rentOrMortgage,
        food,
        utilities,
        otherLivingExpenses,
        expensesInstallmentContractsAndOtherDebts,
        totalMonthlyExpenses,
      },
      discretionaryIncome: {
        netMonthlyIncomeLessExpenses:
          totalMonthlyNetIncome - totalMonthlyExpenses,
        amountCanBePaidTowardDebt,
      },
      assets: {
        cashInBank: calculatedCashInBank,
        cashOnHand: calculatedCashOnHand,
        automobiles: assets.automobiles,
        trailersBoatsCampers: assets.recVehicleAmount,
        usSavingsBonds: calculatedUsSavingsBonds,
        stocksAndOtherBonds: calculatedStocksAndOther,
        realEstateOwned: calculateRealEstateOwned(),
        otherAssets: assets.otherAssets,
        totalAssets,
      },
      installmentContractsAndOtherDebts: installmentContractsAndCreditCards?.map(
        debt => ({
          ...debt,
          dateStarted: monthYearFormatter(debt.dateStarted),
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
          hasBeenAdjudicatedBankrupt: questions?.hasBeenAdjudicatedBankrupt,
          dateDischarged: monthYearFormatter(
            additionalData?.bankruptcy?.dateDischarged,
          ),
          courtLocation: additionalData?.bankruptcy?.courtLocation,
          docketNumber: additionalData?.bankruptcy?.docketNumber,
        },
        additionalComments: mergeAdditionalComments(
          additionalData?.additionalComments,
          filteredExpenses,
        ),
      },
      applicantCertifications: {
        veteranSignature: `${vetFirst} ${vetMiddle} ${vetLast}`,
        veteranDateSigned: formatDateShort(new Date()),
      },
      selectedDebtsAndCopays: [...selectedDebtsAndCopays],
      streamlined: streamlinedData,
    };

    // calculated values should formatted then converted to string
    // input values use form validation and are formatted correctly
    const convertIntegerToString = (key, value) => {
      return typeof value === 'number' ? value.toFixed(2).toString() : value;
    };

    return JSON.stringify(submissionObj, convertIntegerToString);
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`Transform Failed: ${error}`);
    });
    return 'Transform failed, see sentry for details';
  }
};
