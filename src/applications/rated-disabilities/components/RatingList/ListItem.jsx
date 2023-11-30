import React from 'react';
import PropTypes from 'prop-types';

import { buildDateFormatter } from '../../util';

const formatDate = buildDateFormatter('MMMM dd, yyyy');

const getHeadingText = ratedDisability => {
  const { diagnosticText, ratingPercentage } = ratedDisability;

  const headingParts = [diagnosticText];
  if (ratingPercentage !== null) {
    headingParts.unshift(`${ratingPercentage}% rating for`);
  }

  return headingParts.join(' ');
};

const RatedDisabilityListItem = ({ ratedDisability }) => {
  const { effectiveDate } = ratedDisability;
  const headingText = getHeadingText(ratedDisability);

  return (
    <va-card class="vads-u-margin-bottom--2">
      <h4 className="vads-u-margin-y--0 vads-u-font-size--h3">{headingText}</h4>
      {effectiveDate !== null && (
        <div className="vads-u-margin-top--2">
          <strong>Effective date:</strong> {formatDate(effectiveDate)}
        </div>
      )}
    </va-card>
  );
};

RatedDisabilityListItem.propTypes = {
  ratedDisability: PropTypes.shape({
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

export default RatedDisabilityListItem;
