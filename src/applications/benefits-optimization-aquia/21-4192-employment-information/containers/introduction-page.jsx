/**
 * @module containers/IntroductionPage
 * @description Introduction page component for VA Form 21-4192
 */

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import {
  SUBTITLE,
  TITLE,
} from '@bio-aquia/21-4192-employment-information/constants';

/**
 * Introduction page component for VA Form 21-4192
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
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Follow these steps to apply for a burial allowance
      </h2>

      <va-process-list>
        <va-process-list-item header="Check your eligibility">
          <p>
            Make sure you meet our eligibility requirements before you apply.{' '}
            <a href="/burials-memorials/veterans-burial-allowance/">
              Find out if you’re eligible for a Veterans burial allowance and
              transportation benefits
            </a>
            .
          </p>
        </va-process-list-item>

        <va-process-list-item header="Gather your information">
          <p>You’ll need this information about the deceased Veteran:</p>
          <ul>
            <li>Social Security number or VA file number</li>
            <li>Date and place of birth</li>
            <li>Date of death</li>
            <li>Military service history</li>
            <li>Date of burial</li>
            <li>Final resting place</li>
          </ul>
          <p>
            And we’ll ask for your organization’s information. This includes
            your organization’s cemetery name, location, mailing address, and
            contact information.
          </p>
          <p>You may also need to provide copies of these documents:</p>
          <ul>
            <li>
              The Veteran’s death certificate including the cause of death
            </li>
            <li>
              An itemized receipt for transportation costs (only if you paid
              transportation costs for the Veteran’s remains)
            </li>
          </ul>
          <p>
            We also recommend providing a copy of the Veteran’s DD214 or other
            separation documents including all their service periods.
          </p>
          <p>
            If you don’t have their DD214 or other separation documents, you can
            request these documents now.{' '}
            <a href="/records/get-military-service-records/">
              Learn more about requesting military service records
            </a>
            .
          </p>
          <h4>What if I need help with my application?</h4>
          <p>
            An accredited representative, like a Veterans Service Organization
            (VSO), can help you fill out your application.{' '}
            <a href="/disability/get-help-filing-claim/">
              Learn more about getting help from an accredited representative
            </a>
            .
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
            We’ll contact you by mail if we need more information. Once we
            process your application, we’ll mail you a letter with our decision.
          </p>
        </va-process-list-item>
      </va-process-list>
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
      <va-omb-info
        res-burden="15"
        omb-number="2900-0065"
        exp-date="08/31/2027"
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
