const claimantTypeToRouteSuffix = {
  VETERAN: 'veteran',
  SPOUSE: 'spouse',
  CHILD: 'child',
  PARENT: 'parent',
  CUSTODIAN: 'custodian',
};

const getDiscontinuedIncomeSummaryRoute = formData => {
  const suffix =
    claimantTypeToRouteSuffix[(formData?.claimantType)] || 'veteran';

  return `/discontinued-income-summary-${suffix}`;
};

export default [
  // 0 -> 1, redirect user to discontinued incomes summary when legacy data exists
  // Reason: incomeType changed from a text field to a radio field, so in-progress users
  // should be routed back through the updated flow to review/update their entries.
  ({ formData, metadata }) => {
    const hasDiscontinuedIncomes =
      Array.isArray(formData?.discontinuedIncomes) &&
      formData.discontinuedIncomes.length > 0;

    if (!hasDiscontinuedIncomes) {
      return { formData, metadata };
    }

    return {
      formData,
      metadata: {
        ...metadata,
        returnUrl: getDiscontinuedIncomeSummaryRoute(formData),
      },
    };
  },
];
