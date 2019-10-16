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
        <div className="vads-l-col--3 medium-screen:vads-l-col--3 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--12">
          <p className="disability-item-desc">
            {decisionText === 'Service Connected' ? (
              <i className="fas fa-medal vads-u-margin-right--0p5" />
            ) : null}
            <span className="disability-item-label">{decisionText}</span>{' '}
          </p>
        </div>
        <div className="vads-l-col--9 medium-screen:vads-l-col--9 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--12">
          <p className="disability-item-desc">
            <span className="disability-item-spacer"> | </span>
            Related To: {relatedTo}
          </p>
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
