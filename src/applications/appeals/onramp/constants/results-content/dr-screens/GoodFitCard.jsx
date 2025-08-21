import React from 'react';
import PropTypes from 'prop-types';
import * as c from './all-fit-card-content';
import {
  getCardTitle,
  getCardContent,
  getLearnMoreLink,
  getLimitOneText,
  getStartLink,
  getDecisionTimeline,
} from './card-utils';

const GoodFitCard = ({ card, formResponses }) => {
  const H3 = getCardTitle(card);
  const content = getCardContent(card, formResponses, true);
  const learnMoreLink = getLearnMoreLink(card);
  const startLink = getStartLink(card);

  return (
    <va-card class="vads-u-display--block vads-u-margin-top--3">
      <h3 className="vads-u-margin-top--0">{H3}</h3>
      <p>This may be a good fit because:</p>
      {content}
      <h4 className="vads-u-margin-top--0">
        Average time to receive a decision:
      </h4>
      <p>{getDecisionTimeline(card)}</p>
      {card !== c.CARD_SC && (
        <p>
          <strong>Note:</strong> You cannot request more than 1{' '}
          {getLimitOneText(card)} on the same issue.
        </p>
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
