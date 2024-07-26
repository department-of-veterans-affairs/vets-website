import React from 'react';
import { connect } from 'react-redux';

// import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
// import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route, user } = this.props;

    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for education benefits as an eligible dependent" />
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
              <strong>Survivors’ and Dependents’ Educational Assistance</strong>{' '}
              (DEA, Chapter 35)
            </li>
          </ul>
          <p className="vads-u-margin-bottom--0">
            <a href="https://www.va.gov/education/eligibility/">
              Learn more about other education benefits you may be eligible for
            </a>
          </p>
        </va-alert>

        <h2 className="vads-u-font-size--h3">
          Follow these steps to get started
        </h2>

        <va-process-list>
          <va-process-list-item header="Check your eligibility">
            <p>
              Make sure you meet our eligibility requirements before you apply.
            </p>
            <va-additional-info
              class="vads-u-margin-bottom--2"
              trigger="What are the Fry Scholarship (Chapter 33) eligibility requirements?"
            >
              <p>
                <strong>
                  You are the child or surviving spouse of a service member and
                  one of these descriptions is true
                </strong>
                :
              </p>
              <ul>
                <li>
                  The service member died in the line of duty while serving on
                  active duty on or after September 11, 2001,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  The service member died in the line of duty while not on
                  active duty on or after September 11, 2001,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  The member of the Selected Reserve died from a
                  service-connected disability on or after September 11, 2001
                </li>
              </ul>
              <a href="https://www.va.gov/education/survivor-dependent-benefits/fry-scholarship/">
                Learn more about the Fry Scholarship (Chapter 33)
              </a>
            </va-additional-info>

            <va-additional-info trigger="What are the Survivors’ and Dependents’ Educational Assistance (DEA, Chapter 35) eligibility requirements?">
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
                  disabled due to a service-connected disability,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  The Veteran or service member died while on active duty or as
                  the result of a service-connected disability,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  The Veteran or service member is missing in action or was
                  captured in the line of duty by a hostile force,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  The Veteran or service member was forcibly detained (held) or
                  interned in the line of duty by a foreign entity,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  The Veteran or service member is in the hospital or getting
                  outpatient treatment for a service-connected permanent and
                  total disibility and is likely to be discharged for that
                  disability (effective December 23, 2006)
                </li>
              </ul>
              <a href="https://www.va.gov/education/survivor-dependent-benefits/dependents-education-assistance/">
                Learn more about Survivors’ and Dependents’ Educational
                Assistance (DEA, Chapter 35)
              </a>
            </va-additional-info>
          </va-process-list-item>
          <va-process-list-item header="Gather your information">
            <p>
              <strong>Here’s what you’ll need to apply</strong>:
            </p>
            <ul className="vads-u-margin-bottom--0">
              <li>
                Knowledge of your chosen Veteran of service member's military
                service history
              </li>
              <li>Your current address and contact information</li>
              <li>Bank account direct deposit information</li>
            </ul>
          </va-process-list-item>
          <va-process-list-item header="Start your application">
            <h3 className="vads-u-font-size--h4">Start your application</h3>
            <p>
              We’ll take you through each step of the process. It should take
              about 15 minutes.
            </p>

            <va-additional-info trigger="What happens after I apply?">
              <p>
                After you apply, you may get an automatic decision. If we
                approve or deny your application, you’ll be able to download
                your decision letter right away. We’ll also mail you a copy of
                your decision letter.
              </p>
              <p className="vads-u-margin-bottom--0">
                <strong>Note</strong>: In some cases, we may need more time to
                make a decision. If you don’t get an automatic decision right
                after you apply, you’ll receive a decision letter in the mail in
                about 30 days. And we’ll contact you if we need more
                information.
              </p>
            </va-additional-info>
          </va-process-list-item>
        </va-process-list>

        {user?.login?.currentlyLoggedIn && (
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
            Begin your application for education benefits
          </h2>
        )}

        <SaveInProgressIntro
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
          <va-omb-info
            res-burden={15}
            omb-number="2900-0154"
            exp-date="02/28/2023"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // showUpdatedFryDeaApp: toggleValues(state)[
  //   FEATURE_FLAG_NAMES.showUpdatedFryDeaApp
  // ],
  user: state.user || {},
});

export default connect(mapStateToProps)(IntroductionPage);
