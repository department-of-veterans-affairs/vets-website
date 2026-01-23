import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';
import { formatDateLong } from 'platform/utilities/date';
import { showPdfFormAlignment } from '../utils/helpers';

const IntroductionPage = ({ route }) => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  const loggedIn = useSelector(isLoggedIn);
  // LOA3 Verified?
  const isVerified = useSelector(
    state => selectProfile(state)?.verified || false,
  );
  const hasInProgressForm = useSelector(state =>
    selectProfile(state)?.savedForms?.some(
      form => form.form === route.formConfig.formId,
    ),
  );

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const pbbFormsRequireLoa3 = useToggleValue(TOGGLE_NAMES.pbbFormsRequireLoa3);

  const launchDate = '2026-02-19';

  const FormUpdateText = () => (
    <>
      <p>
        You should know that we updated our online form.{' '}
        <strong>
          If you started applying online before {formatDateLong(launchDate)}
        </strong>
        , we have some new questions for you to answer. And we changed some
        questions, so you may need to provide certain information again.
      </p>
      <p>
        Select <strong>Continue your application</strong> to use our updated
        form. Or come back later to finish your application.
      </p>
    </>
  );

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
              text="Find out if you’re eligible for a Veterans burial allowance and transportation benefits"
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
          <p>
            <va-link
              href="/records/get-military-service-records/"
              text="Find out how to request military service records"
            />
          </p>
          <p>
            Depending on your situation, you may need to submit additional
            supporting documents such as medical records or receipts for
            transportation costs.
          </p>
          <p>
            <va-link
              href="/burials-memorials/veterans-burial-allowance/#what-documents-do-i-need-to-su"
              text="Find out what supporting documents you may need to submit"
            />
          </p>
        </va-process-list-item>
        <va-process-list-item header="Start your application">
          <p>
            We’ll take you through each step of the process. It should take
            about 30 minutes.
          </p>
          <va-additional-info trigger="What happens after you apply?">
            <p>
              We’ll contact you by mail if we need more information. Once we
              process your application, we’ll mail you a letter with our
              decision.
            </p>
          </va-additional-info>
        </va-process-list-item>
      </va-process-list>

      {/* Only show the verify alert if all of the following are true:
        - the user is logged in
        - the feature toggle is enabled
        - the user is NOT LOA3 verified
        - the user does not have an in-progress form (we want LOA1 users to be
          able to continue their form)
      */}
      {loggedIn && pbbFormsRequireLoa3 && !isVerified && !hasInProgressForm ? (
        <>
          <VerifyAlert />
          <p>
            If you don’t want to verify your identity right now, you can still
            download and complete the PDF version of this application.
          </p>
          <p className="vads-u-margin-bottom--4">
            <va-link
              href="https://www.vba.va.gov/pubs/forms/VBA-21P-530EZ-ARE.pdf"
              download
              filetype="PDF"
              text="Get VA Form 21P-530EZ form to download"
              pages="8"
            />
          </p>
        </>
      ) : (
        <SaveInProgressIntro
          hideUnauthedStartLink={pbbFormsRequireLoa3}
          headingLevel={2}
          prefillEnabled={route.formConfig.prefillEnabled}
          pageList={route.pageList}
          downtime={route.formConfig.downtime}
          startText="Start the burial allowance and transportation benefits application"
          continueMsg={showPdfFormAlignment() ? <FormUpdateText /> : null}
        />
      )}

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
      formId: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      downtime: PropTypes.object,
    }),
  }),
  router: PropTypes.object,
};

export default IntroductionPage;
