import { apiRequest } from 'platform/utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as Sentry from '@sentry/browser';
import {
  sumValues,
  otherDeductionsName,
  otherDeductionsAmt,
  nameStr,
  filterReduceByName,
  safeNumber,
} from './helpers';

// default income object

const defaultIncome = {
  grossSalary: '0.00',
  deductions: {
    taxes: '0.00',
    retirement: '0.00',
    socialSecurity: '0.00',
    otherDeductions: {
      name: '',
      amount: '0.00',
    },
  },
  totalDeductions: '0.00',
  netTakeHomePay: '0.00',
  otherIncome: {
    name: '',
    amount: '0.00',
  },
  totalMonthlyNetIncome: 0,
};

// filters for deductions
const taxFilters = ['State tax', 'Federal tax', 'Local tax'];
const retirementFilters = [
  'Retirement accounts (401k, IRAs, 403b, TSP)',
  '401K',
  'IRA',
  'Pension',
];
const socialSecFilters = ['FICA (Social Security and Medicare)'];
const allFilters = [...taxFilters, ...retirementFilters, ...socialSecFilters];

/**
 * Calculate the monthly income of a 'veteran' or 'spouse'
 * It includes gross salary, additional income, social security amount, compensations,
 * education benefits and various types of deductions.
 *
 * @param {boolean} enhancedFSRActive - flag to check if enhanced FSR is active
 * @param {Array} employmentRecords - list of employment records
 * @param {Array} currEmployment - list of current employments
 * @param {Array} addlIncRecords - list of additional income records
 * @param {Object} socialSecurity - social security details
 * @param {Array} income - list of income records
 * @param {Object} benefits - benefits details
 * @param {string} beneficiaryType - 'veteran' or 'spouse'
 *
 * @returns {Object} An object with the monthly income details
 */

const calculateIncome = (
  enhancedFSRActive,
  employmentRecords = [],
  currEmployment = [],
  addlIncRecords = [],
  socialSecurity = {},
  income = [],
  benefits = {},
  beneficiaryType,
) => {
  // currEmployment is for FSR 1.0
  const grossSalary = enhancedFSRActive
    ? sumValues(employmentRecords || [], 'grossMonthlyIncome')
    : sumValues(currEmployment || [], `${beneficiaryType}GrossSalary`);

  const addlInc = sumValues(addlIncRecords, 'amount');

  const socSecAmt = !enhancedFSRActive
    ? safeNumber(
        beneficiaryType === 'spouse'
          ? socialSecurity?.spouse?.socialSecAmt
          : socialSecurity?.socialSecAmt,
      )
    : 0;

  const comp =
    beneficiaryType === 'spouse'
      ? safeNumber(benefits?.spouseBenefits?.compensationAndPension)
      : sumValues(income, 'compensationAndPension');

  const edu =
    beneficiaryType === 'spouse'
      ? safeNumber(benefits?.spouseBenefits?.education)
      : sumValues(income, 'education');

  const benefitsAmount = comp + edu;

  const deductions = (enhancedFSRActive
    ? employmentRecords
        .filter(emp => emp?.isCurrent)
        .map(emp => emp?.deductions)
    : currEmployment.map(emp => emp?.deductions)
  ).flat();

  const taxes = filterReduceByName(deductions, taxFilters);
  const retirement = filterReduceByName(deductions, retirementFilters);
  const socialSec = filterReduceByName(deductions, socialSecFilters);
  const other = otherDeductionsAmt(deductions, allFilters);
  const totDeductions = taxes + retirement + socialSec + other;
  const otherIncome = addlInc + benefitsAmount + socSecAmt;
  const netIncome = grossSalary - totDeductions;

  return {
    grossSalary,
    deductions: {
      taxes,
      retirement,
      socialSecurity: socialSec,
      otherDeductions: {
        name: otherDeductionsName(deductions, allFilters),
        amount: other,
      },
    },
    totalDeductions: totDeductions,
    netTakeHomePay: netIncome,
    otherIncome: {
      name: nameStr(socSecAmt, comp, edu, addlIncRecords),
      amount: otherIncome,
    },
    totalMonthlyNetIncome: netIncome + otherIncome,
  };
};

/**
 * Calculates veteran and spouse income, if any
 * @returns An object with veteran, spouse, and total income
 */

const getMonthlyIncome = formData => {
  const {
    additionalIncome: {
      addlIncRecords = [],
      spouse: { spAddlIncome = [] } = {},
    } = {},
    personalData: {
      employmentHistory: {
        veteran: { employmentRecords = [] } = {},
        spouse: { spEmploymentRecords = [] } = {},
      } = {},
    } = {},
    socialSecurity,
    benefits,
    currEmployment,
    spCurrEmployment,
    income,
    'view:enhancedFinancialStatusReport': enhancedFSRActive,
  } = formData;

  const vetIncome =
    calculateIncome(
      enhancedFSRActive,
      employmentRecords,
      currEmployment,
      addlIncRecords,
      socialSecurity,
      income,
      benefits,
      'veteran',
    ) || defaultIncome;

  const spIncome =
    spEmploymentRecords?.length ||
    spCurrEmployment?.length ||
    spAddlIncome?.length
      ? calculateIncome(
          enhancedFSRActive,
          spEmploymentRecords,
          spCurrEmployment,
          spAddlIncome,
          socialSecurity,
          income,
          benefits,
          'spouse',
        )
      : defaultIncome;

  const totalMonthlyNetIncome =
    vetIncome.totalMonthlyNetIncome +
    (spIncome ? spIncome.totalMonthlyNetIncome : 0);

  return {
    vetIncome,
    spIncome,
    totalMonthlyNetIncome,
  };
};

export const getCalculatedMonthlyIncomeApi = async formData => {
  const body = JSON.stringify(formData);

  try {
    const url = `${environment.API_URL}/debts_api/v0/calculate_monthly_income`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
      body,
      mode: 'cors',
    };

    return await apiRequest(url, options);
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(
        `calculate_monthly_income request handler failed: ${error}`,
      );
    });
    return null;
  }
};

export { calculateIncome, getMonthlyIncome, safeNumber };
