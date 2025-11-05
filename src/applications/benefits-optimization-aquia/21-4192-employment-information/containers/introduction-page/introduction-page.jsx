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

      <p className="vads-u-font-size--lg">
        Use this form if you’re an employer to provide employment information
        for a Veteran who has filed a claim for compensation.
      </p>

      <h2 className="vads-u-margin-top--3">
        What to know before you fill out this form
      </h2>
      <p>
        Only an employer or authorized representative can fill out this form.
        You’ll provide information about the Veteran’s employment, including
        dates of employment, earnings, and any concessions made due to age or
        disability.
      </p>

      <p className="vads-u-margin-top--2">
        You’ll need to provide the following information about the Veteran:
      </p>
      <ul>
        <li>Social Security number or VA file number</li>
        <li>Date of birth</li>
        <li>Full name</li>
      </ul>

      <p>You’ll also need to provide employment information including:</p>
      <ul>
        <li>Dates of employment</li>
        <li>Type of work performed</li>
        <li>Earnings and hours worked</li>
        <li>Any concessions made due to age or disability</li>
        <li>
          Information about termination (if applicable) and last payment details
        </li>
      </ul>

      <VaLinkAction
        href="/veteran-information"
        data-testid="start-employment-info-link"
        onClick={e => {
          e.preventDefault();
          router.push('/veteran-information');
        }}
        text="Start the employment information request"
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

export default IntroductionPage;
