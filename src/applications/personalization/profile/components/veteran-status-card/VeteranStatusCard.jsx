import React from 'react';
import PropTypes from 'prop-types';

const VeteranStatusCard = ({
  edipi,
  formattedFullName,
  latestService,
  totalDisabilityRating,
}) => {
  return (
    <div className="proof-of-veteran-status-card vads-u-margin-bottom--2 vads-u-background-color--primary-darker vads-u-color--white ">
      <h2 className="vads-u-background-color--primary-dark vads-u-margin-top--0 vads-u-padding-top--2p5 vads-u-padding-left--2 vads-u-padding-bottom--2">
        Veteran Status Card
      </h2>
      <img
        src="/img/design/seal/seal.png"
        alt="Seal of the U.S. Department of Veterans Affairs"
      />
      <div className="vads-u-padding-left--2p5 vads-u-padding-right--2p5 vads-u-padding-bottom--2p5">
        <dl>
          <dt className="vads-u-font-weight--bold vads-u-margin-top--1">
            Name
          </dt>
          <dd>{formattedFullName}</dd>
          <dt className="vads-u-font-weight--bold vads-u-margin-top--1">
            Latest period of service
          </dt>
          <dd className="vads-u-margin-bottom--1">{latestService}</dd>
          <div className="vets-status-card-row">
            <dt className="vads-u-font-weight--bold">DoD ID Number</dt>
            <dd>{edipi}</dd>
            {!!totalDisabilityRating && (
              <>
                <dt className="vads-u-font-weight--bold">
                  VA disability rating
                </dt>
                <dd>{`${totalDisabilityRating}%`}</dd>
              </>
            )}
          </div>
        </dl>
        <small className="vads-u-font-size--sm">
          This card doesn’t entitle you to any VA benefits.
        </small>
      </div>
    </div>
  );
};

VeteranStatusCard.propTypes = {
  edipi: PropTypes.number,
  formattedFullName: PropTypes.string,
  latestService: PropTypes.string,
  totalDisabilityRating: PropTypes.number,
};

export default VeteranStatusCard;
