import React from 'react';
import PropTypes from 'prop-types';

const RatedDisabilityListItem = ({ ratedDisability }) => {
  const {
    decisionText,
    ratingPercentage,
    name,
    effectiveDate,
    relatedTo,
  } = ratedDisability;
  return (
    <div className="vads-l-col--12 vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2">
      <div className="vads-l-row">
        <div className="vads-l-col--9">
          <p className="vads-u-font-weight--bold vads-u-margin-top--0p25 vads-u-margin-bottom--0 vads-u-margin-x--0 vads-u-font-size--base">
            {name}
          </p>
        </div>
        {typeof ratingPercentage === 'number' ? (
          <div className="vads-l-col--3">
            <p className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-text-align--right vads-u-margin--0">
              {ratingPercentage}%
            </p>
          </div>
        ) : null}
      </div>
      <div className="vads-l-row vads-u-margin-y--0p5">
        <div className="vads-l-col--12 vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
          <p className="vads-u-margin--0">
            {decisionText === 'Service Connected' ? (
              <i
                className="fas fa-medal vads-u-margin-right--0p5"
                aria-hidden="true"
                role="img"
              />
            ) : null}
            <span className="vads-u-font-weight--bold">{decisionText}</span>{' '}
          </p>
          {relatedTo ? (
            <>
              <p className="vads-u-display--none small-screen:vads-u-display--inline vads-u-margin-x--0p5 vads-u-margin-y--0">
                {' '}
                |{' '}
              </p>
              <p className="vads-u-margin--0">Related To: {relatedTo}</p>
            </>
          ) : null}
        </div>
      </div>
      {effectiveDate !== null ? (
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--12">
            <p className="vads-u-margin--0">Effective date: {effectiveDate}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

RatedDisabilityListItem.propTypes = {
  ratedDisability: PropTypes.object.isRequired,
};

export default RatedDisabilityListItem;
