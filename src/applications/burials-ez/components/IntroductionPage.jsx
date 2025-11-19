import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

const IntroductionPage = ({ route }) => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pbbFormsRequireLoa3 = useToggleValue(TOGGLE_NAMES.pbbFormsRequireLoa3);

  return (
    <div className="schemaform-intro vads-u-margin-bottom--6">
      <FormTitle title="Apply for a Veterans burial allowance and transportation benefits" />
      <p className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--neg3">
        Application for Burial Benefits (VA Form 21P-530EZ)
      </p>
      <h2 className="vads-u-font-size--h2">Follow the steps below to apply:</h2>
      <va-process-list>
        <va-process-list-item header="Check your eligibility">
          <p className="vads-u-margin-bottom--0">
            Make sure you meet our eligibility requirements before you apply.
          </p>
          <p>
            <va-link
              href="/burials-memorials/veterans-burial-allowance"
              text="Find out if you're eligible for a Veterans burial allowance and transportation benefits"
            />
          </p>
        </va-process-list-item>
        <va-process-list-item header="Gather your information">
          <p>Here’s what you’ll need to apply:</p>
          <ul>
            <li>
              <strong>Veteran’s personal information:</strong> This includes
              date of birth, Social Security number or VA file number, and
              military service history.
            </li>
            <li>
              <strong>Your personal information:</strong> This includes Social
              Security number, date of birth, mailing address, and contact
              information.
            </li>
            <li>
              <strong>Information about the Veteran’s death:</strong> This
              includes the date and place of death, the date of burial, and the
              final resting place. You’ll also need to submit a copy of the
              Veteran’s death certificate.
            </li>
          </ul>
          <p>
            We recommend that you provide a copy of the Veteran’s Certificate of
            Release or Discharge from Active Duty (DD214) or other separation
            documents that include all their service periods. If you don’t have
            the Veteran’s DD214 or other separation documents, you can request
            them.
          </p>
          <va-link
            href="/records/get-military-service-records/"
            text="Find out how to request military service records"
          />
          <p>
            Depending on your situation, you may need to submit additional
            supporting documents such as medical records or receipts for
            transportation costs.
          </p>

          <va-link
            href="/get-help-from-accredited-representative/"
            text="Find out what supporting documents you may need to submit"
          />
        </va-process-list-item>
        <va-process-list-item header="Start your application">
          <p>
            We’ll take you through each step of the process. It should take
            about 30 minutes.
          </p>
          <va-additional-info trigger="What happens after you apply?">
            We’ll contact you by mail if we need more information. Once we
            process your application, we’ll mail you a letter with our decision.
          </va-additional-info>
        </va-process-list-item>
      </va-process-list>
      <SaveInProgressIntro
        hideUnauthedStartLink={pbbFormsRequireLoa3}
        headingLevel={2}
        prefillEnabled={route.formConfig.prefillEnabled}
        pageList={route.pageList}
        downtime={route.formConfig.downtime}
        startText="Start the burial allowance and transportation benefits application"
      />
      <div className="omb-info--container vads-u-margin-top--3 vads-u-padding-left--0">
        <va-omb-info
          res-burden={30}
          omb-number="2900-0003"
          exp-date="08/31/2025"
        />
      </div>
    </div>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    pageList: PropTypes.array,
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      downtime: PropTypes.object,
    }),
  }),
  router: PropTypes.object,
};

export default IntroductionPage;
