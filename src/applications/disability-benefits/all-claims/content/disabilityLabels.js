import disabilityLabelsReduced from './disabilityLabelsReduced';

const revisedDisabilityLabels = [];

export const getDisabilityLabels = isRevisedDisabilityList => {
  if (isRevisedDisabilityList) {
    return revisedDisabilityLabels;
  }
  return disabilityLabelsReduced;
};
