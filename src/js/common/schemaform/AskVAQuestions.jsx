import React from 'react';

function AskVAQuestions(props) {
  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <div className="help-sidebar-box">
          <h2 className="help-heading">Need Help?</h2>
          {props.children}
          <p className="talk">To report a problem with this form,<br/>
          call the Vets.gov Technical Help Desk:</p>
          <p className="phone-number">
            <a className="phone-number-link" href="tel:+1-855-574-7286">1-855-574-7286</a><br/>
            TTY: <a href="tel:+18008778339">1-800-877-8339</a><br/>
            Monday - Friday, 8:00 a.m. - 8:00 p.m. ET
          </p>
        </div>
      </div>
    </div>
  );
}

export default AskVAQuestions;
