/**
 * Returns a Lighthouse API service name in Sentence case.
 * e.g. MentalHealth => Mental health
 * @param service
 * @returns {string}
 */
export const formatServiceName = service => {
  const lowerCaseService = service
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
  return lowerCaseService.charAt(0).toUpperCase() + lowerCaseService.slice(1);
};
