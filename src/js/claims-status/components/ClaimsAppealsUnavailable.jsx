import React from 'react';

class ClaimsAppealsUnavailable extends React.Component {
  render() {
    return (
      <div className="usa-alert usa-alert-warning no-background-image claims-unavailable">
        <h4 className="claims-alert-header">
          <i className="fa fa-exclamation-triangle"></i>&nbsp;Claim and Appeal status is unavailable
        </h4>
        Vets.gov is having trouble loading claims and appeals information at this time. Please check back again in a hour.
      </div>
    );
  }
}

export default ClaimsAppealsUnavailable;
