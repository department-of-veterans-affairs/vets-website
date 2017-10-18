import React from 'react';

class ClaimsUnavailable extends React.Component {
  render() {
    return (
      <div className="usa-alert usa-alert-warning no-background-image claims-unavailable">
        <h4 className="claims-alert-header">
          <i className="fa fa-exclamation-triangle"></i>&nbsp;Claim status is unavailable
        </h4>
        Vets.gov is having trouble loading claims information at this time. Please check back again in a hour.
        Please note: You are still able to review appeals information.
      </div>
    );
  }
}

export default ClaimsUnavailable;
