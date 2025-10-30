/**
 * @module containers/IntroductionPage
 * @description Introduction page component for VA Form 21P-530A that displays
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
} from '@bio-aquia/21p-530a-interment-allowance/constants';

/** @constant {number} OMB_RES_BURDEN - Estimated burden in minutes to complete form */
const OMB_RES_BURDEN = 5;

/** @constant {string} OMB_NUMBER - Office of Management and Budget control number */
const OMB_NUMBER = '2900-0565';

/** @constant {string} OMB_EXP_DATE - OMB approval expiration date */
const OMB_EXP_DATE = '10/31/2027';

/**
 * Process list component showing the steps to complete the form
 * @returns {React.ReactElement} Process list with application steps
 */
const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>Make sure you meet our eligibility requirements before you apply.</p>
        <p>
          <a href="/burials-memorials/veterans-burial-allowance/">
            Find out if you’re eligible for a Veterans burial allowance and
            transportation benefits
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p>
          <strong>
            You’ll need this information about the deceased Veteran:
          </strong>
        </p>
        <ul>
          <li>Social Security number or VA file number</li>
          <li>Date and place of birth</li>
          <li>Date of death</li>
          <li>Military service history</li>
          <li>Date of burial</li>
          <li>Final resting place</li>
        </ul>
        <p>
          And we’ll ask for your organization’s information. This includes your
          organization’s cemetery name, location, mailing address, and contact
          information.
        </p>
        <p>
          <strong>What if I need help with my application?</strong>
        </p>
        <p>
          An accredited representative, like a Veterans Service Organization
          (VSO), can help you fill out your application.
        </p>
        <p>
          <a href="/get-help-from-accredited-representative/">
            Learn more about getting help from an accredited representative
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Apply">
        <p>
          We’ll take you through each step of the process. This application
          should take about 30 minutes.
        </p>
      </va-process-list-item>
      <va-process-list-item header="After you apply">
        <p>
          We’ll contact you by mail if we need more information. Once we process
          your application, we’ll mail you a letter with our decision.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

/**
 * Introduction page for VA Form 21P-530A Application for Interment Allowance
 * @param {Object} props - Component properties
 * @param {Object} props.route - Route configuration from react-router
 * @param {Object} props.route.formConfig - Form configuration object
 * @param {Array} props.route.pageList - List of form pages
 * @param {Object} props.location - Location object from react-router
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
      <p>
        Use this form if you’re a state or tribal organization to apply for a VA
        interment allowance for a Veteran buried in a State or Tribal Veterans'
        cemetery.
      </p>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow these steps to apply for a burial allowance
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
          startText="Start the state and tribal organization burial allowance benefits application"
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
