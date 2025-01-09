import React from 'react';

import {
  HLR_INFO_URL,
  GET_HELP_REP_OR_VSO_URL,
  HEALTH_BENEFITS_URL,
  MST_INFO,
} from '../constants';

export const IntroText = () => (
  <p className="va-introtext">
    If you disagree with a VA decision on an initial claim or Supplemental
    Claim, you or your representative can request a Higher-Level Review of the
    decision. You can’t submit new evidence with a Higher-Level Review.
  </p>
);

export const ProcessList = () => (
  <>
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
          If you want to provide more information about potential errors in our
          decision, you have one of these 2 options:
        </p>
        <ul>
          <li>
            <strong>Request an informal conference with a VA reviewer.</strong>
            If you choose this option, our decision may take longer,{' '}
            <strong>or</strong>
          </li>
          <li>
            <strong>Submit a written statement.</strong> If you choose this
            option, you must mail us your statement or submit it in person,
            together with your completed VA Form 20-0996. At this time, we can’t
            accept written statements if you complete the online form.
          </li>
        </ul>
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
          accredited representative or Veterans Service Organization (VSO) to
          work with us on your behalf.
        </p>
        <p>
          <a href={GET_HELP_REP_OR_VSO_URL}>
            Get help requesting a Higher-Level Review
          </a>
        </p>
        <va-additional-info trigger="What happens after you submit your request?">
          <div>
            You don’t need to do anything unless we send you a letter asking for
            more information.
          </div>
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  </>
);

export const OmbBlock = () => (
  <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-y--4">
    <va-omb-info res-burden="15" omb-number="2900-0862" exp-date="03/31/2027" />
  </div>
);

export const OtherBenefits = () => (
  <>
    <h2>Other VA health care benefits and services</h2>
    <p>
      <strong>If you qualify for VA health care</strong>, you’ll receive
      coverage for the services you need to help you get—and stay—healthy.
    </p>
    <p>
      <a href={HEALTH_BENEFITS_URL} target="_blank" rel="noreferrer">
        Learn more about Veterans Health Administration (VHA) health care
        services (opens in a new tab)
      </a>
    </p>
    <p>
      <strong>If you experienced military sexual trauma (MST)</strong>, we
      provide free treatment for any physical or mental health conditions
      related to your experiences. You don’t need to have reported the MST at
      the time or have other proof that the MST occurred to get care.
    </p>
    <p>
      <a href={MST_INFO} target="_blank" rel="noreferrer">
        Learn more about MST-related benefits and services (opens in a new tab)
      </a>
    </p>
  </>
);
