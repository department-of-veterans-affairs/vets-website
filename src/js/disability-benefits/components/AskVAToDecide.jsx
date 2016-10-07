import React from 'react';

class AskVAToDecide extends React.Component {
  render() {
    return (
      <div className="medium-4 columns">
        <div className="ask-va-to-decide">
          <h4>Ask VA to decide your claims</h4>
          <p>
            You can request to have your claim evaluated as soon as possible, if you have no other documents or evidence to provide VA. VA will evaluate your claim without waiting for additional evidence.
          </p>
          <button className="va-button-secondary request-decision-button" href="/">Request a Claim Decision</button>
        </div>
      </div>
    );
  }
}

export default AskVAToDecide;
