import React from 'react';
import PropTypes from 'prop-types';
import {
  getCardTitle,
  getCardContent,
  getLearnMoreLink,
} from '../../utilities/dr-results-card-utils';

const NotGoodFitCard = ({ card, formResponses }) => {
  const H3 = getCardTitle(card);
  const content = getCardContent(card, formResponses, false);
  const learnMoreLink = getLearnMoreLink(card);

  return (
    <div className="not-good-fit-card" data-testid={`not-good-fit-${card}`}>
      <h3 className="vads-u-margin-top--0">{H3}</h3>
      <p>This may not be an option because:</p>
      {content}
      {learnMoreLink}
    </div>
  );
};

NotGoodFitCard.propTypes = {
  card: PropTypes.string.isRequired,
  formResponses: PropTypes.object.isRequired,
};

export default NotGoodFitCard;
