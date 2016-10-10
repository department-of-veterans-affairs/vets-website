import React from 'react';

class ClaimsDecision extends React.Component {
  render() {
    return (
      <div className="claim-decision-is-ready usa-alert usa-alert-info claims-no-icon">
        <h4>Your claim decision is ready</h4>
        <p>VA sent you a claim decision by U.S mail on {"Sep 12, 2016"}. Please allow up to 8 business days for it to arrive.</p>
        <p>Do you disagree with your claim decision? <a href="/">File an appeal</a></p>
        <p>If you have new evidence to support your claim and have no yet appealed, you can ask VA to <a href="/">Reopen your claim</a></p>
      </div>
    );
  }
}

export default ClaimsDecision;
