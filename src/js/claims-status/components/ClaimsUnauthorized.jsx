import React from 'react';

class ClaimsUnauthorized extends React.Component {
  render() {
    return (
      <div className="usa-alert usa-alert-warning no-background-image claims-unavailable">
        <h4 className="claims-alert-header">
          <i className="fa fa-exclamation-triangle"></i>&nbsp;Sorry, your session has expired
        </h4>
        You may need to refresh the page and sign in again.
      </div>
    );
  }
}

export default ClaimsUnauthorized;
