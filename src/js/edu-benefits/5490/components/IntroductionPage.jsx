import React from 'react';
import { withRouter } from 'react-router';
import { focusElement } from '../../../common/utils/helpers';
import ProgressButton from '../../../common/components/form-elements/ProgressButton';
import OMBInfo from '../../../common/components/OMBInfo';
import FormTitle from '../../../common/schemaform/FormTitle';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }
  goForward = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }
  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for education benefits as an eligible dependent"/>
        <p>This application is equivalent to Form 22-5490 (Dependents’ Application for VA Education Benefits).</p>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>What you need to fill out this application</h6></div>
              <ul>
                <li>Your Social Security number (required)</li>
                <li>Your sponsor’s Social Security number (required)</li>
                <li>Basic information about the school or training facility where you want to attend</li>
                <li>Bank account direct deposit information</li>
                <li>Education history</li>
              </ul>
              <div className="usa-alert usa-alert-info">
                <div className="usa-alert-body">
                  <span><strong>You won’t be able to save your work or come back to finish.</strong> So before you start, it’s a good idea to gather information about your education history and the school you want to attend.</span>
                </div>
              </div>
              <br/>
              <p>We encourage you to work with a trained professional who can help you pick the right program. Call <a href="tel:888-442-4551">888-442-4551</a> (888-GI-BILL-1) from 8:00 a.m. to 7:00 p.m. (ET) to talk with an education specialist</p>
              <h6>Learn about educational programs</h6>
              <ul>
                <li>See what benefits you’ll get at the school you want to attend. <a href="/gi-bill-comparison-tool/">Use the GI Bill Comparison Tool</a>.</li>
              </ul>
            </li>
            <li className="process-step list-two">
              <div><h5>Apply for Benefits</h5></div>
              <p>Complete this form.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <div><h6>How long does it take VA to make a decision?</h6></div>
              <ul><li>We usually process claims within 30 days.</li></ul>
              <div><h6>What should I do while I wait?</h6></div>
              <ul><li>We offer tools and counseling programs to help you make the most of your educational options. <a href="/education/tools-programs/">Learn about career counseling options.</a></li></ul>
              <div><h6>What if VA needs more information?</h6></div>
              <ul><li>We’ll contact you if we need more information.</li></ul>
            </li>
            <li className="process-step list-four">
              <div><h5>Decision</h5></div>
              <ul><li>We usually process claims within 30 days.</li></ul>
              <ul><li>You’ll get a Certificate of Eligibility (COE) or Award Letter in the mail if your application was approved.</li></ul>
              <ul><li>If your application was not approved, you’ll get a denial letter in the mail.</li></ul>
            </li>
          </ol>
        </div>
        <div className="row progress-box progress-box-schemaform form-progress-buttons schemaform-buttons">
          <div className="small-6 usa-width-five-twelfths medium-5 columns">
            <a href="/education/apply-for-education-benefits/">
              <button className="usa-button-outline">« Back</button>
            </a>
          </div>
          <div className="small-6 usa-width-five-twelfths medium-5 end columns">
            <ProgressButton
                onButtonClick={this.goForward}
                buttonText="Continue"
                buttonClass="usa-button-primary"
                afterText="»"/>
          </div>
        </div>
        <div className="omb-info--container">
          <OMBInfo resBurden={45} ombNumber="2900-0098" expDate="09/30/2018"/>
        </div>
      </div>
    );
  }
}

export default withRouter(IntroductionPage);
