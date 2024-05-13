import React from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';

import { focusElement } from '@department-of-veterans-affairs/platform-forms-system/ui';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import GetFormHelp from '../../shared/components/GetFormHelp';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route, loggedIn } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Apply for CHAMPVA Other Health Insurance Certification"
          subTitle="Application for CHAMPVA Other Health Insurance Certification (VA Form 10-7959c)"
        />

        <p>
          If you’re the spouse or child of a Veteran with disabilities or a
          Veteran who has died, you may be able to get health insurance through
          the Civilian Health and Medical Program of the Department of Veterans
          Affairs (CHAMPVA). Apply online now.
        </p>

        {!loggedIn && (
          <VaAlert status="info" visible uswds>
            <h2>Have you applied for VA health care before?</h2>
            <SaveInProgressIntro
              buttonOnly
              headingLevel={2}
              prefillEnabled={formConfig.prefillEnabled}
              messages={formConfig.savedFormMessages}
              pageList={pageList}
              unauthStartText="Sign in to check your application status"
              hideUnauthedStartLink
            />
          </VaAlert>
        )}

        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps to get started
        </h2>
        <va-process-list uswds>
          <va-process-list-item header="Gather this information">
            <p>
              <b>Here’s what you’ll need to apply:</b>
              Make sure you meet our eligibility requirements before you apply
            </p>
            <ul>
              <li>
                <b>Personal information about you</b> and anyone else you’re
                applying for
              </li>
            </ul>
            <p>
              You may also need to submit supporting documents, like copies of
              your Medicare or other health insurance cards
            </p>
          </va-process-list-item>
          <va-process-list-item header="Apply">
            <p>
              We’ll take you through each step of the process. This application
              should take about [XX] minutes.
            </p>
          </va-process-list-item>
          <va-process-list-item header="After you apply">
            <p>
              We’ll contact you if we have questions or need more information.
            </p>
          </va-process-list-item>
        </va-process-list>

        {!loggedIn && (
          <VaAlert status="info" visible uswds>
            <h2>Sign in now to save time and save your work in progress</h2>
            <p>Here’s how signing in now helps you:</p>
            <ul>
              <li>
                We can fill in some of your information for you to save you
                time.
              </li>
              <li>
                You can save your work in progress. You’ll have 60 days from
                when you start or make updates to your application to come back
                and finish it.
              </li>
            </ul>
            <p>
              <strong>Note:</strong> You can sign in after you start your
              application. But you’ll lose any information you already filled
              in.
            </p>
            <SaveInProgressIntro
              buttonOnly
              headingLevel={2}
              prefillEnabled={formConfig.prefillEnabled}
              messages={formConfig.savedFormMessages}
              pageList={pageList}
              startText="Start the Application"
            />
          </VaAlert>
        )}
        {loggedIn && (
          <div className="signed-in-sip">
            {/* <Link
              to="/your-information/description"
              className="auth-start-link vads-c-action-link--green"
            >
              Start your application
            </Link> */}
            <SaveInProgressIntro
              testActionLink
              prefillEnabled={route.formConfig.prefillEnabled}
              messages={route.formConfig.savedFormMessages}
              formConfig={route.formConfig}
              pageList={route.pageList}
              startText="Start the application"
              headingLevel={2}
            />
          </div>
        )}
        <br />

        <va-omb-info
          res-burden={10}
          omb-number="2900-0219"
          exp-date="10/31/2024"
        />

        <GetFormHelp />
      </article>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.user.login.currentlyLoggedIn,
});

export default connect(mapStateToProps)(IntroductionPage);
