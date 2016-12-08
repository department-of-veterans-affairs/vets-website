import React from 'react';
import moment from 'moment';

class ClaimComplete extends React.Component {
  render() {
    const completedDate = this.props.completedDate;
    return (
      <div className="claim-decision-is-ready usa-alert usa-alert-info claims-no-icon claims-alert-status">
        <h4>Your claim was closed {completedDate ? `on ${moment(completedDate).format('MMM D, YYYY')}` : null}</h4>
      </div>
    );
  }
}

ClaimComplete.propTypes = {
  completedDate: React.PropTypes.string
};

export default ClaimComplete;
