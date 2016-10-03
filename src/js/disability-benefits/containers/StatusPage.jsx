import React from 'react';
import TabNav from '../components/TabNav';
import AskVAQuestions from '../components/AskVAQuestions';

class StatusPage extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="medium-8 columns show-for-medium-up">
          <div className="claim-conditions">
            <h1>Your {"Compensation"} Claim</h1>
            <h6>Your Claimed Conditions:</h6>
            <p className="list">{"Tinnitus, Arthritis, PTSD"}</p>
            <TabNav/>
          </div>
          <div className="claim-decision-is-ready">
            <h4>Your claim decision is ready</h4>
            <p>VA sent you a claim decision by U.S mail on {"Sep 12, 2016"}. Please allow up to 8 business days for it to arrive.</p>
            <p>Do you disagree with your claim decision? <a href="/">File an appeal</a></p>
            <p>If you have new evidence to support your claim and have no yet appealed, you can ask VA to <a href="/">Reopen your claim</a></p>
          </div>
          <div name="topScrollElement"></div>
          <ol className="process form-process">
            <li role="presentation" className="one  step one wow fadeIn animated section-complete" >
              <div>
                <h5>Claim Recieved</h5>
              </div>
            </li>
            <li role="presentation" className="two  step one wow fadeIn animated section-complete" >
              <div>
                <h5>Initial Review</h5>
              </div>
            </li>
            <li role="presentation" className="three  step one wow fadeIn animated section-current" >
              <div>
                <h5>Evidence Gathering and Review</h5>
                <p>
                  If VA needs more information, the Veterans Service Representative (VSR) will request it from you on your behalf. Once VA has all the information it needs, the VSR will confirm, issue by issue, that the claim is ready for a decision.
                </p>
                <div className="claims-evidence">
                  <p className="claims-evidence-date">Jul 17, 2016</p>
                  <p className="claims-evidence-item">We requested <a href="/">Copy of DD214</a> from you</p>
                </div>
                <div className="claims-evidence">
                  <p className="claims-evidence-date">Jul 7, 2016</p>
                  <p className="claims-evidence-item">We requested <a href="/">PTSD questionnaire</a> from you</p>
                </div>
                <div className="claims-evidence">
                  <p className="claims-evidence-date">Jul 1, 2016</p>
                  <p className="claims-evidence-item">Your claim moved to Evidence gathering for review</p>
                </div>
              </div>
            </li>
            <li role="presentation" className="four  step one wow fadeIn animated" >
              <div>
                <h5>Preparing for decision</h5>
              </div>
            </li>
            <li role="presentation" className="five last step one wow fadeIn animated">
              <div className="completion-container">
                <h5>Complete</h5>
                <div className="claim-completion-estimation">
                  <p className="date-estimation">Estimated Mar 11, 2018</p>
                  <p><a href="/">Learn about this estimation</a></p>
                </div>
              </div>
            </li>
          </ol>
        </div>
        <AskVAQuestions/>
      </div>
    );
  }
}

export default StatusPage;
