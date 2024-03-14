import React, { useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { FORMAT_READABLE } from '../../shared/constants';
import { getSelected, getIssueName } from '../../shared/utils/issues';
import { scrollAndFocusTarget } from '../utils/focus';

export const ConfirmationPage = ({ data }) => {
  useEffect(() => {
    scrollAndFocusTarget();
  });
  const issues = getSelected(data || []).map((issue, index) => (
    <li key={index} className="vads-u-margin-bottom--0">
      <span className="dd-privacy-hidden" data-dd-action-name="issue name">
        {getIssueName(issue)}
      </span>
    </li>
  ));
  const submitDate = moment();
  const handlers = {
    print: () => window.print(),
  };

  return (
    <div>
      <div name="topScrollElement" />
      <div name="topNavScrollElement" />
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
        <h2>Request for Board Appeal</h2>
      </div>
      <h1>Your request has been submitted</h1>
      <p>We may contact you for more information or documents.</p>
      <p className="screen-only">Print this page for your records.</p>

      <va-summary-box uswds class="vads-u-margin-y--2">
        <h1 className="vads-u-margin-top--0">
          Request a Board Appeal{' '}
          <span className="additional">(Form 10182)</span>
        </h1>
        for{' '}
        <span className="dd-privacy-hidden" data-dd-action-name="full name">
          HECTOR BAKER
        </span>
        {submitDate.isValid() && (
          <p>
            <strong>Date submitted</strong>
            <br role="presentation" />
            <span>{submitDate.format(FORMAT_READABLE)}</span>
          </p>
        )}
        <strong>
          Issue
          {issues?.length > 1 ? 's' : ''} submitted
        </strong>
        <ul className="vads-u-margin-top--0">{issues || null}</ul>
        <va-button
          class="screen-only"
          onClick={handlers.print}
          text="Print this for your records"
          uswds
        />
      </va-summary-box>

      <h2>After you request a decision review</h2>
      <p>
        When we’ve completed your review, we will physically mail you a decision
        packet that includes details about our decision.{' '}
        <a href="/decision-reviews/after-you-request-review/">
          Learn more about what happens after you request a review
        </a>
        .
      </p>

      <h2>What should I do while I wait?</h2>
      <p>
        You don’t need to do anything unless we send you a letter asking for
        more information. If we schedule any exams for you, be sure not to miss
        them.
      </p>
      <p>
        If you requested an appeal and haven’t heard back from us yet, please
        don’t request another appeal. Call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} />.
      </p>
      <br role="presentation" />
      <a
        href="/claim-or-appeal-status/"
        className="vads-c-action-link--green"
        aria-describedby="delay-note"
      >
        Check the status of your appeal
      </a>
      <p id="delay-note">
        <strong>Note</strong>: Please allow some time for your appeal to process
        through our system. It could take 7 to 10 days for it to show up in our
        claim status tool.
      </p>
    </div>
  );
};

ConfirmationPage.propTypes = {
  data: PropTypes.shape({}),
};

export default ConfirmationPage;
