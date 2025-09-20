/**
 * @module containers/IntroductionPage
 * @description Introduction page component for VA Form 21-2680 that displays
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
} from '@bio-aquia/21-2680-house-bound-status/constants';

/** @constant {number} OMB_RES_BURDEN - Estimated burden in minutes to complete form */
const OMB_RES_BURDEN = 30;

/** @constant {string} OMB_NUMBER - Office of Management and Budget control number */
const OMB_NUMBER = '2900-0721';

/** @constant {string} OMB_EXP_DATE - OMB approval expiration date */
const OMB_EXP_DATE = '02/28/2026';

/**
 * Process list component showing the steps to complete the form
 * @returns {React.ReactElement} Process list with application steps
 */
const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Prepare">
        <h4>To fill out this application, you’ll need your:</h4>
        <ul>
          <li>Social Security number (required)</li>
        </ul>
        <p>
          <strong>What if I need help filling out my application?</strong> An
          accredited representative, like a Veterans Service Officer (VSO), can
          help you fill out your claim.{' '}
          <a href="/disability-benefits/apply/help/index.html">
            Get help filing your claim
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Apply">
        <p>Complete this benefits form.</p>
        <p>
          After submitting the form, you’ll get a confirmation message. You can
          print this for your records.
        </p>
      </va-process-list-item>
      <va-process-list-item header="VA Review">
        <p>
          We process claims within a week. If more than a week has passed since
          you submitted your application and you haven’t heard back, please
          don’t apply again. Call us at.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Decision">
        <p>
          Once we’ve processed your claim, you’ll get a notice in the mail with
          our decision.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

/**
 * Introduction page component for VA Form 21-2680
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
export const IntroductionPage = props => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const { route } = props;
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
