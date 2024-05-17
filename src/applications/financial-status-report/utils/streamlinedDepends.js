import { DEBT_TYPES } from '../constants';
import { getMonthlyIncome } from './calculateIncome';
import { getMonthlyExpenses } from './calculateExpenses';

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
 * - Assets (cash on hand and cash in bank specific pages) below 6.5% of GMT
 */
export const isStreamlinedShortForm = formData => {
  const { gmtData } = formData;
  // let's keep the cashBelowGmt for now so we don't affect in progress forms that have it,
  //  but we'll use assetsBelowGmt for new forms since it's a more apt description.
  return (
    (gmtData?.isEligibleForStreamlined &&
      gmtData?.incomeBelowGmt &&
      gmtData?.cashBelowGmt) ||
    (formData['view:streamlinedWaiverAssetUpdate'] &&
      gmtData?.isEligibleForStreamlined &&
      gmtData?.incomeBelowGmt &&
      gmtData?.liquidAssetsBelowGmt)
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

  // Hopefully this is more readable, but using liquidAsetsBelowGmt as flag for
  //  asset calculation post streamlinedWaiverAssetUpdate feature flag. Want to keep assetsBelowGmt
  //  untouched in this update as to not interfere with in progress forms.
  const commonConditions =
    gmtData?.isEligibleForStreamlined &&
    !gmtData?.incomeBelowGmt &&
    gmtData?.incomeBelowOneFiftyGmt &&
    gmtData?.discretionaryBelow;

  return (
    commonConditions &&
    (gmtData?.assetsBelowGmt ||
      (formData['view:streamlinedWaiverAssetUpdate'] &&
        gmtData?.liquidAssetsBelowGmt))
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
