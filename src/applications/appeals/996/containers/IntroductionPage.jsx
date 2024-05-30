import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import recordEvent from 'platform/monitoring/record-event';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

import {
  BASE_URL,
  SUPPLEMENTAL_CLAIM_URL,
  FACILITY_LOCATOR_URL,
  GET_HELP_REVIEW_REQUEST_URL,
} from '../constants';

import ShowAlertOrSip from '../../shared/components/ShowAlertOrSip';

export const IntroductionPage = props => {
  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  });

  const { route, location } = props;
  const { formConfig, pageList } = route;
  const { formId, prefillEnabled, savedFormMessages, downtime } = formConfig;

  const sipOptions = {
    // ariaDescribedby: 'main-content',
    downtime,
    formId,
    gaStartEventName: 'decision-reviews-va20-0996-start-form',
    headingLevel: 2,
    hideUnauthedStartLink: true,
    messages: savedFormMessages,
    pageList,
    pathname: '/introduction',
    prefillEnabled,
    startText: 'Start the Request for a Higher-Level Review',
    useActionLinks: true,
  };

  const restartWizard = () => {
    recordEvent({ event: 'howToWizard-start-over' });
  };

  const pageTitle = 'Request a Higher-Level Review with VA Form 20-0996';
  const subTitle = 'VA Form 20-0996 (Higher-Level Review)';

  return (
    <div className="schemaform-intro">
      <FormTitle title={pageTitle} subTitle={subTitle} />

      <ShowAlertOrSip basename={location.basename} sipOptions={sipOptions} />

      <h2 className="vads-u-margin-top--2">What’s a Higher-Level Review?</h2>
      <p>
        If you or your representative disagree with VA’s decision on your claim,
        you can request a Higher-Level Review. With a Higher-Level Review, a
        higher-level reviewer will take a new look at your case and the evidence
        you already provided. The reviewer will decide whether the decision can
        be changed based on a difference of opinion or an error.
      </p>
      <h2>You can’t submit new evidence with a Higher-Level Review</h2>
      <p>
        The higher-level reviewer will only review the evidence you already
        provided. If you have new and relevant evidence, you can{' '}
        <a href={SUPPLEMENTAL_CLAIM_URL}>file a Supplemental Claim</a>.
      </p>
      <h2>Follow the steps below to request a Higher-Level Review.</h2>
      <p className="vads-u-margin-top--2">
        If you don’t think this is the right form for you,{' '}
        <a
          href={`${BASE_URL}/start`}
          className="va-button-link"
          onClick={restartWizard}
        >
          go back and answer questions again
        </a>
        .
      </p>
      <va-process-list uswds>
        <va-process-list-item header="Prepare">
          <p>To fill out this application, you’ll need your:</p>
          <ul>
            <li>Primary address</li>
            <li>
              List of issues you disagree with and the VA decision date for each
            </li>
            <li>Representative’s contact information (optional)</li>
          </ul>
          <p>
            <strong>What if I need help with my application?</strong>
          </p>
          <p>
            If you need help requesting a Higher-Level Review, you can contact a
            VA regional office and ask to speak to a representative. To find the
            nearest regional office, please call{' '}
            <va-telephone contact={CONTACTS.VA_BENEFITS} />
            {' or '}
            <a href={FACILITY_LOCATOR_URL}>visit our facility locator tool</a>.
          </p>
          <p>
            A Veterans Service Organization or VA-accredited attorney or agent
            can also help you request a decision review.
          </p>
          <a href={GET_HELP_REVIEW_REQUEST_URL}>
            Get help requesting a decision review
          </a>
          .
        </va-process-list-item>
        <va-process-list-item header="Start your request">
          <p>
            Complete this Higher-Level Review form. After submitting the form,
            you’ll get a confirmation message. You can print this for your
            records.
          </p>
        </va-process-list-item>
      </va-process-list>

      <ShowAlertOrSip
        basename={location.basename}
        sipOptions={sipOptions}
        bottom
      />

      <div className="omb-info--container vads-u-padding-left--0">
        <va-omb-info
          res-burden={15}
          omb-number="2900-0862"
          exp-date="04/30/2024"
        />
      </div>
    </div>
  );
};

IntroductionPage.propTypes = {
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      downtime: PropTypes.shape({}),
      formId: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
