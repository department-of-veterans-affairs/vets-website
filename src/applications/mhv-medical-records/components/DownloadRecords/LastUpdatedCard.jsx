import React from 'react';
import PropTypes from 'prop-types';

const LastUpdatedCard = ({ lastSuccessfulUpdate }) =>
  lastSuccessfulUpdate && (
    <va-card
      class="vads-u-margin-y--2"
      background
      aria-live="polite"
      data-testid="new-records-last-updated"
    >
      Records in these reports last updated at {lastSuccessfulUpdate.time} on{' '}
      {lastSuccessfulUpdate.date}
    </va-card>
  );

LastUpdatedCard.propTypes = {
  lastSuccessfulUpdate: PropTypes.shape({
    date: PropTypes.string,
    time: PropTypes.string,
  }),
};

export default LastUpdatedCard;
