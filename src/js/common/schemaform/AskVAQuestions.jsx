import React from 'react';

function AskVAQuestions(phoneNumber) {
  return (
    <div className="ask-va-questions help-sidebar-box">
      <h2 className="help-h2-border help-h2">Need Help?</h2>
      <p className="talk">Enrollment or Eligibility questions:</p>
      <p className="phone-number">
        <a href="`tel:+${phoneNumber}`">{phoneNumber}</a><br/>
        Monday - Friday, 8:00 a.m. - 8:00 p.m. ET<br/>
        TTY: <a href="tel:+1-800-829-4833">800-829-4833</a>
      </p>
      <p className="talk">To report a problem with this form,<br/>
      call the Vets.gov Technical Help Desk:</p>
      <p className="phone-number">
        <a href="tel:+1-855-574-7286">855-574-7286</a><br/>
        TTY: <a href="tel:+1-855-574-7286">855-574-7286</a><br/>
        Monday - Friday, 8:00 a.m. - 8:00 p.m. ET
      </p>
    </div>
  );
}

export default AskVAQuestions;
