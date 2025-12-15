import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { TITLE, SUBTITLE } from '../constants';

import OMBInfo from '../components/OMBInfo';
import PrivacyAccordion from '../components/PrivacyAccordion';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Gather your information">
        <h4>Here’s what you’ll need to apply:</h4>
        <ul>
          <li>Your current mailing address and contact information</li>
          <li>
            The name and address of your institution and all additional
            locations
          </li>
          <li>The details of the program(s) you are applying for</li>
          <li>
            If the program is a medical program you’ll need to have recent
            program graduate information available
          </li>
          <li>
            The contact information for your institution’s financial
            representative
          </li>
          <li>
            Documentation that provides details of your institution’s financial
            health
          </li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Complete the form">
        <p>
          The application should take about 20 minutes to complete. You’ll be
          provided the opportunity to apply for the approval of your foreign
          program(s) and include information relevant to your application.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Download the completed form">
        <p>
          When you reach the final step of this form, be sure to download and
          save the PDF to your device. <strong>Please note:</strong> this online
          tool does not submit the form for you. You must download your
          completed form as a PDF and proceed to the next step.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Email your completed form to Federal.Approvals@va.gov">
        <p>
          If your institution doesn’t have a VA facility code or if you are
          submitting the form because your institution has changed ownership:
          Email your completed PDF to{' '}
          <a href="mailto:Federal.Approvals@va.gov">Federal.Approvals@va.gov</a>
          .
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

const customLink = ({ children, ...props }) => {
  return (
    <va-link-action
      type="primary-entry"
      text="Start your application"
      {...props}
    >
      {children}
    </va-link-action>
  );
};

export const IntroductionPage = props => {
  const { route } = props;
  const { formConfig, pageList } = route;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <p className="vads-u-font-size--lg vads-u-font-family--serif vads-u-color--base vads-u-font-weight--normal">
        VA Form 22-0976 is used by foreign educational institutions that wish to
        offer degree programs eligible for VA education benefits and must be
        completed by an authorized school official representing a foreign
        institution.
      </p>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        What you’ll need to complete this form
      </h2>
      <ProcessList />
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        pageList={pageList}
        startText="Start your application"
        customLink={customLink}
        devOnly={{
          forceShowFormControls: true,
        }}
      />
      <p />
      <OMBInfo />
      <PrivacyAccordion />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
