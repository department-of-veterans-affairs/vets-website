import React from 'react';
import { withRouter } from 'react-router';
import { focusElement } from '../../common/utils/helpers';
import AlertBox from '../../common/components/AlertBox';
import ProgressButton from '../../common/components/form-elements/ProgressButton';
import OMBInfo from '../../common/components/OMBInfo';
import FormTitle from '../../common/schemaform/FormTitle';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  goForward = () => {
    this.props.router.push(this.props.route.pageList[1].path);
  }

  render() {
    const infoBoxContent = (
      <p>
        <strong>You won’t be able to save your work or come back to finish.</strong> So, before you start, it’s a good idea to gather the information and documents you’ll need.
      </p>
    );

    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply online for pre-need determination of eligibility in a VA National Cemetery"/>
        <p>
          Equal to VA Form 40-10007
        </p>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h5>Prepare</h5>
              <h6>You'll need:</h6>
              <ul>
                <li>
                  The name of the VA national cemetery where you’d prefer to be buried. <a href="/facilities/">Find a VA national cemetery</a>.
                </li>
                <li>
                  Information about your service history or the service history of the Servicemember or Veteran who’s sponsoring your application. This includes your (or your sponsor’s):
                  <ul>
                    <li>Social Security number (and Military Service Number if it’s different than the Social Security number)</li>
                    <li>VA claim number (if you know it)</li>
                    <li>Date and place of birth</li>
                    <li>Date of death (if the Servicemember or Veteran has died)</li>
                    <li>Military status and history (like service dates, discharge character, and rank—commonly found on the DD214 or other separation documents)</li>
                  </ul>
                </li>
              </ul>
              <h6>You’ll need to upload:</h6>
              <ul><li>A copy of your (or your sponsor’s) DD214 or other separation documents</li></ul>
              <h6>Additional information and documents needed for certain applicants:</h6>
              <ul>
                <li>
                  <strong>If you’re applying as the legally married spouse or surviving spouse or the unmarried adult child of a Servicemember or Veteran</strong>, you’ll need your personal information (including Social Security number and date of birth)
                </li>
                <li>
                  <strong>If you’re applying on behalf of someone else</strong>, you’ll need to upload supporting documents or an affidavit (a written statement of facts confirmed by an oath or affirmation) showing that you’re:
                  <ul>
                    <li>The applicant’s court-appointed representative, <strong>or</strong></li>
                    <li>The applicant’s caregiver (including a spouse or other relative), <strong>or</strong></li>
                    <li>An attorney or agent acting on behalf of the applicant under a durable power of attorney, <strong>or</strong></li>
                    <li>The manager or principal officer of an institution in which the applicant is being care for</li>
                  </ul>
                </li>
                <li>
                  <strong>If you're applying for an unmarried adult child</strong>, you’ll need to upload supporting documents showing:
                  <ul>
                    <li>Medical evidence of a disability</li>
                    <li>Start date of a disability</li>
                    <li>The child's age when diagnosed with a disability</li>
                  </ul>
                </li>
              </ul>
              <p>
                <a href="http://www.va.gov/ogc/apps/accreditation/index.asp">An accredited representative</a> with a Veterans Service Organization (VSO) can help you fill out the claim.
              </p>
              <AlertBox
                content={infoBoxContent}
                isVisible
                status="info"/>
            </li>
            <li className="process-step list-two">
              <h5>Apply</h5>
              <p>Complete the pre-need eligibility determination application.</p>
            </li>
            <li className="process-step list-three">
              <h5>VA Review and Decision</h5>
              <h6>How long does it take VA to make a decision?</h6>
              <p>We usually process claims within 30 days.</p>
              <p>We will contact you if we need more information.</p>
            </li>
            <li className="process-step list-four">
              <h5>Decision</h5>
              <p>After we process your claim, you'll get a notice in the mail about the decision.</p>
            </li>
          </ol>
        </div>
        <div className="row progress-box progress-box-schemaform form-progress-buttons schemaform-buttons">
          <div className="end columns">
            <ProgressButton
              onButtonClick={this.goForward}
              buttonText="Get Started"
              buttonClass="usa-button-primary"
              afterText="»"/>
          </div>
        </div>
        <div className="omb-info--container">
          <OMBInfo resBurden={20} ombNumber="2900-0784" expDate="11/30/2018"/>
        </div>
      </div>
    );
  }
}

export default withRouter(IntroductionPage);

export { IntroductionPage };
