import React from 'react';

class ClaimsDecision extends React.Component {
  render() {
    return (
      <div className="claim-decision-is-ready usa-alert usa-alert-info claims-no-icon">
        <h4>Your claim decision is ready</h4>
        <p>We sent you a packet by U.S. mail that includes details of the decision or award. Please allow 7 business days for your packet to arrive before contacting a VA call center.</p>
        <p>Do you disagree with your claim decision? <a href="/disability-benefits/claims-appeal">File an appeal</a></p>
        <p>If you have new evidence to support your claim and have no yet appealed, you can ask VA to <a href="/disability-benefits/claims-process/claim-types/reopened-claim">Reopen your claim</a></p>
      </div>
    );
  }
}

export default ClaimsDecision;
