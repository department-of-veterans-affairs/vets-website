import { getCardProps } from '../../../utilities/dr-results-card-display-utils';

export const DR_RESULTS_CONTENT = formResponses =>
  Object.freeze({
    RESULTS_HLR: getCardProps(formResponses),
    RESULTS_SC: getCardProps(formResponses),
    RESULTS_BOARD_EVIDENCE: getCardProps(formResponses),
    RESULTS_BOARD_HEARING: getCardProps(formResponses),
    RESULTS_BOARD_DIRECT: getCardProps(formResponses),
  });
