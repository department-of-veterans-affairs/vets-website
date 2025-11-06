import {
  ALL_MEDICATIONS_FILTER_KEY,
  ACTIVE_FILTER_KEY,
  RECENTLY_REQUESTED_FILTER_KEY,
  RENEWAL_FILTER_KEY,
  NON_ACTIVE_FILTER_KEY,
  rxListSortingOptions,
} from '../constants';

/**
 * Builds the medications list header text for a given filter/sort selection.
 *
 * @param {string} selectedFilterOption - One of the filter keys.
 * @param {string} selectedSortOption - A key in `rxListSortingOptions`.
 * @param {number} rxListSize - Count of medications in the current list.
 * @param {boolean} isPdf - true: build output for PDF; false: build output for TXT.
 * @returns {string} The full header preface text.
 * @throws {Error} If `selectedFilterOption` is not recognized.
 */
export const displayHeaderPrefaceText = (
  selectedFilterOption,
  selectedSortOption,
  rxListSize,
  isPdf = true,
) => {
  const partsWithBoldCount = (prefix, middle, suffix) => [
    { value: 'This is a ', continued: true },
    { value: prefix, continued: true },
    { value: middle, weight: 'bold', continued: true },
    { value: suffix, continued: true },
  ];

  let headParts;
  switch (selectedFilterOption) {
    case ALL_MEDICATIONS_FILTER_KEY:
      headParts = partsWithBoldCount(
        'list of ',
        `all ${rxListSize} medications`,
        ', ',
      );
      break;
    case ACTIVE_FILTER_KEY:
      headParts = partsWithBoldCount(
        'filtered list of ',
        `${rxListSize} active medications`,
        ': active prescriptions and non-VA medications, ',
      );
      break;
    case RECENTLY_REQUESTED_FILTER_KEY:
      headParts = partsWithBoldCount(
        'filtered list of ',
        `${rxListSize} recently requested medications`,
        ': refill requests in process or shipped in the last 15 days, ',
      );
      break;
    case RENEWAL_FILTER_KEY:
      headParts = partsWithBoldCount(
        'filtered list of ',
        `${rxListSize} medications that need renewal before refill`,
        ': prescriptions that just ran out of refills or became too old to refill (expired), ',
      );
      break;
    case NON_ACTIVE_FILTER_KEY:
      headParts = partsWithBoldCount(
        'filtered list of ',
        `${rxListSize} non-active medications`,
        ': prescriptions that are discontinued, expired, or have an unknown status, ',
      );
      break;
    default:
      throw new Error(`Unknown filter option: ${selectedFilterOption}`);
  }

  const tailParts = [
    {
      value: `sorted ${rxListSortingOptions[
        selectedSortOption
      ].LABEL.toLowerCase()}. ${
        selectedFilterOption === ALL_MEDICATIONS_FILTER_KEY
          ? ''
          : "This list doesn't include all of your medications. "
      }`,
      continued: true,
    },
    {
      value:
        'When you download medication records, we also include a list of allergies and reactions in your VA medical records.',
    },
  ];

  const headerPrefaceText = [...headParts, ...tailParts];

  return isPdf
    ? headerPrefaceText
    : headerPrefaceText.map(x => x.value).join('');
};
