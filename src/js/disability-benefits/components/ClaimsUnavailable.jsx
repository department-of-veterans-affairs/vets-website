import React from 'react';

class ClaimsUnavailable extends React.Component {
  render() {
    return (
      <div className="usa-alert usa-alert-warning claims-no-icon claims-unavailable">
        <h4 className="warning-title">
          <i className="fa fa-exclamation-triangle"></i>&nbsp;Claim status is unavailable
        </h4>
          We couldn't check your claim status. Please try again later.
      </div>
    );
  }
}

export default ClaimsUnavailable;
