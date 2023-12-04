import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import disabilityLabelsReduced from './disabilityLabelsReduced';
import disabilityLabelsRevised from './disabilityLabelsRevised';

export const getDisabilityLabels = () => {
  if (environment.isStaging()) return disabilityLabelsRevised;
  return disabilityLabelsReduced;
};
