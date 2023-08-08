import { DEBT_TYPES } from '../constants';

const VHA_LIMIT = 5000;

/**
 * @param {object} formData - all formData
 * @returns true if the following conditions are met:
 * - Streamlined wiaver feature flag is true
 * - Only copays have been selected
 * - Selected copay balances are below $5,000
 */
export const isElidgibleForStreamlined = formData => {
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
 * - isElidgeibleForStreamlined is true
 * - Total income below GMT
 * - Assets (cash on hand  specific page) below 6.5% of GMT
 */
export const isStreamlinedShortForm = formData => {
  const { assets, gmtData } = formData;
  const assetBelow = parseInt(assets?.cashOnHand, 10) < gmtData?.assetThreshold;

  return (
    gmtData?.isEligibleForStreamlined && gmtData?.incomeBelowGmt && assetBelow
  );
};

/**
 * @param {object} formData - all formData
 * @returns true if the following conditions are met:
 * - isElidgeibleForStreamlined is true
 * - Income is above GMT
 * - Income is below 150% of GMT
 * - Total assets below 6.5% of GMT
 * - Discressionary income below 1.25% of GMT
 */
export const isStreamlinedLongForm = formData => {
  const { gmtData } = formData;

  return (
    gmtData?.isElidgibleForStreamlined &&
    !gmtData?.incomeBelowGmt &&
    gmtData?.incomeBelowOneFiftyGMT &&
    gmtData?.assetsBelowGMT &&
    gmtData?.discressionaryBelow
  );
};

// =============================================================================
// Calculations in form (non-depends)
// Idea below here is to set a gmt flag in redux so we don't have to run these
// calculations on every page load. We can just check the flag for depends
// =============================================================================

/**
 * @param {object} formData - all formData
 * @returns Total income from veteran and spouse based on:
 * - employment income
 * - "other" income
 * - benefits
 */
export const calculateTotalIncome = ({
  additionalIncome: { addlIncRecords = [] },
}) => {
  // placeholder data, using editable numbers for now:
  return addlIncRecords.reduce(
    (acc, income) => acc + parseInt(income.amount, 10),
    0,
  );
};

/**
 * @param {object} formData - all formData
 * @returns Sum of total assets
 *  Long form only; short form uses cash on hand
 */
export const calculateTotalAssets = ({ assets: { otherAssets = [] } }) => {
  if (otherAssets.length === 0) return 0;

  // placeholder data, using editable numbers for now:
  return otherAssets.reduce(
    (acc, asset) => acc + parseInt(asset.amount, 10),
    0,
  );
};

/**
 * @param {object} formData - all formData
 * @returns Discresionary income total baseed on total income less expenses
 */
export const calculateDiscressionaryIncome = ({ otherExpenses = [] }) => {
  if (otherExpenses.length === 0) return 0;

  // placeholder data, using editable numbers for now:
  return otherExpenses.reduce(
    (acc, expense) => acc + parseInt(expense.amount, 10),
    0,
  );
};
