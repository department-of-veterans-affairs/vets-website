/**
 * @module containers/IntroductionPage
 * @description Introduction page component for VA Form 21-4192
 */

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import {
  SUBTITLE,
  TITLE,
} from '@bio-aquia/21-4192-employment-information/constants';

const OMB_RES_BURDEN = 15;
const OMB_NUMBER = '2900-0065';
const OMB_EXP_DATE = '08/31/2027';

/**
 * Introduction page component for VA Form 21-4192
 * @returns {React.ReactElement} Introduction page component
 */
export const IntroductionPage = ({ router }) => {
  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />

      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        Follow these steps to provide information about an employee
      </h2>

      <va-process-list>
        <va-process-list-item header="Gather your information">
          <p>
            <strong>
              You’ll need this information about the Veteran’s employer:
            </strong>
          </p>
          <ul>
            <li>The business name of the employer</li>
            <li>The address</li>
          </ul>
          <p>
            <strong>
              You’ll need this information about the Veteran seeking benefits:
            </strong>
          </p>
          <ul>
            <li>Their name</li>
            <li>Their date of birth</li>
            <li>Their social security number</li>
            <li>
              When they started working and, if applicable, when they stopped
              working
            </li>
            <li>The type of work they did</li>
            <li>Whether any concessions were made due to age or disability</li>
            <li>
              Whether they received any entitlements or benefits while employed
            </li>
            <li>Details about the last payment made to them</li>
            <li>Their National Guard or Reserve status</li>
          </ul>
        </va-process-list-item>

        <va-process-list-item header="Fill out and sign the form">
          <p>
            We’ll take you through each step of the process. It should take
            about 15 minutes to complete this form.
          </p>
        </va-process-list-item>

        <va-process-list-item header="Submit the form">
          <p>
            After you submit the form, you’ll receive a confirmation message.
            You can print this for your records.
          </p>
        </va-process-list-item>
      </va-process-list>

      <VaLinkAction
        href="/veteran-information"
        data-testid="start-employment-info-link"
        onClick={e => {
          e.preventDefault();
          router.push('/veteran-information');
        }}
        text="Submit employment information in connection with claim for Individual Unemployability"
      />
      <div className="vads-u-margin-top--4">
        <va-omb-info
          res-burden={OMB_RES_BURDEN}
          omb-number={OMB_NUMBER}
          exp-date={OMB_EXP_DATE}
        />
      </div>
    </article>
  );
};

IntroductionPage.propTypes = {
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};
