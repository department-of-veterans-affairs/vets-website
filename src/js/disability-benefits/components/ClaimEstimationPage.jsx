import React from 'react';
import { Link } from 'react-router';

export default class ClaimEstimationPage extends React.Component {
  componentDidMount() {
    document.title = 'How VA Comes Up with Your Estimated Decision Date';
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="medium-8 columns">
            <nav className="va-nav-breadcrumbs">
              <ul className="row va-nav-breadcrumbs-list" role="menubar" aria-label="Primary">
                <li><Link to="your-claims">Your claims</Link></li>
                <li className="active">How VA Comes Up with Your Estimated Decision Date</li>
              </ul>
            </nav>
            <div>
              <h1>How VA Comes Up with Your Estimated Decision Date</h1>
              <p className="first-of-type">VA looks at every claim carefully before making a decision. In some cases, we are able to decide quickly, but some claims are more complex and take more time to review.</p>
              <h2>Your estimated decision date is based on:</h2>
              <ul>
                <li>The type of disability you claimed</li>
                <li>How many disabilities you claimed</li>
                <li>Whether there were any unusual circumstances</li>
                <li>How long it took VA to decide other claims like yours</li>
                <li>How long it takes VA to get supporting documents</li>
              </ul>
              <h2>Sometimes estimated dates change when:</h2>
              <ul>
                <li>You upload optional evidence that needs to be processed</li>
                <li>You filed an additional claim that was consolidated with an existing claim</li>
                <li>VA determines additional evidence or information is needed to support your claim</li>
                <li>VA experiences an unexpected high volume of claims</li>
              </ul>
              <h2>When an estimated decision date isn't met:</h2>
              <ul>
                <li>The above reasons sometimes result in your claim needing additional time that exceeds the estimated completion date. We are working to process your claim as quickly as possible.</li>
              </ul>
              <h2>When an estimated decision date isn’t given:</h2>
              <ul>
                <li>We aren’t always able to give an estimate. This happens when there isn’t enough information to make an estimate. We will provide one once more information is gathered.</li>
              </ul>
            </div>
            <p>You can help speed up the process by promptly and electronically uploading the documents requested by the VA.</p>
            <p>If you have questions, call VA at 1-800-827-1000, Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.</p>
          </div>
        </div>
      </div>
    );
  }
}
