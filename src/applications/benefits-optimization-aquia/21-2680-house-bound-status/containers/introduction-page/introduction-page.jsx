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
import IdNotVerifiedAlert from '../../../../simple-forms/shared/components/IdNotVerified';

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
      <va-process-list-item header="Check our eligibility requirements before you apply">
        <p>
          If you think you may be eligible, but you’re not sure, we encourage
          you to apply.
        </p>
        <p>
          You may be eligible for either Special Monthly Compensation (SMC) or
          Special Monthly Pension (SMP) benefits if you:
        </p>
        <ul>
          <li>Are a Veteran or the surviving spouse or parent of a Veteran</li>
          <li>
            Require help with everyday tasks, such as:
            <ul>
              <li>Bathing</li>
              <li>Feeding</li>
              <li>Dressing</li>
              <li>Using the restroom</li>
              <li>Adjusting prosthetic devices</li>
              <li>
                Protecting yourself from the hazards of the daily environment
              </li>
            </ul>
          </li>
          <li>Are housebound (because of permanent disability)</li>
          <li>
            Are a Veteran, and your spouse is in need of regular aid and
            attendance
          </li>
        </ul>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p>You’ll need this information about the person applying:</p>
        <ul>
          <li>Their name</li>
          <li>Their date of birth</li>
          <li>Their social security number</li>
          <li>Their mailing address</li>
          <li>Their home phone number</li>
        </ul>
        <p>
          If the person applying is currently in the hospital, we’ll need to
          know the name of the hospital and the date they were admitted.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Fill out the form">
        <p>Fill out the form and sign it digitally.</p>
      </va-process-list-item>
      <va-process-list-item header="Have an examiner complete the remaining sections">
        <p>
          Download a PDF version of the form after you finish it. Then send it
          to an examiner so they can fill out their portion with medical
          information about the person applying.
        </p>
        <p>
          The examiner must be a Medical Doctor (MD) or Doctor of Osteopathic
          (DO) medicine, physician assistant or advanced practice registered
          nurse.
        </p>
        <p>
          Once the medical examiner has completed their part of the form and
          signed it, they’ll return it to you.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Upload your fully completed form.">
        <p>
          <va-link-action
            href="/forms/upload/21-2680/introduction"
            text="Upload your completed VA form 21-2680"
          />
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

      <p className="vads-u-font-size--lg vads-u-font-family--serif vads-u-font-weight--normal vads-u-line-height--4">
        Use this form to begin your application for Aid and Attendance or
        Housebound allowance benefits. If you’re eligible, we’ll add these
        benefits to your monthly compensation or pension benefits.
      </p>

      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Follow these steps to get started
      </h2>

      <ProcessList />

      <div className="vads-u-margin-bottom--4">
        <va-additional-info trigger="What happens after you apply">
          <p>
            We’ll contact you by mail if we need more information. Once we
            process your application, we’ll mail you a letter with our decision.
          </p>
        </va-additional-info>
      </div>

      {showVerifyIdentity ? (
        <IdNotVerifiedAlert formType="application" formNumber="21-2680" />
      ) : (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          verifiedPrefillAlert={<></>}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start your application"
          hideUnauthedStartLink
          devOnly={{
            forceShowFormControls: true,
          }}
        />
      )}

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
