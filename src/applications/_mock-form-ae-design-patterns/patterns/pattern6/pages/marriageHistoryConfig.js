/**
 * Configuration for the veteran's previous marriage history
 */
export const veteranMarriageHistoryOptions = {
  arrayPath: 'veteranMarriageHistory',
  nounSingular: 'former marriage',
  nounPlural: 'former marriages',
  required: false,
  isItemIncomplete: item =>
    !item?.spouseName ||
    !item?.marriageDate ||
    !item?.marriageLocation ||
    !item?.marriageEndDate ||
    !item?.marriageEndReason,
  maxItems: 10,
  text: {
    summaryTitle: 'Review your marital history',
    getItemName: () => 'Your former marriage',
    cardDescription: item => item?.spouseName || 'Marriage details',
  },
};

/**
 * Configuration for the spouse's previous marriage history
 */
export const spouseMarriageHistoryOptions = {
  arrayPath: 'spouseMarriageHistory',
  nounSingular: 'former marriage',
  nounPlural: 'former marriages',
  required: false,
  isItemIncomplete: item =>
    !item?.spouseName ||
    !item?.marriageDate ||
    !item?.marriageLocation ||
    !item?.marriageEndDate ||
    !item?.marriageEndReason,
  maxItems: 10,
  text: {
    summaryTitle: "Review your spouse's past marriages",
    getItemName: () => "Spouse's former marriage",
    cardDescription: item => item?.spouseName || 'Marriage details',
  },
};
