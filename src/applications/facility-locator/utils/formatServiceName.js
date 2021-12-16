/**
 * Returns a Lighthouse API service name in Sentence case.
 * e.g. MentalHealth => Mental health
 * @param service
 * @returns {string}
 */
export const formatServiceName = service => {
  if (!service) return null;
  const lowerCaseService = service
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/veteran/g, 'Veteran')
    .replace(/covid19 vaccine/g, 'COVID-19 vaccines')
    .trim();
  return lowerCaseService.charAt(0).toUpperCase() + lowerCaseService.slice(1);
};
