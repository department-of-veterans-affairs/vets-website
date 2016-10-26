import React from 'react';

class AskVAQuestions extends React.Component {
  render() {
    return (
      <div className="small-12 medium-4 columns">
        <div className="ask-va-questions">
          <h4 className="claim-questions">Questions?</h4>
          <p className="talk">Talk to a VA representative:</p>
          <p className="phone-number"><a href="tel:+1-800-827-10009">1-800-827-1000</a></p>
          <p><a href="https://iris.custhelp.com/">Submit a question to the VA</a></p>
        </div>
      </div>
    );
  }
}

export default AskVAQuestions;
