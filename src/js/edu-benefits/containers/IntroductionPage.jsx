import React from 'react';

class IntroductionPage extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h3>Apply online for education benefits</h3>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <p>Complete this application to receive your official certificate of eligibility for the benefit you wish to receive.</p>
            <div className="usa-alert usa-alert-info">
              <div className="usa-alert-body">
                <span><b>You will not be able to save your work or come back later to finish.</b> So it's helpful to have paperwork related to your military history, and information about the school you want to attend, if you have it.</span>
              </div>
            </div>
            <p>This application is based on VA Form 22-1990.</p>
            <strong>Note:</strong> According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or for providing incorrect information. (See 18 U.S.C. 1001)
          </div>
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
