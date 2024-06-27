import React from 'react';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { Toggler } from 'platform/utilities/feature-toggles';
import recordEvent from 'platform/monitoring/record-event';

import {
  HLR_INFO_URL,
  GET_HELP_REP_OR_VSO_URL,
  BASE_URL,
  SUPPLEMENTAL_CLAIM_URL,
  FACILITY_LOCATOR_URL,
  GET_HELP_REVIEW_REQUEST_URL,
} from '../constants';

export const IntroText = () => {
  const restartWizard = () => {
    recordEvent({ event: 'howToWizard-start-over' });
  };
  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
      <Toggler.Enabled>
        <p className="va-introtext">
          If you disagree with a VA decision on an initial claim or Supplemental
          Claim, you or your representative can request a Higher-Level Review of
          the decision. You can’t submit new evidence with a Higher-Level
          Review.
        </p>
      </Toggler.Enabled>
      <Toggler.Disabled>
        <h2 className="vads-u-margin-top--2">What’s a Higher-Level Review?</h2>
        <p>
          If you or your representative disagree with VA’s decision on your
          claim, you can request a Higher-Level Review. With a Higher-Level
          Review, a higher-level reviewer will take a new look at your case and
          the evidence you already provided. The reviewer will decide whether
          the decision can be changed based on a difference of opinion or an
          error.
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
      </Toggler.Disabled>
    </Toggler>
  );
};

export const ProcessList = () => (
  <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
    <Toggler.Enabled>
      <h2 className="vads-u-margin-top--2">Follow the steps to get started</h2>
      <va-process-list class="vads-u-padding-bottom--0">
        <va-process-list-item header="Check if this is the right decision review option for you">
          <p>
            You can request a Higher-Level Review of an initial claim or
            Supplemental Claim decision. You have 1 year from the date on your
            decision letter to request a Higher-Level Review.
          </p>
          <p>You can’t submit new evidence with a Higher-Level Review.</p>
          <p>
            <a href={HLR_INFO_URL}>
              Find out if a Higher-Level Review is an option for you.
            </a>
          </p>
        </va-process-list-item>
        <va-process-list-item header="Gather your information">
          <p>Here’s what you’ll need to request a Higher-Level Review:</p>
          <ul>
            <li>
              The issues you want us to review and the decision date for each.
              You can ask us to review more than 1 issue.
            </li>
            <li>Your contact information</li>
          </ul>
        </va-process-list-item>
        <va-process-list-item header="Start your request">
          <p>
            We’ll take you through each step of the process. It takes about 15
            minutes.
          </p>
          <p>
            If you need help requesting a Higher-Level Review, you can appoint
            an accredited representative or Veterans Service Organization (VSO)
            to work with us on your behalf.
          </p>
          <p>
            <a href={GET_HELP_REP_OR_VSO_URL}>
              Get help requesting a Higher-Level Review
            </a>
          </p>
          <va-additional-info trigger="What happens after you submit your request?">
            <div>
              You don’t need to do anything unless we send you a letter asking
              for more information. If we schedule any exams for you, be sure
              not to miss them.
            </div>
          </va-additional-info>
        </va-process-list-item>
      </va-process-list>
    </Toggler.Enabled>
    <Toggler.Disabled>
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
    </Toggler.Disabled>
  </Toggler>
);

export const processListTitle = 'Follow the steps to get started';
export const processList = (
  <va-process-list class="vads-u-padding-bottom--0">
    <va-process-list-item header="Check if this is the right decision review option for you">
      <p>
        You can request a Higher-Level Review of an initial claim or
        Supplemental Claim decision. You have 1 year from the date on your
        decision letter to request a Higher-Level Review.
      </p>
      <p>You can’t submit new evidence with a Higher-Level Review.</p>
      <p>
        <strong>Note:</strong> To avoid potential delays, you may include a
        written statement instead of requesting an informal conference. You can
        only include a written statement when submitting your request by mail at
        this time.
      </p>
      <p>
        <a href={HLR_INFO_URL}>
          Find out if a Higher-Level Review is an option for you.
        </a>
      </p>
    </va-process-list-item>
    <va-process-list-item header="Gather your information">
      <p>Here’s what you’ll need to request a Higher-Level Review:</p>
      <ul>
        <li>
          The issues you want us to review and the decision date for each. You
          can ask us to review more than 1 issue.
        </li>
        <li>Your contact information</li>
      </ul>
    </va-process-list-item>
    <va-process-list-item header="Start your request">
      <p>
        We’ll take you through each step of the process. It takes about 15
        minutes.
      </p>
      <p>
        If you need help requesting a Higher-Level Review, you can appoint an
        accredited representative or Veterans Service Organization (VSO) to work
        with us on your behalf.
      </p>
      <p>
        <a href={GET_HELP_REP_OR_VSO_URL}>
          Get help requesting a Higher-Level Review
        </a>
      </p>
      <va-additional-info trigger="What happens after you submit your request?">
        <div>
          You don’t need to do anything unless we send you a letter asking for
          more information. If we schedule any exams for you, be sure not to
          miss them.
        </div>
      </va-additional-info>
    </va-process-list-item>
  </va-process-list>
);

export const OmbBlock = () => (
  <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-y--4">
    <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
      <Toggler.Enabled>
        <va-omb-info
          res-burden="15"
          omb-number="2900-0862"
          exp-date="03/31/2027"
        />
      </Toggler.Enabled>
      <Toggler.Disabled>
        <va-omb-info
          res-burden="15"
          omb-number="2900-0862"
          exp-date="04/30/2024"
        />
      </Toggler.Disabled>
    </Toggler>
  </div>
);
