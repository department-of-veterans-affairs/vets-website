import React from 'react';
import ProgressButton from '../../common/components/form-elements/ProgressButton';
import { withRouter } from 'react-router';

class IntroductionSection extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  handleButtonClick(e) {
    e.preventDefault();
    this.props.router.push('/veteran-information/personal-information');
  }
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
            <p>
              Fill out this application with the most accurate information you have. The more accurate it is, the more likely you are to get a rapid response.
            </p>
            <p>
              VA uses the information you submit to determine your eligibility and to provide you with the best service.
            </p>
            <p>
              Federal law provides criminal penalties, including a fine and/or imprisonment for up to 5 years, for concealing a material fact or making a materially false statement. (See <a href="https://www.justice.gov/usam/criminal-resource-manual-903-false-statements-concealment-18-usc-1001" target="_blank">18 U.S.C. 1001</a>)
            </p>
            <div className="usa-alert usa-alert-info">
              <strong>Note:</strong> You will not be able to save your progress once you have started the form.
            </div>
          </div>
        </div>
        <br/>

        <div className="row">
          <div className="small-6 medium-5 end columns">
            <ProgressButton
                onButtonClick={this.handleButtonClick}
                buttonText="Continue"
                buttonClass="usa-button-primary"
                afterText="»"/>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(IntroductionSection);
