import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import disabilityLabelsReduced from './disabilityLabelsReduced';
import disabilityLabelsRevised from './disabilityLabelsRevised';
import revisedFormWrapper from './revisedFormWrapper';

export const getDisabilityLabels = () => {
  if (revisedFormWrapper.isRevisedForm(environment.isStaging())) {
    return disabilityLabelsRevised;
  }
  return disabilityLabelsReduced;
};
