import React from 'react';
import { withRouter } from 'react-router';
import { focusElement } from '../../../common/utils/helpers';
import ProgressButton from '../../../common/components/form-elements/ProgressButton';

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
        <h1>Manage Your Education Benefits</h1>
        <p>This application is equivalent to Forms 22-1995 or 22-5495.</p>
        <div className="process">
          <ol>
            <li className="step one">
              <div><h5>Prepare</h5></div>
              <div><h6>What you need to fill out this application</h6></div>
              <ul>
                <li>Social Security number (required)</li>
                <li>Military history (required)</li>
                <li>Basic information about the school or training facility where you want to attend (required)</li>
                <li>Bank account direct deposit information</li>
                <li>Education history</li>
              </ul>
              <div className="usa-alert usa-alert-info">
                <div className="usa-alert-body">
                  <span><strong>You won’t be able to save your work or come back to finish.</strong> So before you start, it’s a good idea to gather information about your military and education history, and the school you want to attend.</span>
                </div>
              </div>
              <p><a href="http://www.va.gov/ogc/apps/accreditation/index.asp">An accredited representative</a> with a Veterans Service Organization (VSO) can help you pick the right program.</p>
              <h6>Learn about educational programs</h6>
              <ul>
                <li>See estimated benefits at the school you want to attend using the <a href="/gi-bill-comparison-tool/">GI Bill Comparison Tool</a>.</li>
              </ul>
            </li>
            <li className="step two">
              <div><h5>Apply to move your Benefit</h5></div>
              <p>Complete this form.</p>
            </li>
            <li className="step three">
              <div><h5>VA Review</h5></div>
              <div><h6>How long does it take the VA to make a decision?</h6></div>
              <ul><li>We usually process new claims within 14 days.</li></ul>
              <div><h6>What should I do while I wait?</h6></div>
              <ul><li>The transition from military to civilian life can be challenging. VA offers <a href="/education/tools-programs/education-career-counseling/">tools and counseling programs</a> to help you make the most of your educational options.</li></ul>
              <div><h6>What if the VA needs more information?</h6></div>
              <ul><li>We will contact you if we need more information.</li></ul>
            </li>
            <li className="step four last">
              <div><h5>Decision</h5></div>
              <ul><li>We usually process claims within 14 days.</li></ul>
              <ul><li>You'll get a COE or Award Letter in the mail if your application was approved. Bring this to the VA certifying official at your school.</li></ul>
            </li>
          </ol>
        </div>
        <div className="row progress-box progress-box-schemaform form-progress-buttons schemaform-buttons">
          <div className="small-6 medium-5 columns">
            <a href="/education/apply-for-education-benefits/">
              <button className="usa-button-outline">« Back</button>
            </a>
          </div>
          <div className="small-6 medium-5 end columns">
            <ProgressButton
                onButtonClick={this.goForward}
                buttonText="Continue"
                buttonClass="usa-button-primary"
                afterText="»"/>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(IntroductionPage);
