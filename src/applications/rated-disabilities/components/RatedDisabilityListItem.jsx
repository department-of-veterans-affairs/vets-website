import React from 'react';
import PropTypes from 'prop-types';

const RatedDisabilityListItem = ({ ratedDisability }) => {
  const {
    decisionText,
    effectiveDate,
    name,
    ratingPercentage,
  } = ratedDisability;

  return (
    <dl className="vads-u-display--block vads-l-col--12 vads-u-background-color--gray-lightest vads-u-margin-x--0 vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2">
      <dt className="vads-u-display--block vads-u-font-size--h3 vads-u-font-weight--bold vads-u-margin--0">
        {typeof ratingPercentage === 'number' ? (
          <dfn className="vads-u-display--block vads-u-border-color--gray-light vads-u-border-bottom--1px">
            {ratingPercentage}%
          </dfn>
        ) : null}
        {name}
      </dt>
      <dd className="vads-u-display--block vads-u-margin--0">
        <dfn className="vads-u-display--inline-block vads-u-font-weight--bold vads-u-margin-y--0 vads-u-margin-right--1">
          Service-connected disability?
        </dfn>{' '}
        {decisionText === 'Service Connected' ? 'Yes' : 'No'}
      </dd>
      {effectiveDate !== null ? (
        <>
          <dd className="vads-u-display--block vads-u-margin--0">
            <dfn className="vads-u-display--inline-block vads-u-font-weight--bold vads-u-margin-right--0p5">
              Effective date:
            </dfn>
            {effectiveDate.format('MM/DD/YYYY')}
          </dd>
        </>
      ) : null}
    </dl>
  );
};

RatedDisabilityListItem.propTypes = {
  ratedDisability: PropTypes.object.isRequired,
};

export default RatedDisabilityListItem;
