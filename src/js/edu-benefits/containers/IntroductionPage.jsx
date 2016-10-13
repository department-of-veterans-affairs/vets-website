import React from 'react';

class IntroductionPage extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h3>Apply for education benefits (Form 22-1990)</h3>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <div className="input-section">
              <p>Fill out this application to get your official Certificate of Eligibility (COE) for the education benefit you want.</p>
              <div className="usa-alert usa-alert-info">
                <div className="usa-alert-body">
                  <span><strong>You won’t be able to save your work or come back to finish</strong>. So before you start, it’s a good idea to gather information about your military and education history, and the school you want to attend.</span>
                </div>
              </div>
              <p>This application is based on VA Form 22-1990.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
