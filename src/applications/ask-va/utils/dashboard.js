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

/**
 * Splits inquires into buckets by their Level of Authentication
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
