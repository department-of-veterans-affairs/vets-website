import React from 'react';

class AskVAQuestions extends React.Component {
  render() {
    return (
      <div className="ask-va-questions claims-sidebar-box">
        <h2 className="claim-file-border claim-h2">Need Help?</h2>
        <p className="talk">Ask the vets.gov Help Desk:</p>
        <p className="phone-number">
          <a href="tel:+1-855-574-7286">855-574-7286</a><br/>
          Monday - Friday, 8:00 a.m. - 8:00 p.m. ET
        </p>
        <p><a href="https://iris.custhelp.com/">Submit a question to VA</a></p>
      </div>
    );
  }
}

export default AskVAQuestions;
