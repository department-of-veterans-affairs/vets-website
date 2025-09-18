import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

function IntroductionPage({ route }) {
  const { formConfig, pageList } = route;
  useEffect(() => {
    focusElement('.schemaform-title > h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Marital Status Questionnaire for DIC Recipients"
        subtitle="VA Form 21P-0537"
      />

      <p className="va-introtext">
        Use this form to verify your marital status and maintain your
        eligibility for Dependency and Indemnity Compensation (DIC) benefits.
      </p>

      <h2>What to know before you fill out this form</h2>

      <va-alert status="warning" uswds>
        <h3 slot="headline">Time-sensitive response required</h3>
        <p>
          You must complete and submit this form within 60 days to avoid
          potential termination of your DIC benefits.
        </p>
      </va-alert>

      <h3>Why we need this information</h3>
      <p>
        As a recipient of Dependency and Indemnity Compensation (DIC), you're
        required to report any changes in your marital status. Generally, a
        surviving spouse's entitlement to DIC ends with remarriage. However,
        entitlement may continue if:
      </p>
      <ul>
        <li>The marriage began after age 57, or</li>
        <li>The remarriage has been terminated</li>
      </ul>

      <h3>What happens after you submit this form</h3>
      <p>
        We'll review your response to verify your continued eligibility for DIC
        benefits. If you have remarried and are not eligible to continue
        receiving benefits, we may propose to terminate your DIC benefits.
      </p>

      <h3>Your rights</h3>
      <p>You have the right to:</p>
      <ul>
        <li>Submit additional information at any time</li>
        <li>Have a personal hearing to explain or clarify your statements</li>
        <li>
          Be represented at the hearing by a representative of your choice
        </li>
      </ul>

      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start the questionnaire"
        formConfig={formConfig}
      />

      <h3>Need help?</h3>
      <p>If you have questions or need assistance:</p>
      <ul>
        <li>
          <strong>Call us:</strong> 1-877-294-6380 (TTY: 711)
        </li>
        <li>
          <strong>Submit an inquiry online:</strong>{' '}
          <a
            href="https://iris.va.gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://iris.va.gov
          </a>
        </li>
        <li>
          <strong>Write to us:</strong> Include your full name and VA file
          number in your correspondence
        </li>
      </ul>

      <va-omb-info
        res-burden={5}
        omb-number="2900-0495"
        exp-date="12/31/2027"
      />
    </article>
  );
}

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
