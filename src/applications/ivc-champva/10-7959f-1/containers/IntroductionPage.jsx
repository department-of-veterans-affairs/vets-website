import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Register for the Foreign Medical Program (FMP)"
          subtitle="Form 10-7959f-1"
        />
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
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps below to apply for Foreign Medical Program benefits.
        </h2>
        <va-process-list uswds="false">
          <li>
            <h3>Prepare</h3>
            <h4>To fill out this application, you’ll need your:</h4>
            <ul>
              <li>Social Security number (required)</li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability-benefits/apply/help/index.html">
                Get help filing your claim
              </a>
            </p>
          </li>
          <li>
            <h3>Apply</h3>
            <p>Complete this CHAMPVA benefits form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </li>
          <li>
            <h3>VA Review</h3>
            <p>
              We process claims within a week. If more than a week has passed
              since you submitted your application and you haven’t heard back,
              please don’t apply again. Call us at.
            </p>
          </li>
          <li>
            <h3>Decision</h3>
            <p>
              Once we’ve processed your claim, you’ll get a notice in the mail
              with our decision.
            </p>
          </li>
        </va-process-list>
        <VaAlert status="info" visible uswds>
          <h2>Sign in now to save time and save your work in progress</h2>
          <p>Here’s how signing in now helps you:</p>
          <ul>
            <li>
              We can fill in some of your information for you to save you time.
            </li>
            <li>
              You can save your work in progress. You’ll have 60 days from when
              you start or make updates to your application to come back and
              finish it.
            </li>
          </ul>
          <p>
            <strong>Note:</strong> You can sign in after you start your
            application. But you’ll lose any information you already filled in.
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
        <p />
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          What if I need help filling out my application?
        </h2>
        <p>
          An accredited representative, like a Veterans Service Officer (VSO),
          can help you fill out your application.
          <a href="https://www.va.gov/COMMUNITYCARE/programs/dependents/champva/CITI.asp">
            Find out if you can get care at a local VA medical center when
            you’re covered under CHAMPVA
          </a>
        </p>
      </article>
    );
  }
}

export default IntroductionPage;
