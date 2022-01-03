import { benefitsServices } from '../config';

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
    .replace(/e benefits/g, 'eBenefits')
    .replace(
      /Integrated disability evaluation system assistance/g,
      'Integrated Disability Evaluation System assistance (IDES)',
    )
    .trim();

  switch (lowerCaseService) {
    case 'eBenefits registration assistance':
      return benefitsServices.eBenefitsRegistrationAssistance;
    case 'v a home loan assistance':
      return benefitsServices.VAHomeLoanAssistance;
    case 'integrated disability evaluation system assistance':
      return benefitsServices.IntegratedDisabilityEvaluationSystemAssistance;
    case 'pre discharge claim assistance':
      return benefitsServices.PreDischargeClaimAssistance;
    case 'homeless assistance':
      return benefitsServices.HomelessAssistance;
    default:
      return (
        lowerCaseService.charAt(0).toUpperCase() + lowerCaseService.slice(1)
      );
  }
};
