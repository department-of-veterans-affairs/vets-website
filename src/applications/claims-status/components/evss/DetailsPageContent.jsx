import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

export default function DetailsPageContent({ claim }) {
  const {
    claimType,
    contentionList,
    dateFiled,
    vaRepresentative,
  } = claim.attributes;

  return (
    <>
      <h3 className="vads-u-visibility--screen-reader">Claim details</h3>
      <dl className="claim-details">
        <dt className="claim-detail-label">
          <h4>Claim type</h4>
        </dt>
        <dd>{claimType || 'Not Available'}</dd>
        <dt className="claim-detail-label">
          <h4>What you’ve claimed</h4>
        </dt>
        <dd>
          {contentionList && contentionList.length ? (
            <ul className="claim-detail-list">
              {contentionList.map((contention, index) => (
                <li key={index} className="claim-detail-list-item">
                  {contention}
                </li>
              ))}
            </ul>
          ) : (
            'Not Available'
          )}
        </dd>
        <dt className="claim-detail-label">
          <h4>Date received</h4>
        </dt>
        <dd>{moment(dateFiled).format('MMM D, YYYY')}</dd>
        <dt className="claim-detail-label">
          <h4>Your representative for VA claims</h4>
        </dt>
        <dd>{vaRepresentative || 'Not Available'}</dd>
      </dl>
    </>
  );
}

DetailsPageContent.propTypes = {
  claim: PropTypes.object,
};
