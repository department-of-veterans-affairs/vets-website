import React from 'react';
import PropTypes from 'prop-types';

const getHeadingText = ratedDisability => {
  const { name, ratingPercentage } = ratedDisability;

  const headingParts = [name];
  if (typeof ratingPercentage === 'number') {
    headingParts.unshift(`${ratingPercentage}%`);
  }

  return headingParts.join(' ');
};

const RatedDisabilityListItem = ({ ratedDisability }) => {
  const { effectiveDate } = ratedDisability;
  const headingText = getHeadingText(ratedDisability);

  return (
    <va-card class="vads-u-margin-bottom--2">
      <h3 className="vads-u-margin-y--0">{headingText}</h3>
      {effectiveDate !== null && (
        <div className="vads-u-margin-top--2">
          <strong>Effective date:</strong> {effectiveDate.format('MM/DD/YYYY')}
        </div>
      )}
    </va-card>
  );
};

RatedDisabilityListItem.propTypes = {
  ratedDisability: PropTypes.object.isRequired,
};

export default RatedDisabilityListItem;
