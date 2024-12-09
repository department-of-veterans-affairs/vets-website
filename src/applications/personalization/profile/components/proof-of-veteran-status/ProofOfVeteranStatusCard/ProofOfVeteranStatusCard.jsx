import React from 'react';
import './proof-of-veteran-status-card.scss';

const ProofOfVeteranStatusCard = () => {
  return (
    <div className="proofOfVeteranStatusCard vads-l-col--12 medium-screen:vads-l-col--10 vads-u-background-color--primary-darker vads-u-color--white">
      <h3 className="vads-u-background-color--primary-dark vads-u-margin-top--0 vads-u-padding-top--2p5 vads-u-padding-left--2 vads-u-padding-bottom--2">
        Proof of Veteran status
      </h3>
      <div className="vads-u-padding-left--2p5 vads-u-padding-right--2p5 vads-u-padding-bottom--2p5">
        <dl>
          <dt className="vads-u-font-weight--bold">Name</dt>
          <dd>First Last</dd>
          <dt className="vads-u-font-weight--bold">Latest period of service</dt>
          <dd>-</dd>
          <dt className="vads-u-font-weight--bold">DOD ID Number</dt>
          <dd>-</dd>
          <dt className="vads-u-font-weight--bold">VA disability rating</dt>
          <dd>-</dd>
        </dl>
        <small className="vads-u-font-size--sm">
          This status doesn’t entitle you to any VA benefits.
        </small>
      </div>
    </div>
  );
};

export default ProofOfVeteranStatusCard;
