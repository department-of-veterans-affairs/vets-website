import React from 'react';

class ClaimsUnavailable extends React.Component {
  render() {
    return (
      <div className="usa-alert usa-alert-warning claims-no-icon claims-unavailable">
        <h4 className="warning-title">
          <i className="fa fa-exclamation-triangle"></i>&nbsp;Claim status is unavailable
        </h4>
        We are unable to retrieve your claim status at this time. Try refreshing this page or check back later.
      </div>
    );
  }
}

export default ClaimsUnavailable;
