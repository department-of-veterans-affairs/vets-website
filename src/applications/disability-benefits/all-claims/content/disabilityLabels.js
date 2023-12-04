import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import disabilityLabelsReduced from './disabilityLabelsReduced';

const disabilityLabelsRevised = {};

export const getDisabilityLabels = () => {
  if (environment.isStaging()) return disabilityLabelsRevised;
  return disabilityLabelsReduced;
};
