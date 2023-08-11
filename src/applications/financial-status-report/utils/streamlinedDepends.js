import { DEBT_TYPES } from '../constants';
import { getMonthlyIncome, safeNumber } from './calculateIncome';
import { getTotalAssets, getMonthlyExpenses } from './helpers';

const VHA_LIMIT = 5000;

/**
 * @param {object} formData - all formData
 * @returns true if the following conditions are met:
 * - Streamlined wiaver feature flag is true
 * - Only copays have been selected
 * - Selected copay balances are below $5,000
 */
export const isEligibleForStreamlined = formData => {
  if (formData?.selectedDebtsAndCopays?.length === 0) return false;

  return (
    formData['view:streamlinedWaiver'] &&
    formData?.selectedDebtsAndCopays?.every(
      debt => debt.debtType === DEBT_TYPES.COPAY,
    ) &&
    formData?.selectedDebtsAndCopays?.reduce(
      (acc, copay) => acc + copay?.pHAmtDue,
      0,
    ) < VHA_LIMIT
  );
};

/**
 * @param {object} formData - all formData
 * @returns true if the following conditions are met:
 * - isEligeibleForStreamlined is true
 * - Total income below GMT
 * - Assets (cash on hand  specific page) below 6.5% of GMT
 */
export const isStreamlinedShortForm = formData => {
  const { assets, gmtData } = formData;
  const assetBelow = safeNumber(assets?.cashOnHand) < gmtData?.assetThreshold;

  return (
    gmtData?.isEligibleForStreamlined && gmtData?.incomeBelowGmt && assetBelow
  );
};

/**
 * @param {object} formData - all formData
 * @returns true if the following conditions are met:
 * - isEligeibleForStreamlined is true
 * - Income is above GMT
 * - Income is below 150% of GMT
 * - Total assets below 6.5% of GMT
 * - Discretionary income below 1.25% of GMT
 */
export const isStreamlinedLongForm = formData => {
  const { gmtData } = formData;

  return (
    gmtData?.isEligibleForStreamlined &&
    !gmtData?.incomeBelowGmt &&
    gmtData?.incomeBelowOneFiftyGmt &&
    gmtData?.assetsBelowGmt &&
    gmtData?.discretionaryBelow
  );
};

// =============================================================================
// Calculations in form (non-depends)
// Idea below here is to set a gmt flag in redux so we don't have to run these
// calculations on every page load. We can just check the flag for depends
// =============================================================================

/**
 * Calculate total annual income based on the following monthly income sources:
 * - employment income
 * - "other" income
 * - benefits
 *
 * @param {object} formData - all formData
 * @returns {number} Total yearly income
 */
export const calculateTotalAnnualIncome = formData => {
  const { totalMonthlyNetIncome } = getMonthlyIncome(formData);
  return totalMonthlyNetIncome * 12;
};

/**
 *  Long form only; short form uses cash on hand
 * @param {object} formData - all formData
 * @returns {number} Sum of total assets
 */
export const calculateTotalAssets = formData => {
  return getTotalAssets(formData);
};

/**
 * Discresionary income total baseed on total income less expenses
 *  Long form only
 * @param {object} formData - all formData
 * @returns {number} Discretionary income
 */
export const calculateDiscretionaryIncome = formData => {
  const { totalMonthlyNetIncome } = getMonthlyIncome(formData);
  const expenses = getMonthlyExpenses(formData);
  return totalMonthlyNetIncome - expenses;
};
