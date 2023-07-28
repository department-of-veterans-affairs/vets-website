import { DEBT_TYPES } from '../constants';

// export const calculatedTotalAssets = formData => {
//   // Get employment income && other income && benefits*?
//   return 100;
// };

// export const calculatedDiscressionaryIncome = formData => {
//   // Get employment income && other income && benefits*?
//   return 100;
// };

// export const isStreamlinedLongForm = formData => {
//   return (
//     formData?.gmtData?.gmtThreshold <= calculatedTotalIncome(formData) &&
//     formData?.gmtData?.incomeStatus > calculatedTotalIncome(formData) &&
//     formData?.gmtData?.assetStatus > calculatedTotalAssets(formData) &&
//     formData?.gmtData?.discressionaryStatus <
//       calculatedDiscressionaryIncome(formData)
//   );
// };

// =============================================================================
// Calculations in form (non-depends)
// Idea below here is to set a gmt flag in redux as we add to form values
// these gmt flags will be used to determine which pages to show
// =============================================================================

export const VHA_LIMIT = 5000;

/**
 * @param {object} formData - all formData
 * @returns true if streamlined is true, and there are only copays selected, and
 *  the total oustanding balance is less than VHA_LIMIT ~ $5000
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

// isStreamlinedShortForm
// Short form:
//  - income below GMT
//  - assets (cash on hand  specific page) below 6.5% of GMT
export const isStreamlinedShortForm = ({ assets, gmtData }) => {
  const assetBelow = parseInt(assets?.cashOnHand, 10) < gmtData?.assetStatus;

  return gmtData?.incomeBelowGMT && assetBelow;
};

// calculatedTotalIncome
// Need to calculate veteran and spouse total income from:
//  - employment income
//  - other income
//  - benefits
export const calculatedTotalIncome = ({
  additionalIncome: { addlIncRecords = [] },
}) => {
  // placeholder data, using editable numbers for now:
  return addlIncRecords.reduce(
    (acc, income) => acc + parseInt(income.amount, 10),
    0,
  );
};
