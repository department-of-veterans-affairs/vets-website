import React from 'react';
import TabNav from '../components/TabNav';
import AskVAQuestions from '../components/AskVAQuestions'

class DetailsPage extends React.Component {
  render() {
    return (
      <div>

        <div className="row">
          <div className="medium-8 columns">
            <div className="claim-conditions">
              <h1>Your {"Compensation"} Claim</h1>
              <h6>Your Claimed Conditions:</h6>
              <p>{"Tinnitus, Arthritis, PTSD"}</p>
              <TabNav />
            </div>

            <div className="claim-details">
              <div className="claim-types">
                <h6>Claim Type</h6>
                <p>{"Disability Compensation"}</p>
              </div>
              <div className="claim-conditions-list">
                <h6>Your Claimed Conditions</h6>
                <li>{"Tinnitus"} {"(new)"}</li>
                <li>{"PTSD"} {"(reopened)"}</li>
                <li>{"Diabetes"} {"(increase)"}</li>
              </div>
              <div className="claim-date-recieved">
                <h6>Date Recieved</h6>
                <p>{"Jun 12, 2016"}</p>
              </div>
              <div className="claim-va-representative">
                <h6>Your Representative for VA Claims</h6>
                <p>{"Disabled American Veterans"}</p>
              </div>
            </div>
          </div>

          <AskVAQuestions />
        </div>
      </div>
    );
  }
}

export default DetailsPage;
