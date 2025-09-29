/**
 * @module containers/IntroductionPage
 * @description Introduction page component for VA Form 21-4192 that displays
 * form overview, process steps, and save-in-progress functionality
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
} from '@bio-aquia/21-4192-employment-information/constants';

/** @constant {number} OMB_RES_BURDEN - Estimated burden in minutes to complete form */
const OMB_RES_BURDEN = 15;

/** @constant {string} OMB_NUMBER - Office of Management and Budget control number */
const OMB_NUMBER = '2900-0065';

/** @constant {string} OMB_EXP_DATE - OMB approval expiration date */
const OMB_EXP_DATE = '08/31/2027';

/**
 * Process list component showing the steps to complete the form
 * @returns {React.ReactElement} Process list with application steps
 */
const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Prepare">
        <h4>Information needed from the employer:</h4>
        <ul>
          <li>Veteran’s full name and Social Security number</li>
          <li>Employment start and end dates</li>
          <li>Job title and duties performed</li>
          <li>Earnings and time lost due to disability</li>
          <li>Any concessions made due to disability</li>
          <li>Termination details (if applicable)</li>
        </ul>
        <p>
          <strong>Note:</strong> This form must be completed by the employer or
          an authorized representative of the organization.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Complete">
        <p>
          The employer should complete all applicable sections of this form,
          including employment information, benefit details, and certification.
        </p>
        <p>
          For Reserve or National Guard members, additional information about
          duty status may be required.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Submit">
        <p>
          Once completed, this form should be submitted along with the Veteran’s
          VA Form 21-8940 (Application for Increased Compensation Based on
          Unemployability).
        </p>
        <p>Submit by mail to:</p>
        <p className="va-address-block">
          Department of Veterans Affairs
          <br />
          Evidence Intake Center
          <br />
          P.O. Box 4444
          <br />
          Janesville, WI 53547-4444
        </p>
      </va-process-list-item>
      <va-process-list-item header="Processing">
        <p>
          VA will review the employment information as part of the Veteran’s
          Individual Unemployability claim. This information helps determine if
          service-connected disabilities prevent substantially gainful
          employment.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

/**
 * Introduction page component for VA Form 21-4192
 * Displays form overview, process steps, and handles authentication state
 * @param {Object} props - Component properties
 * @param {Object} props.route - Route configuration from React Router
 * @param {Object} props.route.formConfig - Form configuration object
 * @param {boolean} props.route.formConfig.prefillEnabled - Whether prefill is enabled
 * @param {Object} props.route.formConfig.savedFormMessages - Messages for saved forms
 * @param {Array} props.route.pageList - List of form pages
 * @param {Object} [props.location] - React Router location object
 * @returns {React.ReactElement} Introduction page component
 */
export const IntroductionPage = ({ route }) => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const { formConfig, pageList } = route;
  const showVerifyIdentify = userLoggedIn && !userIdVerified;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for benefits.
      </h2>
      <ProcessList />
      {showVerifyIdentify ? (
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
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
