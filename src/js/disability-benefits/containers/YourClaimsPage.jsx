import React from 'react';

class YourClaimsPage extends React.Component {
  render() {
    return (
      <div>
        <div className="va-action-bar—-header">
          <p>Check your appeal status, update your personal information, and get help filing claims on <a href="https://www.ebenefits.va.gov/">eBenefits</a></p>
        </div>

        <div className="row">
          <div className="large-8 columns your-claims">
            <h1>Your Claims</h1>
            <p>Email Notification: {"On"} </p>
          </div>
        </div>

        <div className="claim-list">
          <div className="row">
            <div className="large-8 columns claims">
              <h4>Compensation Claim</h4>
              <p className="status">Status: Evidence gathering and review</p>
              <p><i className="fa fa-envelope"></i>We sent you a decision letter</p>
              <p>Last Update: Aug 31, 2016</p>
            </div>
          </div>

          <div className="row">
            <div className="large-8 columns claims">
              <h4>Compensation Claim</h4>
              <p className="status">Status: Complete</p>
              <p><i className="fa fa-exclamation-triangle"></i>We need 2 files from you</p>
              <p><i className="fa fa-envelope"></i>We sent you a development letter</p>
              <p>Last Update: Sep 9, 2016</p>
            </div>
          </div>

          <div className="row">
            <div className="large-8 columns claims">
              <h4>Compensation Claim</h4>
              <p className="status">Status: Claim received</p>
              <p>Last Update: July 17, 2016</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default YourClaimsPage;
