import { capitalize } from 'lodash';

const formatDate = dateStr => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Configuration for the veteran's previous marriage history
 */
export const veteranMarriageHistoryOptions = {
  arrayPath: 'veteranMarriageHistory',
  nounSingular: 'previous marriage',
  nounPlural: 'previous marriages',
  required: false,
  isItemIncomplete: item =>
    !item?.spouseFullName ||
    !item?.previousDateOfMarriage ||
    !item?.previousMarriageLocation?.city ||
    (item?.['view:marriedOutsideUS'] === false &&
      !item?.previousMarriageLocation?.state) ||
    (item?.['view:marriedOutsideUS'] === true &&
      !item?.previousMarriageLocation?.country) ||
    !item?.reasonMarriageEnded ||
    !item?.dateOfTermination ||
    !item?.previousMarriageEndLocation?.city ||
    (item?.['view:marriageEndedOutsideUS'] === false &&
      !item?.previousMarriageEndLocation?.state) ||
    (item?.['view:marriageEndedOutsideUS'] === true &&
      !item?.previousMarriageEndLocation?.country),
  text: {
    summaryTitle: 'Review your past marriage information',
    getItemName: item =>
      `${capitalize(item?.spouseFullName?.first) || ''} ${capitalize(
        item?.spouseFullName?.last,
      ) || ''} `,
    cardDescription: item =>
      `${formatDate(item?.previousDateOfMarriage)} - ${formatDate(
        item?.dateOfTermination,
      )}; ${capitalize(item?.previousMarriageLocation?.city) || ''}, ${item
        ?.previousMarriageLocation?.state || ''}, ${item
        ?.previousMarriageLocation?.country ||
        (item?.['view:marriedOutsideUS'] === false ? 'USA' : '')}`,
  },
};

/**
 * Configuration for the spouse's previous marriage history
 */
/** @type {ArrayBuilderOptions} */
export const spouseMarriageHistoryOptions = {
  arrayPath: 'spouseMarriageHistory',
  hint: '',
  nounSingular: 'previous marriage',
  nounPlural: 'previous marriages',
  required: false,
  isItemIncomplete: item =>
    !item?.spouseFormerSpouseFullName ||
    !item?.dateOfMarriage ||
    !item?.marriageLocation?.city ||
    (item?.['view:marriedOutsideUS'] === false &&
      !item?.marriageLocation?.state) ||
    (item?.['view:marriedOutsideUS'] === true &&
      !item?.marriageLocation?.country) ||
    !item?.reasonMarriageEnded ||
    !item?.dateOfTermination ||
    !item?.marriageEndLocation?.city ||
    (item?.['view:marriageEndedOutsideUS'] === false &&
      !item?.marriageEndLocation?.state) ||
    (item?.['view:marriageEndedOutsideUS'] === true &&
      !item?.marriageEndLocation?.country),
  text: {
    summaryTitle: "Review your spouse's past marriage information",
    getItemName: item =>
      `${capitalize(item?.spouseFormerSpouseFullName?.first) ||
        ''} ${capitalize(item?.spouseFormerSpouseFullName?.last) || ''} `,
    cardDescription: item =>
      `${formatDate(item?.dateOfMarriage)} - ${formatDate(
        item?.dateOfTermination,
      )}; ${capitalize(item?.marriageLocation?.city) || ''}, ${item
        ?.marriageLocation?.state || ''}, ${item?.marriageLocation?.country ||
        (item?.['view:marriedOutsideUS'] === false ? 'USA' : '')}`,
  },
};
