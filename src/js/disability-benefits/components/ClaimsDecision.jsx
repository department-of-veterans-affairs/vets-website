import React from 'react';
import moment from 'moment';

class ClaimsDecision extends React.Component {
  render() {
    const completedDate = this.props.completedDate;
    return (
      <div className="claim-decision-is-ready usa-alert usa-alert-info claims-no-icon claims-alert-status">
        <h4>Your claim decision is ready</h4>
        <p>{completedDate ? `Your claim was completed on ${moment(completedDate).format('MMM D, YYYY')}. ` : null}
        We sent you a packet by U.S. mail that includes details of the decision or award. Please allow 7 business days for your packet to arrive before contacting a VA call center.</p>
        <p>Do you disagree with your claim decision? <a href="/disability-benefits/claims-appeal">File an appeal</a></p>
        <p>If you have new evidence to support your claim and have not yet appealed, you can ask VA to <a href="/disability-benefits/claims-process/claim-types/reopened-claim">Reopen your claim</a></p>
      </div>
    );
  }
}

ClaimsDecision.propTypes = {
  completedDate: React.PropTypes.string
};

export default ClaimsDecision;
