import React from 'react';

function GetFormHelp() {
  return (
    <div>
      <p className="talk">For other benefit-related questions, please call VA Benefits and Services:</p>
      <p className="phone-number">
        <a href="tel:+1-800-827-1000">1-800-827-1000</a><br/>
        Monday - Friday, 8:00 a.m. - 9:00 p.m. (ET)<br/>
        For Telecommunications Relay Service (TRS): dial <a href="tel:711">711</a>
      </p>

      <p className="talk">For questions about eligibility for burial in a VA national cemetery, please call the National Cemetery Scheduling Office:</p>
      <p className="phone-number">
        <a href="tel:+1-800-535-1117">1-800-535-1117</a><br/>
        7 days a week, 8:00 a.m. - 7:30 p.m. (ET)<br/>
        Select option 3 to speak to someone in Eligibility
      </p>
    </div>
  );
}

export default GetFormHelp;
