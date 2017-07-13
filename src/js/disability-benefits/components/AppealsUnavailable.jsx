import React from 'react';

class ClaimsAppealsUnavailable extends React.Component {
  render() {
    return (
      <div className="usa-alert usa-alert-warning claims-no-icon claims-unavailable">
        <h4 className="warning-title">
          <i className="fa fa-exclamation-triangle"></i>&nbsp;Appeal status is unavailable
        </h4>
        Vets.gov is having trouble loading appeals information at this time. Please check back again in a hour.
        Please note: You are still able to review claims information.
      </div>
    );
  }
}

export default ClaimsAppealsUnavailable;
