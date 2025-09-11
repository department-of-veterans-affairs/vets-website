import { getCardProps } from '../../../utilities/dr-results-card-display-utils';

export const DR_RESULTS_CONTENT = formResponses =>
  Object.freeze({
    RESULTS_2_IS_1C: getCardProps(formResponses),
    RESULTS_2_IS_1D: getCardProps(formResponses),
    RESULTS_2_S_1A: getCardProps(formResponses),
    RESULTS_2_S_1B: getCardProps(formResponses),
    RESULTS_2_H_2A_1: getCardProps(formResponses),
    RESULTS_2_H_2A_2: getCardProps(formResponses),
    RESULTS_2_H_2B_1: getCardProps(formResponses),
    RESULTS_2_H_2B_1A: getCardProps(formResponses),
    RESULTS_2_H_2B_2: getCardProps(formResponses),
    RESULTS_2_H_2B_2B: getCardProps(formResponses),
  });
