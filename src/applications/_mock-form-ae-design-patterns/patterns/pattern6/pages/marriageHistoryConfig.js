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
const spouseMarriageHistoryOptions = {
  arrayPath: 'spouseMarriageHistory',
  hint: '',
  nounSingular: 'former marriage',
  nounPlural: 'former marriages',
  required: false,
  pathPrefix: '/6/marital-status/',
  isItemIncomplete: item =>
    !item?.spouseName ||
    !item?.marriageDate ||
    !item?.marriageLocation ||
    !item?.marriageEndDate ||
    !item?.marriageEndReason,
  // maxItems: 10,
  text: {
    summaryTitle: "Review your spouse's past marriages",
    getItemName: () => "Spouse's former marriage",
    cardDescription: item => item?.spouseName || 'Marriage details',
  },
};

export { spouseMarriageHistoryOptions };
