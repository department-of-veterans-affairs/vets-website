import React from 'react';

class AskVAQuestions extends React.Component {
  render() {
    return (
      <div className="ask-va-questions claims-sidebar-box">
        <h2 className="claim-file-border claim-h2">Need Help?</h2>
        <p className="talk">Call Veterans Affairs Benefits and Services:</p>
        <p className="phone-number">
          <a href="tel:+1-800-827-1000">1-800-827-1000</a><br/>
          Monday — Friday, 8:00 a.m. — 9:00 p.m. (ET)
        </p>
        <p><a href="https://iris.custhelp.com/">Submit a question to VA</a></p>
      </div>
    );
  }
}

export default AskVAQuestions;
