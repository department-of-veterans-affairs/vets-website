import React from 'react';
import PropTypes from 'prop-types';
import {
  getCardTitle,
  getCardContent,
  getLearnMoreLink,
  getStartLink,
  getDecisionTimeline,
} from '../../utilities/dr-results-content-utils';
import { CARD_SC } from '../../constants/results-content/dr-screens/card-content';

const GoodFitCard = ({ card, formResponses }) => {
  const H3 = getCardTitle(card);
  const content = getCardContent(card, formResponses, true);
  const learnMoreLink = getLearnMoreLink(card);
  const startLink = getStartLink(card);
  const timeline = getDecisionTimeline(card);
  const timelineHeader =
    card === CARD_SC
      ? 'Average time to receive a decision:'
      : 'Timeframe goal:';

  return (
    <va-card
      class="vads-u-display--block vads-u-margin-top--3"
      data-testid={`good-fit-${card}`}
    >
      <h3 className="vads-u-margin-top--0">{H3}</h3>
      <p>This may be a good fit because:</p>
      {content}
      {timeline && (
        <>
          <h4 className="vads-u-margin-top--0">{timelineHeader}</h4>
          <p>{timeline}</p>
        </>
      )}
      {learnMoreLink}
      {startLink}
    </va-card>
  );
};

GoodFitCard.propTypes = {
  card: PropTypes.string.isRequired,
  formResponses: PropTypes.object.isRequired,
};

export default GoodFitCard;
