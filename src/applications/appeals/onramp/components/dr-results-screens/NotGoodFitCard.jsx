import React from 'react';
import PropTypes from 'prop-types';
import {
  getCardTitle,
  getCardContent,
  getLearnMoreLink,
} from '../../utilities/dr-results-content-utils';

const NotGoodFitCard = ({ card, formResponses }) => {
  const H4 = getCardTitle(card);
  const content = getCardContent(card, formResponses, false);
  const learnMoreLink = getLearnMoreLink(card);

  return (
    <va-card
      background
      class="not-good-fit-card"
      data-testid={`not-good-fit-${card}`}
    >
      <h4 className="vads-u-margin-top--0">{H4}</h4>
      <p>This may not be an option because:</p>
      {content}
      {learnMoreLink}
    </va-card>
  );
};

NotGoodFitCard.propTypes = {
  card: PropTypes.string.isRequired,
  formResponses: PropTypes.object.isRequired,
};

export default NotGoodFitCard;
