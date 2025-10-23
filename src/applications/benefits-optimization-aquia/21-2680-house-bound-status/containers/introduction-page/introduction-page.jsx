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
      <va-process-list-item header="Send your form to a medical examiner">
        <p>
          Download a PDF version of the form after you finish it. Then send it
          to a medical examiner so they can fill out their portion with medical
          information about the person applying. We recommend sending it via
          email.
        </p>
        <p>
          Once the medical examiner has completed their part of the form and
          signed it, they’ll return it to you.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Submit your application">
        <p>
          Submit the completed form with both your signature and the medical
          examiner’s signature to VA.
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

      <p>
        Use this form to begin your application for Aid and Attendance or
        Housebound allowance benefits. If you’re eligible, we’ll add these
        benefits to your monthly compensation or pension benefits.
      </p>

      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Follow these steps to get started
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
