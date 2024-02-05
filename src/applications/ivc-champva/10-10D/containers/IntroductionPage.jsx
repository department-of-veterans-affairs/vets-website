import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import OMBInfo from '../components/IntroductionPage/OMBInfo';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle title="Apply for CHAMPVA benefits" subTitle="Form 10-10d" />

        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        >
          Please complete the 10-10D form to apply for CHAMPVA benefits.
        </SaveInProgressIntro>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps below to apply for CHAMPVA benefits.
        </h2>
        <va-process-list uswds>
          <va-process-list-item header="Prepare">
            <h4>To fill out this application, you’ll need your:</h4>
            <ul>
              <li>Social Security number (required)</li>
              <li>VA File number (required)</li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability-benefits/apply/help/index.html">
                Get help filing your claim
              </a>
            </p>
          </va-process-list-item>
          <va-process-list-item header="Apply">
            <p>Complete this CHAMPVA benefits form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </va-process-list-item>
          <va-process-list-item header="VA Review">
            <p>
              We process claims within a week. If more than a week has passed
              since you submitted your application and you haven’t heard back,
              please don’t apply again. Call us at.
            </p>
          </va-process-list-item>
          <va-process-list-item header="Decision">
            <p>
              Once we’ve processed your claim, you’ll get a notice in the mail
              with our decision.
            </p>
          </va-process-list-item>
        </va-process-list>
        <SaveInProgressIntro
          buttonOnly
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        />
        <p />
        <OMBInfo resBurden={10} ombNumber="2900-0219" expDate="10/31/2024" />
      </article>
    );
  }
}

export default IntroductionPage;
