/**
 * @module containers/IntroductionPage
 * @description Introduction page for VA Form 21-2680
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';

import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-2680-house-bound-status/constants';

/** @constant {number} OMB_RES_BURDEN - Estimated burden in minutes */
const OMB_RES_BURDEN = 30;

/** @constant {string} OMB_NUMBER - OMB control number */
const OMB_NUMBER = '2900-0721';

/** @constant {string} OMB_EXP_DATE - OMB expiration date */
const OMB_EXP_DATE = '02/28/2026';

/**
 * Process list component
 * @returns {React.ReactElement} Process steps
 */
const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Prepare">
        <h4>What you’ll need:</h4>
        <p>
          <strong>For the claimant (Sections I-V):</strong>
        </p>
        <ul>
          <li>Veteran’s name, SSN, and VA file number (if applicable)</li>
          <li>Date of birth and service number (if applicable)</li>
          <li>Your contact information if you’re not the Veteran</li>
          <li>Current hospitalization status and details</li>
        </ul>
        <p>
          <strong>For the clinician (Sections VI-VIII):</strong>
        </p>
        <ul>
          <li>Medical diagnoses and permanent/total disabilities</li>
          <li>Functional limitations and ADL assistance needs</li>
          <li>Vision status and nursing home care requirements</li>
          <li>NPI number and facility information</li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Complete the form">
        <p>
          <strong>Claimant completes first:</strong> Fill out Sections I-V,
          including benefit type selection (SMC or SMP) and sign.
        </p>
        <p>
          <strong>Clinician completes next:</strong> An MD, DO, Physician
          Assistant, or Advanced Practice Registered Nurse must complete the
          examination sections (VI-VIII).
        </p>
      </va-process-list-item>
      <va-process-list-item header="Submit">
        <p>Once both sections are complete, submit the form to VA.</p>
        <p>
          If the form indicates nursing home care is needed, you may also need
          to submit VA Form 21-0779.
        </p>
      </va-process-list-item>
      <va-process-list-item header="VA Review">
        <p>
          VA will review the examination to determine eligibility for Aid and
          Attendance or Housebound benefits.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

/**
 * Introduction page component
 * @param {Object} props - Component properties
 * @returns {React.ReactElement} Introduction page
 */
export const IntroductionPage = ({ route }) => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const { formConfig, pageList } = route;
  const showVerifyIdentity = userLoggedIn && !userIdVerified;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />

      <va-alert status="info" show-icon class="vads-u-margin-bottom--2">
        <h3 slot="headline">Two-part form</h3>
        <p>
          This form has two parts: The claimant (Veteran or survivor) completes
          Sections I-V, then a qualified medical professional completes the
          examination sections (VI-VIII).
        </p>
      </va-alert>

      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Follow the steps below to apply for Aid and Attendance or Housebound
        benefits.
      </h2>

      <ProcessList />

      {showVerifyIdentity ? (
        <div>{/* add verify identity alert if applicable */}</div>
      ) : (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the application"
          devOnly={{
            forceShowFormControls: true,
          }}
        />
      )}

      <p />
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
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
};
