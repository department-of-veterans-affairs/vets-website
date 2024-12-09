import React from 'react';
import PropTypes from 'prop-types';
import './proof-of-veteran-status-card.scss';

const ProofOfVeteranStatusCard = ({
  edipi,
  formattedFullName,
  latestService,
  totalDisabilityRating,
}) => {
  return (
    <div className="proofOfVeteranStatusCard vads-l-col--12 medium-screen:vads-l-col--9 vads-u-margin-bottom--2 vads-u-background-color--primary-darker vads-u-color--white ">
      <h3 className="vads-u-background-color--primary-dark vads-u-margin-top--0 vads-u-padding-top--2p5 vads-u-padding-left--2 vads-u-padding-bottom--2">
        Proof of Veteran status
      </h3>
      <div className="vads-u-padding-left--2p5 vads-u-padding-right--2p5 vads-u-padding-bottom--2p5">
        <dl>
          <dt className="vads-u-font-weight--bold">Name</dt>
          <dd>{formattedFullName}</dd>
          <dt className="vads-u-font-weight--bold">Latest period of service</dt>
          <dd>{latestService}</dd>
          <dt className="vads-u-font-weight--bold">DOD ID Number</dt>
          <dd>{edipi}</dd>
          <dt className="vads-u-font-weight--bold">VA disability rating</dt>
          <dd>{`${totalDisabilityRating}%`}</dd>
        </dl>
        <small className="vads-u-font-size--sm">
          This status doesn’t entitle you to any VA benefits.
        </small>
      </div>
    </div>
  );
};

ProofOfVeteranStatusCard.propTypes = {
  edipi: PropTypes.number,
  formattedFullName: PropTypes.string,
  latestService: PropTypes.string,
  totalDisabilityRating: PropTypes.number,
};

export default ProofOfVeteranStatusCard;
