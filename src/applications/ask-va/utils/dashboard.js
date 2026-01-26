import Fuse from 'fuse.js';
import { compareDesc } from 'date-fns';
import { getVAStatusFromCRM } from '../config/helpers';

export function flattenInquiry(inquiry) {
  const { id, type, attributes } = inquiry;
  return {
    id,
    type,
    ...attributes,
    status: getVAStatusFromCRM(attributes.status),
  };
}

/** Splits inquires into buckets by their Level of Authentication
 *  @param {Array} rawInquiries
 */
export function categorizeByLOA(rawInquiries) {
  const buckets = rawInquiries.reduce(
    (accumulator, current) => {
      const loa = current.attributes.levelOfAuthentication.toLowerCase();
      const flattened = flattenInquiry(current);

      // If business or personal, add to bucket
      if (accumulator[loa]) accumulator[loa].push(flattened);

      // Use a Set to track categories
      accumulator.uniqueCategories.add(flattened.categoryName);
      return accumulator;
    },
    { business: [], personal: [], uniqueCategories: new Set() },
  );
  // Convert the Set into an array
  return { ...buckets, uniqueCategories: [...buckets.uniqueCategories] };
}

/** Splits an array into buckets of limited size
 * @param {Array} arr The list of items
 * @param {number} itemsPerPage The maximum number of items that can be on 1 page
 * @returns {{pageStart: number; pageEnd: number; items: Array}[]}
 */
export function paginateArray(arr, itemsPerPage) {
  return arr.reduce((acc, cur, index) => {
    const isFirstItem = !(index % itemsPerPage);

    // Create a new bucket if first item on a page
    if (isFirstItem)
      acc.push({
        pageStart: index + 1,
        pageEnd: index + itemsPerPage,
        items: [cur],
      });
    // Otherwise, add to the end of the previous page
    else acc[acc.length - 1].items.push(cur);

    return [...acc];
  }, []);
}

export function filterAndSort({
  inquiriesArray,
  query = '',
  categoryFilter = 'All',
  statusFilter = 'All',
}) {
  // Since Array.sort() sorts it in place, create a shallow copy first
  const inquiriesCopy = [...inquiriesArray];
  const filteredAndSorted = inquiriesCopy
    .filter(inq => {
      return (
        [inq.categoryName, 'All'].includes(categoryFilter) &&
        [inq.status, 'All'].includes(statusFilter)
      );
    })
    .sort((a, b) =>
      compareDesc(new Date(a.lastUpdate), new Date(b.lastUpdate)),
    );

  const searchable = new Fuse(filteredAndSorted, {
    keys: ['inquiryNumber', 'submitterQuestion', 'categoryName'],
    ignoreLocation: true,
    threshold: 0.1,
  });

  const results = searchable.search(query).map(res => res.item);

  // An empty query returns no results, so use the full list as a backup
  return query ? results : filteredAndSorted;
}
