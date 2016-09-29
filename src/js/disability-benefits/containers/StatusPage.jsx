import React from 'react';
import TabNav from '../components/TabNav';
import AskVAQuestions from '../components/AskVAQuestions'

class StatusPage extends React.Component {
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
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi augue purus, fermentum ut ornare et, lobortis et neque. Nulla facilisi. Pellentesque eget turpis congue, faucibus massa sed, scelerisque felis. Morbi pulvinar arcu quis aliquam ultrices. Nulla laoreet sollicitudin metus eget facilisis. In eros dolor, tincidunt eu dolor id, dictum cursus enim.
            </p>
          </div>
          <AskVAQuestions />

        </div>
      </div>
    );
  }
}

export default StatusPage;
