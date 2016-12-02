import React from 'react';

import AboutYourselfTeaser from '../components/AboutYourselfTeaser';
import AboutYourselfFields from '../components/AboutYourselfFields';
import AboutYourSchoolFields from '../components/AboutYourSchoolFields';
import AdditionalResources from '../components/AdditionalResources';

class LandingPageForm extends React.Component {

  render() {
    return (
      <div className="row">
        <form action="/gi-bill-comparison-tool/institutions/search">

          <div className="small-12 medium-8 columns">
            <div className="usa-card nested">
              <div id="about-you" className="usa-card-header nested">
                Step 1: Tell Us About Yourself
              </div>
              <div className="usa-card-content nested">
                <div className="medium-6 columns">
                  <AboutYourselfFields labels/>
                </div>
                <AboutYourselfTeaser/>
              </div>
            </div>
            <div className="usa-card">
              <div id="about-your-school" className="usa-card-header">
                Step 2: About Your School
              </div>
              <div className="usa-card-content">
                <AboutYourSchoolFields labels online_classes={this.props.queryParams.online_classes}/>
              </div>
            </div>
          </div>

          <div className="small-12 medium-4 columns">
            <AdditionalResources/>
          </div>

        </form>
      </div>
    );
  }

}

LandingPageForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};

LandingPageForm.propTypes = {
  queryParams: React.PropTypes.object.isRequired
};

export default LandingPageForm;
