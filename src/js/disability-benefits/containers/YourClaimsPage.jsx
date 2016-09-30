import React from 'react';
import AskVAQuestions from '../components/AskVAQuestions'

class YourClaimsPage extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="large-8 columns your-claims">
            <div>
              <h1>Your Claims</h1>
            </div>
            <div className="you-have-no-claims">
              <h4>You do not have any submitted claims</h4>
              <p>Claims that you have submitted will appear here. If you have an open application for a claim but have not yet submitted it, you can continue your application on <a href="https://www.ebenefits.va.gov/">ebenefits</a></p>
            </div>
            <div className="claim-list">
              <div className="claim-list-item">
                <h4>Compensation Claim</h4>
                <p className="status">Status: Evidence gathering and review</p>
                <p><i className="fa fa-envelope"></i>We sent you a decision letter</p>
                <p>Last Update: Aug 31, 2016</p>
              </div>

              <div className="claim-list-item">
                <h4>Compensation Claim</h4>
                <p className="status">Status: Complete</p>
                <p><i className="fa fa-exclamation-triangle"></i>We need 2 files from you</p>
                <p><i className="fa fa-envelope"></i>We sent you a development letter</p>
                <p>Last Update: Sep 9, 2016</p>
              </div>

              <div className="claim-list-item">
                <h4>Compensation Claim</h4>
                <p className="status">Status: Claim received</p>
                <p>Last Update: July 17, 2016</p>
              </div>
            </div>
          </div>
          <AskVAQuestions />
        </div>
      </div>
    );
  }
}

export default YourClaimsPage;
