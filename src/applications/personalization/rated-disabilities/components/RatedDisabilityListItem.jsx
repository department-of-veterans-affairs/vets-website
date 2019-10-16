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
    <div className="rated-disability-item-container vads-l-col--12">
      <div className="vads-l-row">
        <div className="vads-l-col--9 medium-screen:vads-l-col--9 small-desktop-screen:vads-l-col--9">
          <p className="disability-item-name">{name}</p>
        </div>
        <div className="vads-l-col--3 medium-screen:vads-l-col--3 small-desktop-screen:vads-l-col--3">
          <p className="disability-item-percentage">{ratingPercentage}%</p>
        </div>
      </div>
      <div className="vads-l-row vads-u-margin-y--0p5">
        <div className="vads-l-col--4 medium-screen:vads-l-col--4 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--12">
          {decisionText === 'Service Connected' ? (
            <p className="disability-item-desc">
              <i className="fas fa-medal vads-u-margin-right--0p5" />
              <span className="disability-item-label">{decisionText}</span>{' '}
              <span className="vads-u-margin-left--3 disability-item-spacer">
                {' '}
                |{' '}
              </span>
            </p>
          ) : (
            <p className="disability-item-desc">
              <span className="disability-item-label">{decisionText}</span>{' '}
              <span className="vads-u-margin-left--3 disability-item-spacer">
                {' '}
                |{' '}
              </span>
            </p>
          )}
        </div>
        <div className="vads-l-col--8 medium-screen:vads-l-col--8 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--12">
          <p className="disability-item-desc">Related To: {relatedTo}</p>
        </div>
      </div>
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--12">
          <p className="disability-item-desc">
            Effective date: {effectiveDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatedDisabilityListItem;

RatedDisabilityListItem.propTypes = PropTypes.object;
