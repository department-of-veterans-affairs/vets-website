import Fuse from 'fuse.js';
import { compareAsc, compareDesc } from 'date-fns';
import { getVAStatusFromCRM } from '../config/helpers';

/**
 * @typedef {import('../components/inbox/InquiryCard').Inquiry} Inquiry
 */

/**
 *
 * @param {object} rawInquiry
 * @returns {Inquiry}
 */
export function flattenInquiry(rawInquiry) {
  const { id, type, attributes } = rawInquiry;
  return {
    id,
    type,
    ...attributes,
    status: getVAStatusFromCRM(attributes.status),
  };
}

/** Splits inquires into buckets by their Level of Authentication
 *  @param {Array} rawInquiries
 *  @returns {{
 *   inquiries: Inquiry[],
 *   inquiryTypes: ('business' | 'personal')[]
 *   uniqueCategories: string[]
 *   uniqueStatuses: string[]
 * }}
 */
export function standardizeInquiries(rawInquiries) {
  const output = rawInquiries.reduce(
    (accumulator, current) => {
      const loa = current.attributes.levelOfAuthentication.toLowerCase();
      const flattened = flattenInquiry(current);

      // If business or personal, add to output
      if (['business', 'personal'].includes(loa)) {
        accumulator.inquiries.push(flattened);
        accumulator.inquiryTypes.add(loa);
      }

      // Use Sets to track categories & statuses
      accumulator.uniqueCategories.add(flattened.categoryName);
      accumulator.uniqueStatuses.add(flattened.status);
      return accumulator;
    },
    {
      inquiries: [],
      inquiryTypes: new Set(),
      uniqueCategories: new Set(),
      uniqueStatuses: new Set(),
    },
  );
  // Convert the Sets to arrays
  return {
    ...output,
    inquiryTypes: [...output.inquiryTypes],
    uniqueCategories: [...output.uniqueCategories],
    uniqueStatuses: [...output.uniqueStatuses],
  };
}

/** Splits an array into buckets of limited size
 * @param {Inquiry[]} inquiries The list of items
 * @param {number} itemsPerPage The maximum number of items that can be on 1 page
 * @returns {{pageStart: number; pageEnd: number; items: Inquiry[]}[]}
 */
export function paginateInquiries(inquiries, itemsPerPage) {
  const paginatedArray = inquiries.reduce((acc, cur, index) => {
    const isFirstItem = !(index % itemsPerPage);

    // Create a new bucket if first item on a page
    if (isFirstItem)
      acc.push({
        pageStart: index + 1,
        pageEnd: Math.min(index + itemsPerPage, inquiries.length),
        items: [cur],
      });
    // Otherwise, add to the end of the previous page
    else acc[acc.length - 1].items.push(cur);

    return [...acc];
  }, []);

  return paginatedArray.length
    ? paginatedArray
    : [{ pageStart: 0, pageEnd: 0, items: [] }];
}

const sortOptions = {
  lastUpdate: {
    newest: 'lastUpdate.newest',
    oldest: 'lastUpdate.oldest',
  },
};

/**
 * Set the list of inquiries to be displayed in the UI.
 *
 * **IMPORTANT:** be sure to use `filterAndSort.sortOptions` to set `sortOrder`
 * @param {object} _ destructured object
 * @param {Inquiry[]} _.inquiriesArray
 * @param {object} _.filters destructured object
 * @param {string} _.filters.category
 * @param {string} _.filters.status
 * @param {string} _.filters.query
 * @param {string} _.sortOrder use the `sortOptions` object to pick the right option
 * @returns {Inquiry[]}
 */
export function filterAndSort({
  inquiriesArray,
  filters: { category = 'All', status = 'All', query = '' } = {
    category: 'All',
    status: 'All',
    query: '',
  },
  sortOrder = sortOptions.lastUpdate.newest,
}) {
  // Since Array.sort() sorts it in place, create a shallow copy first
  const inquiriesCopy = [...inquiriesArray];
  const filteredAndSorted = inquiriesCopy
    .filter(inq => {
      return (
        [inq.categoryName, 'All'].includes(category) &&
        [inq.status, 'All'].includes(status)
      );
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case sortOptions.lastUpdate.newest:
          return compareDesc(new Date(a.lastUpdate), new Date(b.lastUpdate));

        case sortOptions.lastUpdate.oldest:
          return compareAsc(new Date(a.lastUpdate), new Date(b.lastUpdate));

        default:
          return 0;
      }
    });

  const searchable = new Fuse(filteredAndSorted, {
    keys: ['inquiryNumber', 'submitterQuestion', 'categoryName'],
    ignoreLocation: true,
    threshold: 0.1,
  });

  const results = searchable.search(query).map(res => res.item);

  // An empty query returns no results, so use the full list as a backup
  return query ? results : filteredAndSorted;
}

filterAndSort.sortOptions = sortOptions;
