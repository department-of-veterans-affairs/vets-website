import disabilityLabelsFull from './disabilityLabelsFull';
import disabilityLabelsReduced from './disabilityLabelsReduced';

export const getDisabilityLabels = isReducedContentionList => {
  if (isReducedContentionList) return disabilityLabelsReduced;
  return disabilityLabelsFull;
};
