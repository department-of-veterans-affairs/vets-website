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
          <va-link
            disable-analytics
            href={HLR_INFO_URL}
            text="Find out if a Higher-Level Review is an option for you."
          />
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
          <va-link
            disable-analytics
            href={GET_HELP_REP_OR_VSO_URL}
            text="Get help requesting a Higher-Level Review"
          />
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
    <va-omb-info
      res-burden="15"
      omb-number="2900-0862"
      exp-date="03/31/2027"
      modal-click-to-close
    >
      <>
        <h2 className="vads-u-font-size--h3">Respondent Burden:</h2>
        <p>
          An agency may not conduct or sponsor, and a person is not required to
          respond to a collection of information unless it displays a currently
          valid OMB control Number. The OMB control number for this project is
          2900-0862, and it expires 03/31/2027. Public reporting burden for this
          collection of information is estimated to average 15 minutes per
          respondent, per year, including the time for reviewing instructions,
          searching existing data sources, gathering and maintaining the data
          needed, and completing and reviewing the collection of information.
          Send comments regarding this burden estimate and any other aspect of
          this collection of information, including suggestions for reducing the
          burden to VA Reports Clearance Officer at VACOPaperworkReduAct@VA.gov.
          Please refer to OMB Control No. 2900-0862 in any correspondence. Do
          not send your completed VA Form 20-0996 to this email address.
        </p>
        <h2 className="vads-u-font-size--h3">Privacy Act Notice:</h2>
        <p>
          VA will not disclose information collected on this form to any source
          other than what has been authorized under the Privacy Act of 1974 or
          Title 38, Code of Federal Regulations 1.576 for routine uses (i.e.,
          civil or criminal law enforcement, congressional communications,
          epidemiological or research studies, the collection of money owed to
          the United States, litigation in which the United States is a party or
          has an interest, the administration of VA programs and delivery of VA
          benefits, verification of identity and status, and personnel
          administration) as identified in the VA system of records,
          58VA21/22/28, Compensation, Pension, Education, and Veteran Readiness
          and Employment Records - VA, published in the Federal Register. Your
          obligation to respond is voluntary.
        </p>
      </>
    </va-omb-info>
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
      <va-link
        disable-analytics
        external
        href={HEALTH_BENEFITS_URL}
        text="Learn more about Veterans Health Administration (VHA) health care
        services"
      />
    </p>
    <p>
      <strong>If you experienced military sexual trauma (MST)</strong>, we
      provide free treatment for any physical or mental health conditions
      related to your experiences. You don’t need to have reported the MST at
      the time or have other proof that the MST occurred to get care.
    </p>
    <p>
      <va-link
        disable-analytics
        external
        href={MST_INFO}
        text="Learn more about MST-related benefits and services"
      />
    </p>
  </>
);
