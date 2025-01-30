import React from 'react';
import PropTypes from 'prop-types';

import { formatDate, getHeadingText } from './helpers';

const ListItem = ({ rating }) => {
  const { effectiveDate } = rating;
  const headingText = getHeadingText(rating);

  return (
    <va-card class="vads-u-margin-bottom--2">
      <h4
        className="vads-u-margin-y--0 vads-u-font-size--h3"
        data-dd-privacy="mask"
        data-dd-action-name="rating text"
      >
        {headingText}
      </h4>
      {effectiveDate !== null && (
        <div className="vads-u-margin-top--2">
          <strong>Effective date:</strong>{' '}
          <span data-dd-privacy="mask" data-dd-action-name="effective date">
            {formatDate(effectiveDate)}
          </span>
        </div>
      )}
    </va-card>
  );
};

ListItem.propTypes = {
  rating: PropTypes.shape({
    decision: PropTypes.string,
    diagnosticText: PropTypes.string,
    diagnosticTypeCode: PropTypes.string,
    diagnosticTypeName: PropTypes.string,
    disabilityRatingId: PropTypes.string,
    effectiveDate: PropTypes.string,
    ratingEndDate: PropTypes.string,
    ratingPercentage: PropTypes.number,
  }).isRequired,
};

export default ListItem;
