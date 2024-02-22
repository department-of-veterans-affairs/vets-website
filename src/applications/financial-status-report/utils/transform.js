import moment from 'moment';
import * as Sentry from '@sentry/browser';
import {
  isStreamlinedShortForm,
  isStreamlinedLongForm,
} from './streamlinedDepends';
import {
  safeNumber,
  sumValues,
  dateFormatter,
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
      veteranContactInformation: { address = {}, mobilePhone = {} } = {},
    },
    assets,
    additionalData,
    selectedDebtsAndCopays = [],
    realEstateRecords,
  } = form.data;

  try {
    // enhanced fsr flag
    const enhancedFSRActive = form.data['view:enhancedFinancialStatusReport'];
    const isShortStreamlined = isStreamlinedShortForm(form.data);
    const isLongStreamlined = isStreamlinedLongForm(form.data);
    const streamlinedAssetUpdateActive =
      form.data['view:streamlinedWaiverAssetUpdate'];

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
      otherExpenses,
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
    // streamlinedCashOnHand - Asset determination for short form prior to streamlined asset update
    const streamlinedCashOnHand =
      cashFilteredMonetaryAssets + safeNumber(assets?.cashOnHand);

    const calculatedCashOnHand = streamlinedAssetUpdateActive
      ? cashFilteredMonetaryAssets
      : streamlinedCashOnHand;

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
      if (!enhancedFSRActive) {
        try {
          return sumValues(realEstateRecords, 'realEstateAmount');
        } catch (error) {
          Sentry.withScope(scope => {
            scope.setExtra('error', error);
            Sentry.captureMessage(
              `calculateRealEstateOwned NOT ENHANCED LOGIC failed: ${error}`,
            );
          });
          return 0;
        }
      } else {
        try {
          return Number(
            assets.realEstateValue?.replaceAll(/[^0-9.-]/g, '') ?? 0,
          );
        } catch (error) {
          Sentry.withScope(scope => {
            scope.setExtra('error', error);
            Sentry.captureMessage(
              `calculateRealEstateOwned ENHANCED LOGIC failed: ${error}`,
            );
          });

          return 0;
        }
      }
    };

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
      addresslineThree: enhancedFSRActive
        ? address.addressLine3 || ''
        : street3,
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
        cashInBank: enhancedFSRActive
          ? calculatedCashInBank
          : assets.cashInBank,
        cashOnHand: enhancedFSRActive
          ? calculatedCashOnHand
          : assets.cashOnHand,
        automobiles: assets.automobiles,
        trailersBoatsCampers: assets.recVehicleAmount,
        usSavingsBonds: enhancedFSRActive
          ? calculatedUsSavingsBonds
          : assets.usSavingsBonds,
        stocksAndOtherBonds: enhancedFSRActive
          ? calculatedStocksAndOther
          : assets.stocksAndOtherBonds,
        realEstateOwned: calculateRealEstateOwned(),
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
          hasBeenAdjudicatedBankrupt: questions?.hasBeenAdjudicatedBankrupt,
          dateDischarged: dateFormatter(
            additionalData?.bankruptcy?.dateDischarged,
          ),
          courtLocation: additionalData?.bankruptcy?.courtLocation,
          docketNumber: additionalData?.bankruptcy?.docketNumber,
        },
        additionalComments: mergeAdditionalComments(
          additionalData?.additionalComments,
          enhancedFSRActive ? filteredExpenses : otherExpenses,
        ),
      },
      applicantCertifications: {
        veteranSignature: `${vetFirst} ${vetMiddle} ${vetLast}`,
        veteranDateSigned: moment().format('MM/DD/YYYY'),
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
