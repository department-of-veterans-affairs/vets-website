import React from 'react';
import PropTypes from 'prop-types';

const RatedDisabilityListItem = ({ ratedDisability }) => {
  const {
    decisionText,
    ratingPercentage,
    name,
    effectiveDate,
  } = ratedDisability;
  return (
    <dl className="vads-u-display--block vads-l-col--12 vads-u-margin--0  vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2">
      {typeof ratingPercentage === 'number' ? (
        <dt className="vads-u-display--inline-block vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin--0 vads-u-border-color--gray-light vads-u-border-bottom--1px">
          {ratingPercentage}%
        </dt>
      ) : null}
      <dt className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin-top--0p25 vads-u-margin-bottom--0 vads-u-margin-x--0">
        {name}
      </dt>
      <dt className="vads-u-display--inline-block vads-u-margin--0">
        <strong>Service-connected disability?</strong>{' '}
      </dt>
      <dd className="vads-u-display--inline-block vads-u-margin-y--0 vads-u-margin-left--1">
        {decisionText === 'Service Connected' ? 'Yes' : 'No'}
      </dd>
      <br />
      {effectiveDate !== null ? (
        <>
          <dt className="vads-u-display--inline-block vads-u-margin--0">
            <strong>Effective date:</strong>
          </dt>
          <dd className="vads-u-display--inline-block vads-u-margin-left--0p5">
            {effectiveDate}
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
