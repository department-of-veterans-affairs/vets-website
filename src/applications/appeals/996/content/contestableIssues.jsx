import React, { useRef, useEffect } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { scrollAndFocus } from 'platform/utilities/ui';

import {
  BOARD_APPEALS_URL,
  COVID_FAQ_URL,
  DECISION_REVIEWS_URL,
  MAX_LENGTH,
} from '../constants';
import DownloadLink from './DownloadLink';

// We shouldn't ever see the couldn't find contestable issues message since we
// prevent the user from navigating past the intro page; but it's here just in
// case we end up filtering out deferred and expired issues
export const ContestableIssuesTitle = ({ formData = {} } = {}) => {
  if (formData.contestedIssues?.length === 0) {
    return (
      <>
        <h2
          className="vads-u-font-size--h4 vads-u-margin-top--0"
          name="eligibleScrollElement"
        >
          Sorry, we couldn’t find any eligible issues
        </h2>
        <p>
          If you’d like to add an issue for review, please select "Add a new
          issue" to get started.
        </p>
      </>
    );
  }
  return (
    <>
      <div className="vads-u-margin-bottom--2">
        These issues are in your VA record. If an issue is missing from this
        list, you can add it.
      </div>
      <legend
        name="eligibleScrollElement"
        className="vads-u-font-weight--normal vads-u-font-size--base"
      >
        Select the issue(s) you’d like us to review:
      </legend>
    </>
  );
};

const disabilitiesList = (
  <div>
    <p>Your issue may not be eligible for review if:</p>
    <ul>
      <li>
        We made the decision over a year ago. You have 1 year from the date on
        your decision letter to request a Higher-Level Review.{' '}
        <strong>Note:</strong> If you aren’t able to request a timely review due
        to COVID-19, we may grant you a deadline extension. To request an
        extension, fill out and submit VA Form 20-0996, with a note attached
        that you’re requesting an extension due to COVID-19.
      </li>
      <li>
        Your issue is for a benefit type other than compensation or pension. To
        request a Higher-Level Review for another benefit type, you’ll need to
        fill out VA Form 20-0996 and submit it by mail or in person.
      </li>
      <li>
        The issue or decision isn’t in our system yet. You’ll need to fill out
        VA Form 20-0996 and submit it by mail or in person.
      </li>
      <li>
        You and another surviving dependent of the Veteran are applying for the
        same benefit. And by law, only 1 of you can receive that benefit. You’ll
        need to{' '}
        <a href={BOARD_APPEALS_URL}>appeal to the Board of Veterans’ Appeals</a>
        .
      </li>
      <li>
        You’re requesting a review of a Board of Veterans’ Appeals decision.
        Refer to your decision notice for your options.
      </li>
      <li>
        You’re requesting a review of a Higher-Level Review decision. You’ll
        need to either file a Supplemental Claim or appeal to the Board of
        Veterans’ Appeals.
      </li>
    </ul>
    <p>
      <DownloadLink content="Download VA Form 20-0996" />
    </p>
    <p className="vads-u-margin-top--2p5">
      To learn more about how COVID-19 may affect claims or appeals, please
      visit our <a href={COVID_FAQ_URL}>coronavirus FAQ page</a>.
    </p>
    <p className="vads-u-padding-bottom--2p5">
      To learn more about decision review options, please visit our{' '}
      <a href={DECISION_REVIEWS_URL}>decision reviews and appeals</a>{' '}
      information page. You can call us at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} /> or work with an accredited
      representative to{' '}
      <a href="/disability/get-help-filing-claim/">get help with your claim</a>.
    </p>
  </div>
);

export const disabilitiesExplanationAlert = (
  <>
    <p className="vads-u-margin-top--2p5" />
    <va-additional-info trigger="Why isn’t my issue eligible?">
      {disabilitiesList}
    </va-additional-info>
  </>
);

export const disabilitiesExplanation = (
  <va-additional-info trigger="Don’t see the issue you’re looking for?">
    {disabilitiesList}
  </va-additional-info>
);

export const maxSelectedErrorMessage =
  'You’ve reached the maximum number of allowed selected issues';

// Not setting "visible" as a variable since we're controlling rendering at a
// higher level
export const MaxSelectionsAlert = ({ closeModal }) => (
  <VaModal
    modalTitle={maxSelectedErrorMessage}
    status="warning"
    onCloseEvent={closeModal}
    visible
  >
    You are limited to {MAX_LENGTH.SELECTIONS} selected issues for each
    Higher-Level Review request. If you would like to select more than{' '}
    {MAX_LENGTH.SELECTIONS}, please submit this request and create a new request
    for the remaining issues.
  </VaModal>
);

export const noneSelected = 'Please select at least one issue';

/**
 * Shows the alert box only if the form has been submitted
 */
export const NoneSelectedAlert = ({ count }) => {
  const wrapAlert = useRef(null);

  useEffect(
    () => {
      if (wrapAlert?.current) {
        scrollAndFocus(wrapAlert.current);
      }
    },
    [wrapAlert],
  );
  return (
    <div ref={wrapAlert}>
      <va-alert status="error">
        <h3
          slot="headline"
          className="eligible-issues-error vads-u-margin-x--2 vads-u-margin-y--1 vads-u-padding-x--3 vads-u-padding-y--2"
        >
          {`Please ${
            count === 0 ? 'add, and select,' : 'select'
          } at least one issue, so we can process your request`}
        </h3>
      </va-alert>
    </div>
  );
};
