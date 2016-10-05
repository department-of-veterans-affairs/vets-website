import React from 'react';

class AskVAToDecide extends React.Component {
  render() {
    return (
      <div className="ask-va-to-decide">
        <h4>Ask VA to decide your claims</h4>
        <p>
          You can ask VA to start evaluating your claim if you don't have anymore documents or evidence to file.
        </p>
        <button className="va-button-secondary request-decision-button" href="/">View Details</button>
      </div>
    );
  }
}

export default AskVAToDecide;
