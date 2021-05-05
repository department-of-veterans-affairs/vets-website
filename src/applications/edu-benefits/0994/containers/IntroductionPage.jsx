import React from 'react';
import { focusElement } from 'platform/utilities/ui';
import OMBInfoShared from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import WizardContainer from '../../wizard/containers/WizardContainer';
import { connect } from 'react-redux';
import { showEduBenefits0994Wizard } from '../../selectors/educationWizard';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';

export class IntroductionPage extends React.Component {
  state = {
    status: sessionStorage.getItem(WIZARD_STATUS) || WIZARD_STATUS_NOT_STARTED,
  };

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  setWizardStatus = value => {
    sessionStorage.setItem(WIZARD_STATUS, value);
    this.setState({ status: value });
  };

  render() {
    const { status } = this.state;
    const { showWizard } = this.props;
    const show = showWizard && status !== WIZARD_STATUS_COMPLETE;

    if (showWizard === undefined) return null;

    const ombInfo = (
      <OMBInfoShared
        resBurden={10}
        ombNumber={'2900-0866'}
        expDate={'04/30/2022'}
      />
    );

    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for Veteran Employment Through Technology Education Courses (VET TEC)" />
        <p>
          Equal to VA Form 22-0994 Application for Veteran Employment Through
          Technology Education Courses (VET TEC).
        </p>
        {show ? (
          <WizardContainer setWizardStatus={this.setWizardStatus} />
        ) : (
          <div className="subway-map">
            <CallToActionWidget appId="vet-tec">
              <SaveInProgressIntro
                startMessageOnly
                verifyRequiredPrefill={
                  this.props.route.formConfig.verifyRequiredPrefill
                }
                prefillEnabled={this.props.route.formConfig.prefillEnabled}
                messages={this.props.route.formConfig.savedFormMessages}
                pageList={this.props.route.pageList}
              />
            </CallToActionWidget>
            <h4>Follow the steps below to apply for VET TEC.</h4>
            <div className="process schemaform-process">
              <ol>
                <li className="process-step list-one">
                  <div>
                    <h5>Prepare</h5>
                  </div>
                  <div>
                    <h6>To fill out this application, you’ll need your:</h6>
                  </div>
                  <ul>
                    <li>Direct deposit information</li>
                    <li>Highest level of education</li>
                    <li>
                      Previous high-tech industry experience, if applicable
                    </li>
                    <li>
                      Information about the training provider or program you
                      want to attend (optional)
                    </li>
                  </ul>
                  <div>
                    <h6>To be eligible for VET TEC, you need to be</h6>
                  </div>
                  <ul>
                    <li>
                      A Veteran with at least one day of unexpired education
                      benefits, <strong>or</strong>
                    </li>
                    <li>
                      A service member with 180 days or less left on active duty
                    </li>
                  </ul>
                  <p>
                    You can complete the VET TEC application to see if you’re
                    eligible for the program, even if you haven’t yet selected
                    the training program you'd like to attend.{' '}
                    <a href="https://www.benefits.va.gov/gibill/fgib/VetTec_Veteran.asp">
                      Learn more about the programs covered under VET TEC
                    </a>
                    .
                  </p>
                  <p>
                    <strong>
                      What if I need help filling out my application?
                    </strong>{' '}
                    An accredited representative, like a Veterans Service
                    Officer (VSO), can help you fill out your application.{' '}
                    <a href="/disability/get-help-filing-claim/">
                      Get help filing your claim
                    </a>
                    .
                  </p>
                </li>
                <li className="process-step list-two">
                  <div>
                    <h5>Apply</h5>
                  </div>
                  <div>
                    <p>Complete this VET TEC application.</p>
                    <p>
                      After submitting the form, you’ll get a confirmation
                      message. You can print this for your records.
                    </p>
                    <p>
                      If you haven’t already applied for VA education benefits,
                      you’ll need to fill out an Application for VA Education
                      Benefits (VA Form 22-1990). We’ll take you to that form
                      after you submit your VET TEC application.
                    </p>
                    <p>
                      <strong>Note:</strong> If you already receive VA education
                      benefits, you don’t need to fill out VA Form 22-1990
                      again.
                    </p>
                  </div>
                </li>
                <li className="process-step list-three">
                  <div>
                    <h5>VA review</h5>
                  </div>
                  <p>
                    We usually process applications within 30 days. We'll let
                    you know by mail if we need more information.
                  </p>
                  <p>
                    We offer tools and counseling programs to help you make the
                    most of your educational options.{' '}
                    <a href="/careers-employment/careerscope-skills-assessment/">
                      Learn about career counseling options
                    </a>
                  </p>
                </li>
                <li className="process-step list-four">
                  <div>
                    <h5>Decision</h5>
                  </div>
                  <p>
                    You’ll get a Certificate of Eligibility (COE), or award
                    letter, in the mail if we’ve approved your application.
                  </p>
                  <p>
                    If your application wasn’t approved, you’ll get a denial
                    letter in the mail.
                  </p>
                </li>
              </ol>
            </div>
            <SaveInProgressIntro
              buttonOnly
              hideUnauthedStartLink
              verifyRequiredPrefill={
                this.props.route.formConfig.verifyRequiredPrefill
              }
              prefillEnabled={this.props.route.formConfig.prefillEnabled}
              messages={this.props.route.formConfig.savedFormMessages}
              pageList={this.props.route.pageList}
              startText="Start the VET TEC application"
            />
            <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
              {ombInfo}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showWizard: showEduBenefits0994Wizard(state),
});

export default connect(mapStateToProps)(IntroductionPage);
