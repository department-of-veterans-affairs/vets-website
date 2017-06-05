import React from 'react';

class AskVAQuestions extends React.Component {
  render() {
    return (
      <div className="ask-va-questions claims-sidebar-box highlight">
        <h2 className="claim-file-border claim-h2">Need Help?</h2>
        <p>Enrollment or Eligibility questions:<br/>
          <a href="tel:+1-877-222-8387">877-222-8387</a><br/>
          Monday - Friday, 8:00 a.m. - 8:00 p.m. ET<br/>
          TTY:<a href="tel:+1-800-829-4833">800-829-4833</a>
        </p>
        <p>To report a problem with this form,<br/>
          call the Vets.gov Technical Help Desk:<br/>
          <a href="tel:+1-855-574-7286">855-574-7286</a><br/>
          TTY:<a href="tel:+1-855-574-7286">855-574-7286</a><br/>
          Monday - Friday, 8:00 a.m. - 8:00 p.m. ET
        </p>
      </div>
    );
  }
}

export default AskVAQuestions;
