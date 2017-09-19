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
        <p>Equal to VA Form 22-5490 (Dependents’ Application for VA Education Benefits).</p>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div><h5>Prepare</h5></div>
              <div><h6>To fill out this application, you’ll need your:</h6></div>
              <ul>
                <li>Social Security number (required)</li>
                <li>Sponsor’s Social Security number (required)</li>
                <li>Basic information about the school or training facility you want to attend</li>
                <li>Bank account direct deposit information</li>
                <li>Education history</li>
              </ul>
              <div className="usa-alert usa-alert-info">
                <div className="usa-alert-body">
                  <span><strong>You won’t be able to save your work or come back to finish.</strong> So before you start, it’s a good idea to gather information about your education history and the school you want to attend.</span>
                </div>
              </div>
              <br/>
              <p><strong>What if I need help filling out my application?</strong> 
              <p>An accredited representative with a Veterans Service Organization (VSO) can help you fill out your claim. <a href="/disability-benefits/apply/help/index.html">Find an accredited representative</a>.</p>
              <h6>Learn about educational programs</h6>
              <ul>
              <p>See what benefits you’ll get at the school you want to attend. <a href="/gi-bill-comparison-tool/">Use the GI Bill Comparison Tool</a>.</p>
              </ul>
            <li className="process-step list-two">
              <div><h5>Apply</h5></div>
              <p>Complete this education benefits form.</p>
              <p>After submitting the form, you’ll get a confirmation message. You can print this for your records.</p>
            </li>
            <li className="process-step list-three">
              <div><h5>VA Review</h5></div>
              <p>We usually process claims within 30 days. We’ll let you know by mail if we need more information.</p>
              <p>We offer tools and counseling programs to help you make the most of your educational options. <a href="/education/tools-programs/">Learn about career counseling options.</a></p>
            </li>
            <li className="process-step list-four">
              <div><h5>Decision</h5></div>
              <ul><li>You’ll get a Certificate of Eligibility (COE), or award letter, in the mail if we’ve approved your application.</li></ul>
              <ul><li>If your application wasn’t approved, you’ll get a denial letter in the mail.</li></ul>
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
