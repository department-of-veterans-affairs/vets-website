import * as Sentry from '@sentry/browser';
import { DEBT_TYPES } from '../constants';
import { getCalculatedMonthlyIncomeApi, safeNumber } from './calculateIncome';
import { getTotalAssets } from './helpers';

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
 * Check if calculated income is below GMT thresholds
 * @param {object} data - all formData
 * @param {function} setFormData - function to update formData
 */
export const checkIncomeGmt = async (data, setFormData) => {
  const { gmtData } = data;

  try {
    const response = await getCalculatedMonthlyIncomeApi(data);
    if (!response)
      throw new Error(
        'No response from getCalculatedMonthlyIncomeApi in checkIncomeGmt',
      );

    // response is an object of calculated income values for vet & spouse, we just need total monthly
    const { totalMonthlyNetIncome } = response;
    if (!totalMonthlyNetIncome && totalMonthlyNetIncome !== 0)
      throw new Error(
        'No value destructured in response from getCalculatedMonthlyIncomeApi in checkIncomeGmt',
      );

    // calculate annual income & set relevant gmt flags compared to thresholds
    const calculatedIncome = totalMonthlyNetIncome * 12;

    setFormData({
      ...data,
      gmtData: {
        ...gmtData,
        incomeBelowGmt: calculatedIncome < gmtData?.gmtThreshold,
        incomeBelowOneFiftyGmt:
          calculatedIncome < gmtData?.incomeUpperThreshold,
      },
    });
  } catch (error) {
    // something went wrong, and we likely don't have accurate data to set gmt flags
    //  so we'll just set them to false and send them down the full FSR for manual review
    setFormData({
      ...data,
      gmtData: {
        ...gmtData,
        incomeBelowGmt: false,
        incomeBelowOneFiftyGmt: false,
      },
    });
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`checkIncomeGmt failed: ${error}`);
    });
  }
};

/**
 *  Long form only; short form uses cash on hand
 * @param {object} formData - all formData
 * @returns {number} Sum of liquid assets
 */
export const calculateLiquidAssets = formData => {
  const { monetaryAssets = [] } = formData?.assets;
  // Assets considered for streamlined waiver include cash in bank and on hand
  const liquidAssets = monetaryAssets.reduce((acc, asset) => {
    if (
      asset?.name === 'Cash in a bank (savings and checkings)' ||
      asset?.name === 'Cash on hand (not in bank)'
    ) {
      return acc + safeNumber(asset.amount);
    }
    return acc;
  }, 0);

  return formData['view:streamlinedWaiverAssetUpdate']
    ? liquidAssets
    : getTotalAssets(formData);
};
