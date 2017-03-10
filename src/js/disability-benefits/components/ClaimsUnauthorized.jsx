import React from 'react';

class ClaimsUnauthorized extends React.Component {
  render() {
    return (
      <div className="usa-alert usa-alert-warning claims-no-icon claims-unavailable">
        <h4 className="warning-title">
          <i className="fa fa-exclamation-triangle"></i>&nbsp;Sorry, your session has expired
        </h4>
        You may need to refresh the page and sign in again.
      </div>
    );
  }
}

export default ClaimsUnauthorized;
