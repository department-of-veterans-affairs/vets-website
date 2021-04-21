import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { connect } from 'react-redux';
import OMBInfo from '../content/OMBInfo';
import CallToActionWidget from 'platform/site-wide/cta-widget';
import environment from 'platform/utilities/environment';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }
  loginPrompt() {
    if (this.props.isLoggedIn) {
      return null;
    }

    return (
      <CallToActionWidget appId="vrrap">
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the education application"
          unauthStartText="Sign in to start your application"
          hideUnauthedStartLink
        />
      </CallToActionWidget>
    );
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for the Veteran Rapid Retraining Assistance Program (VRRAP)" />
        {this.loginPrompt()}
        <h4>Follow these steps to apply</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h5>Make sure you're eligible</h5>
              <p>
                To be eligible for the Veteran Rapid Retraining Assistance
                Program (VRRAP), you must meet all the requirements listed here.
              </p>
              <h6>All of these must be true. You're:</h6>
              <ul>
                <li>At least 22 years old, but not older than 66</li>
                <li>Unemployed because of the COVID-19 pandemic</li>
                <li>
                  Not eligible for GI Bill or VR&#38;E benefits (or, if you're
                  eligible for the Post-9/11 GI Bill, you've transferred all of
                  your benefits to family members)
                </li>
                <li>Not rated as totally disabled because you can't work</li>
                <li>Not enrolled in a federal or state jobs program</li>
                <li>
                  Not receiving unemployment benefits (including CARES Act
                  benefits)
                </li>
              </ul>
            </li>
            <li className="process-step list-two">
              <h5>Prepare</h5>
              <h6>To fill out this application, you’ll need your:</h6>
              <ul>
                <li>Social Security number</li>
                <li>Bank account direct deposit information</li>
              </ul>
              <p>
                <strong>What if I need help filling out my application?</strong>{' '}
                An accredited individual, like a Veterans Service Officer (VSO)
                or a Veteran representative at your school, can help you fill
                out this application.{' '}
                <a href="/disability/get-help-filing-claim/">
                  Get help filing your claim
                </a>
              </p>
            </li>
            <li className="process-step list-three">
              <h5>Apply</h5>
              <p>Complete this education benefits form.</p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this page for your records.
              </p>
            </li>
            <li className="process-step list-four">
              <h5>VA review</h5>
              <p>
                We usually make a decision within 30 days. We’ll let you know by
                mail if we need more information.
              </p>
              <p>
                <a href="/education/after-you-apply/">
                  Learn more about what happens after you apply
                </a>
              </p>
            </li>
            <li className="process-step list-five">
              <h5>Decision</h5>
              <p>
                If we approve your application, you’ll get a Certificate of
                Eligibility (COE), or award letter, in the mail. Bring this COE
                to the VA certifying official at your school. This person is
                usually in the registrar's or financial aid office.
              </p>
              <p>
                If your application isn't approved, you’ll get a denial letter
                in the mail.
              </p>
            </li>
          </ol>
        </div>
        <div
          // Prod Flag bah-23496
          className={
            !this.props.isLoggedIn && !environment.isProduction()
              ? 'vads-u-padding-bottom--1p5'
              : ''
          }
        >
          <SaveInProgressIntro
            buttonOnly={!this.props.isLoggedIn}
            prefillEnabled={this.props.route.formConfig.prefillEnabled}
            messages={this.props.route.formConfig.savedFormMessages}
            pageList={this.props.route.pageList}
            startText="Start the education application"
            unauthStartText="Sign in or create an account"
            hideUnauthedStartLink
          />
        </div>
        <div
          className="omb-info--container"
          style={{ paddingLeft: '0px' }}
          id="privacy_policy"
        >
          <OMBInfo
            resBurden={10}
            ombNumber="2900-0885"
            expDate="October 31, 2021"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export default connect(mapStateToProps)(IntroductionPage);
