import React from 'react';
import TabNav from '../components/TabNav';
import AskVAQuestions from '../components/AskVAQuestions';
import NeedFilesFromYou from '../components/NeedFilesFromYou';
import ClaimsDecision from '../components/ClaimsDecision';
import AskVAToDecide from '../components/AskVAToDecide';
import AddingDetails from '../components/AddingDetails';

class StatusPage extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="small-12 medium-8 columns usa-content">
          <div className="claim-conditions">
            <h1>Your {"Compensation"} Claim</h1>
            <h6>Your Claimed Conditions:</h6>
            <p className="list">{"Tinnitus, Arthritis, PTSD"}</p>
            <TabNav/>
            <div className="va-tab-content">
              <AddingDetails/>
              <NeedFilesFromYou/>
              <AskVAToDecide/>
              <ClaimsDecision/>
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
                    <h5>Evidence gathering, Review, and Decision</h5>
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
          </div>
          <div name="topScrollElement"></div>

        </div>
        <AskVAQuestions/>
      </div>
    );
  }
}

export default StatusPage;
