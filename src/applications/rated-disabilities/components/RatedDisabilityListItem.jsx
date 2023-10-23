import React from 'react';
import PropTypes from 'prop-types';

const RatedDisabilityListItem = ({ ratedDisability }) => {
  const { effectiveDate, name, ratingPercentage } = ratedDisability;

  const ratingPercentageText =
    typeof ratingPercentage === 'number' && ratingPercentage;
  const headingText = [`${ratingPercentageText}%`, name].join(' ');

  return (
    <va-card class="vads-u-margin-bottom--2">
      <h3 className="vads-u-margin-y--0">{headingText}</h3>
      {effectiveDate !== null ? (
        <div className="vads-u-margin-top--1">
          <dd className="vads-u-display--block vads-u-margin--0">
            <dfn className="vads-u-display--inline-block vads-u-font-weight--bold vads-u-margin-right--0p5">
              Effective date:
            </dfn>
            {effectiveDate.format('MM/DD/YYYY')}
          </dd>
        </div>
      ) : null}
    </va-card>
  );
};

RatedDisabilityListItem.propTypes = {
  ratedDisability: PropTypes.object.isRequired,
};

export default RatedDisabilityListItem;
