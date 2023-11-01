import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { connect } from 'react-redux';
import CallToActionWidget from 'applications/static-pages/cta-widget';

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
        <h2 className="vads-u-font-size--h4">Follow these steps to apply</h2>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h3 className="vads-u-font-size--h5">
                Make sure you're eligible
              </h3>
              <p>
                To be eligible for Veteran Rapid Retraining Assistance Program
                (VRRAP), you must meet all the requirements listed here.
              </p>
              <h4 className="vads-u-font-size--h6">
                All of these must be true. You're:
              </h4>
              <ul>
                <li>
                  At least 22 years old, but not older than 66,{' '}
                  <strong>and</strong>
                </li>
                <li>
                  Unemployed because of the COVID-19 pandemic,{' '}
                  <strong>and</strong>
                </li>
                <li>
                  Not rated as totally disabled because you can't work,{' '}
                  <strong>and</strong>
                </li>
                <li>Not enrolled in a federal or state jobs program</li>
              </ul>
              <p>
                <strong>Note:</strong> You can't receive VRRAP benefits at the
                same time you're receiving unemployment benefits (including
                CARES Act benefits).
              </p>
              <p>
                Also, at the time you apply for VRRAP you can't be eligible for
                any of these other benefits:
              </p>
              <ul>
                <li>
                  <a href="https://www.va.gov/education/about-gi-bill-benefits/post-9-11/">
                    Post-9/11 GI Bill
                  </a>
                </li>
                <li>
                  <a href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty/">
                    Montgomery GI Bill
                  </a>
                </li>
                <li>
                  <a href="https://www.va.gov/careers-employment/vocational-rehabilitation/eligibility/">
                    Veteran Readiness and Employment (VR&E)
                  </a>
                </li>
                <li>
                  <a href="https://www.va.gov/education/survivor-dependent-benefits/dependents-education-assistance/">
                    Survivors’ and Dependents’ Educational Assistance (DEA)
                  </a>
                </li>
                <li>
                  <a href="https://www.va.gov/education/other-va-education-benefits/veap/">
                    Veterans’ Educational Assistance Program (VEAP)
                  </a>
                </li>
              </ul>
              <p>
                <strong>Note:</strong> You can get VRRAP benefits if you were
                eligible for the Post-9/11 GI Bill at one time but have
                transferred all of those benefits to family members.
              </p>
            </li>
            <li className="process-step list-two">
              <h3 className="vads-u-font-size--h5">Prepare</h3>
              <h4 className="vads-u-font-size--h6">
                To fill out this application, you’ll need your:
              </h4>
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
              <h3 className="vads-u-font-size--h5">Apply</h3>
              <p>Complete this education benefits form.</p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this page for your records.
              </p>
            </li>
            <li className="process-step list-four">
              <h3 className="vads-u-font-size--h5">VA review</h3>
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
              <h3 className="vads-u-font-size--h5">Decision</h3>
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
        <div className={!this.props.isLoggedIn && 'vads-u-padding-bottom--1p5'}>
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
          <va-omb-info
            res-burden={10}
            omb-number="2900-0885"
            exp-date="10/31/2024"
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
