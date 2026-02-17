import React from 'react';
import PropTypes from 'prop-types';

const VeteranStatusCard = ({
  edipi,
  formattedFullName,
  latestService,
  totalDisabilityRating,
}) => {
  return (
    <div className="veteran-status-card vads-u-margin-bottom--2 vads-u-background-color--primary-darker vads-u-color--white ">
      <h2 className="veteran-status-card-title vads-u-background-color--primary-dark vads-u-margin-top--0 vads-u-padding-top--2p5 vads-u-padding-left--2 vads-u-padding-bottom--2">
        Veteran Status Card
      </h2>
      <img
        src="/img/design/seal/seal.png"
        alt="Seal of the U.S. Department of Veterans Affairs"
      />
      <div className="vads-u-padding-left--2p5 vads-u-padding-right--2p5 vads-u-padding-bottom--2p5 dd-privacy-mask">
        <h3>Name</h3>
        <p>{formattedFullName}</p>
        <h3>Latest period of service</h3>
        <p>{latestService}</p>
        <div className="veteran-status-card-row">
          <h3>DoD ID Number</h3>
          <p>{edipi}</p>
          {totalDisabilityRating != null && totalDisabilityRating >= 0 && (
            <>
              <h3>VA disability rating</h3>
              <p>{`${totalDisabilityRating}%`}</p>
            </>
          )}
        </div>
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
