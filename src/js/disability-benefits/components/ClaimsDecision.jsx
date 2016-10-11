import React from 'react';

class ClaimsDecision extends React.Component {
  render() {
    return (
      <div className="claim-decision-is-ready usa-alert usa-alert-info claims-no-icon">
        <h4>Your claim decision is ready</h4>
        <p>VA sent you a claim decision by U.S mail. Please allow up to 8 business days for it to arrive.</p>
        <p>Do you disagree with your claim decision? <a href="/disability-benefits/claims-appeal">File an appeal</a></p>
        <p>If you have new evidence to support your claim and have no yet appealed, you can ask VA to <a href="/disability-benefits/claims-process/claim-types/reopened-claim">Reopen your claim</a></p>
      </div>
    );
  }
}

export default ClaimsDecision;
