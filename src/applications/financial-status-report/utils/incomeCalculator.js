import {
  sumValues,
  otherDeductionsName,
  otherDeductionsAmt,
  nameStr,
  filterReduceByName,
} from './helpers';

// incomeCalculator.js
export const calculateIncome = (
  enhancedFSRActive,
  employmentRecords,
  currEmployment,
  addlIncRecords,
  socialSecurity,
  income,
  benefits,
  person,
) => {
  const taxFilters = ['State tax', 'Federal tax', 'Local tax'];
  const retirementFilters = ['401K', 'IRA', 'Pension'];
  const socialSecFilters = ['FICA (Social Security and Medicare)'];
  const allFilters = [...taxFilters, ...retirementFilters, ...socialSecFilters];

  const grossSalary = enhancedFSRActive
    ? sumValues(employmentRecords || [], 'grossMonthlyIncome')
    : sumValues(currEmployment || [], `${person}GrossSalary`);
  const addlInc = sumValues(addlIncRecords || [], 'amount');
  const socSecAmt = !enhancedFSRActive
    ? Number(
        person === 'spouse'
          ? socialSecurity?.spouse?.socialSecAmt?.replaceAll(/[^0-9.-]/g, '') ??
            0
          : socialSecurity?.socialSecAmt?.replaceAll(/[^0-9.-]/g, '') ?? 0,
      )
    : 0;
  const comp =
    person === 'spouse'
      ? Number(
          benefits?.spouseBenefits?.compensationAndPension?.replaceAll(
            /[^0-9.-]/g,
            '',
          ) ?? 0,
        )
      : sumValues(income || [], 'compensationAndPension');
  const edu =
    person === 'spouse'
      ? Number(
          benefits?.spouseBenefits?.education?.replaceAll(/[^0-9.-]/g, '') ?? 0,
        )
      : sumValues(income || [], 'education');
  const benefitsAmount = comp + edu;
  const deductions = enhancedFSRActive
    ? employmentRecords
        ?.filter(emp => emp?.isCurrent)
        ?.map(emp => emp?.deductions)
        ?.flat() ?? 0
    : currEmployment?.map(emp => emp?.deductions)?.flat() ?? 0;
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
      name: nameStr(socSecAmt, comp, edu, addlIncRecords || []),
      amount: otherIncome,
    },
    totalMonthlyNetIncome: netIncome + otherIncome,
  };
};
