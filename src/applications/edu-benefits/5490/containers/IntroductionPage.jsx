import React from 'react';
import { connect } from 'react-redux';

import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';
import WizardContainer from '../../wizard/containers/WizardContainer';
import { showEduBenefits5490Wizard } from '../../selectors/educationWizard';

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
    const { route, showWizard, showUpdatedFryDeaApp, user } = this.props;
    const show = showWizard && status !== WIZARD_STATUS_COMPLETE;

    if (showWizard === undefined) return null;
    if (showUpdatedFryDeaApp) {
      return (
        <div className="schemaform-intro">
          <FormTitle title="Apply to use transferred education benefits" />
          <p className="vads-u-font-size--h3">Equal to VA Form 22-5490</p>

          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h3 slot="headline">
              This application is only for some benefit types
            </h3>
            <p className="vads-u-margin-bottom--0">
              This application is only for the following education benefits:
            </p>
            <ul>
              <li>
                <strong>Fry Scholarship</strong> (Chapter 33)
              </li>
              <li>
                <strong>
                  Survivors' and Dependents' Educational Assistance
                </strong>{' '}
                (DEA, Chapter 35)
              </li>
            </ul>
            <p className="vads-u-margin-bottom--0">
              <a href="/">
                Check your eligibility for other education benefits
              </a>
            </p>
          </va-alert>

          <h2 className="vads-u-font-size--h3">
            Follow these steps to get started
          </h2>

          <div className="process schemaform-process">
            <ol>
              <li className="process-step list-one">
                <h3 className="vads-u-font-size--h4">Check your eligibility</h3>
                <p>
                  Make sure you meet our eligibility requirements before you
                  apply.
                </p>
                <va-additional-info trigger="What are the Fry Scholarship (Chapter 33) eligibility requirements?">
                  <p>
                    <strong>
                      You are the child or surviving spouse of a service member
                      and one of these descriptions is true
                    </strong>
                    :
                  </p>
                  <ul>
                    <li>
                      The service member died in the line of duty while serving
                      on active duty on or after September 11, 2001,{' '}
                      <strong>or</strong>
                    </li>
                    <li>
                      The service member died in the line of duty while not on
                      active duty on or after September 11, 2001,{' '}
                      <strong>or</strong>
                    </li>
                    <li>
                      The member of the Selected Reserve died from a
                      service-connect disability on or after September 11, 2001
                    </li>
                  </ul>
                  <p>
                    <a href="/">
                      Learn more about the Fry Scholarship (Chapter 33)
                    </a>
                  </p>
                </va-additional-info>

                <va-additional-info trigger="What are the Survivors' and Dependents' Educational Assistance (DEA, Chapter 35) eligibility requirements?">
                  <p>
                    <strong>
                      As the child or surviving spouse of a Veteran of service
                      member, at least one of these must be true
                    </strong>
                    :
                  </p>
                  <ul>
                    <li>
                      The Veteran or service member is permanently and totally
                      disabled due to a service-connected disability,
                      <strong>or</strong>
                    </li>
                    <li>
                      The Veteran or service member died while on active duty or
                      as the result of a service-connect disability,
                      <strong>or</strong>
                    </li>
                    The Veteran or service member is missing in action or was
                    captured in the line of duty by a hostile force,
                    <strong>or</strong>
                    <li>
                      The Veteran or service member was forcibly detained (held)
                      or interned in the line of duty by a foreign entity,
                      <strong>or</strong>
                    </li>
                    <li>
                      The Veteran or service member is in the hospital or
                      getting outpatient treatment for a service-connect
                      permanent and total disibility and is likely to be
                      discharged for the disability (effective December 23,
                      2006),
                      <strong>or</strong>
                    </li>
                  </ul>
                  <p>
                    <a href="/">
                      Learn more about Survivors' and Dependents' Educational
                      Assistance (DEA, Chapter 35)
                    </a>
                  </p>
                </va-additional-info>
              </li>
              <li className="process-step list-two">
                <h3 className="vads-u-font-size--h4">
                  Gather your information
                </h3>
                <p>
                  <strong>Here’s what you’ll need to apply</strong>:
                </p>
                <ul>
                  <li>
                    Knowledge of your chosen Veteran of service member's
                    military service history
                  </li>
                  <li>Your current address and contact information</li>
                  <li>Bank account direct deposit information</li>
                </ul>
              </li>
              <li className="process-step list-three">
                <h3 className="vads-u-font-size--h4">Start your application</h3>
                <p>
                  We’ll take you through each step of the process. It should
                  take about 15 minutes.
                </p>

                <va-additional-info trigger="What happens after I apply?">
                  <p>
                    After you apply, you may get an automatic decision. If we
                    approve or deny your application, you’ll be able to download
                    your decision letter right away. We’ll also mail you a copy
                    of your decision letter.
                  </p>
                  <p className="vads-u-margin-bottom--0">
                    <strong>Note</strong>: In some cases, we may need more time
                    to make a decision. If you don’t get an automatic decision
                    right after you apply, you’ll receive a decision letter in
                    the mail in about 30 days. And we’ll contact you if we need
                    more information.
                  </p>
                </va-additional-info>
              </li>
            </ol>
          </div>

          {user?.login?.currentlyLoggedIn && (
            <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
              Begin your application for education benefits
            </h2>
          )}

          <SaveInProgressIntro
            testActionLink
            user={user}
            prefillEnabled={route.formConfig.prefillEnabled}
            messages={route.formConfig.savedFormMessages}
            pageList={route.pageList}
            startText="Start your application"
          />

          <div
            className={`omb-info--container vads-u-padding--0 vads-u-margin-top--${
              user?.login?.currentlyLoggedIn ? '4' : '2p5'
            } vads-u-margin-bottom--2`}
          >
            <OMBInfo
              resBurden="15"
              ombNumber="2900-0154"
              expDate="02/28/2023"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for education benefits as an eligible dependent" />
        <p>
          Equal to VA Form 22-5490 (Dependents’ Application for VA Education
          Benefits).
        </p>
        {show ? (
          <WizardContainer setWizardStatus={this.setWizardStatus} />
        ) : (
          <div className="subway-map">
            <SaveInProgressIntro
              prefillEnabled={this.props.route.formConfig.prefillEnabled}
              messages={this.props.route.formConfig.savedFormMessages}
              pageList={this.props.route.pageList}
              startText="Start the education application"
            />
            <h4>Follow the steps below to apply for education benefits.</h4>
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
                    <li>Social Security number (required)</li>
                    <li>Sponsor’s Social Security number (required)</li>
                    <li>
                      Basic information about the school or training facility
                      you want to attend
                    </li>
                    <li>Bank account direct deposit information</li>
                    <li>Education history</li>
                  </ul>
                  <p>
                    <strong>
                      What if I need help filling out my application?
                    </strong>{' '}
                    An accredited representative, like a Veterans Service
                    Officer (VSO), can help you fill out your claim.{' '}
                    <a href="/disability/get-help-filing-claim/">
                      Get help filing your claim
                    </a>
                    .
                  </p>
                  <h6>Learn about educational programs</h6>
                  <p>
                    See what benefits you’ll get at the school you want to
                    attend.{' '}
                    <a href="/education/gi-bill-comparison-tool/">
                      Use the GI Bill Comparison Tool
                    </a>
                    .
                  </p>
                </li>
                <li className="process-step list-two">
                  <div>
                    <h5>Apply</h5>
                  </div>
                  <p>Complete this education benefits form.</p>
                  <p>
                    After submitting the form, you’ll get a confirmation
                    message. You can print this for your records.
                  </p>
                </li>
                <li className="process-step list-three">
                  <div>
                    <h5>VA review</h5>
                  </div>
                  <p>
                    We usually process claims within 30 days. We’ll let you know
                    by mail if we need more information.
                  </p>
                  <p>
                    We offer tools and counseling programs to help you make the
                    most of your educational options.{' '}
                    <a href="/education/about-gi-bill-benefits/how-to-use-benefits/">
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
              prefillEnabled={this.props.route.formConfig.prefillEnabled}
              messages={this.props.route.formConfig.savedFormMessages}
              pageList={this.props.route.pageList}
              startText="Start the education application"
            />
            <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
              <OMBInfo
                resBurden={45}
                ombNumber="2900-0098"
                expDate="01/31/2025"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showUpdatedFryDeaApp: toggleValues(state)[
    FEATURE_FLAG_NAMES.showUpdatedFryDeaApp
  ],
  showWizard: showEduBenefits5490Wizard(state),
  user: state.user || {},
});

export default connect(mapStateToProps)(IntroductionPage);
