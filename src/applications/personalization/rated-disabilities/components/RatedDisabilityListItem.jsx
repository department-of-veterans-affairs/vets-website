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
        <div className="vads-l-col--4 medium-screen:vads-l-col--3">
          <p className="disability-item-label">Disability</p>
        </div>
        <div className="vads-l-col--8 medium-screeen:vads-l-col--9">
          <p className="disability-item-desc">{name}</p>
        </div>
      </div>
      <div className="vads-l-row">
        <div className="vads-l-col--4 medium-screen:vads-l-col--3">
          <p className="disability-item-label">Decision</p>
        </div>
        <div className="vads-l-col--8 medium-screeen:vads-l-col--9">
          <p className="disability-item-desc">{decisionText}</p>
        </div>
      </div>
      <div className="vads-l-row">
        <div className="vads-l-col--4 medium-screen:vads-l-col--3">
          <p className="disability-item-label">Related To</p>
        </div>
        <div className="vads-l-col--8 medium-screeen:vads-l-col--9">
          <p className="disability-item-desc">{relatedTo}</p>
        </div>
      </div>
      <div className="vads-l-row">
        <div className="vads-l-col--4 medium-screen:vads-l-col--3">
          <p className="disability-item-label">Effective Date</p>
        </div>
        <div className="vads-l-col--8 medium-screeen:vads-l-col--9">
          <p className="disability-item-desc">{effectiveDate}</p>
        </div>
      </div>
      <div className="vads-l-row">
        <div className="vads-l-col--4 medium-screen:vads-l-col--3">
          <p className="disability-item-label">Rating</p>
        </div>
        <div className="vads-l-col--8 medium-screeen:vads-l-col--9">
          <p className="disability-item-desc">{ratingPercentage}</p>
        </div>
      </div>
    </div>
  );
};

export default RatedDisabilityListItem;

RatedDisabilityListItem.propTypes = PropTypes.object;
