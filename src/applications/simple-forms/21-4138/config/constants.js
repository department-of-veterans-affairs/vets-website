import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { VA_FORM_IDS } from 'platform/forms/constants';

export const PrimaryActionLink = ({ href = '/', children, onClick = null }) => (
  <div className="action-bar-arrow">
    <div className="vads-u-background-color--primary vads-u-padding--1">
      <a className="vads-c-action-link--white" href={href} onClick={onClick}>
        {children}
      </a>
    </div>
  </div>
);

PrimaryActionLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

const PrimaryActionLinkWithOnClick = ({ href = '/' }) => {
  const { livingSituation, otherReasons, otherHousingRisks } = useSelector(
    state => state.form.data,
  );

  const handlePriorityProcessingOnClick = e => {
    e.preventDefault();
    sessionStorage.setItem(
      `dataTransfer-${VA_FORM_IDS.FORM_20_10207}`,
      JSON.stringify({
        data: { livingSituation, otherReasons, otherHousingRisks },
        expiry: Date.now() + 300000, // 5 minutes
      }),
    );
    window.location.href = href;
  };

  return (
    <PrimaryActionLink href={href} onClick={handlePriorityProcessingOnClick}>
      Start your request
    </PrimaryActionLink>
  );
};

PrimaryActionLinkWithOnClick.propTypes = {
  href: PropTypes.string,
};

export const TITLE = 'Submit a statement to support a claim';
export const SUBTITLE = 'Statement in Support of Claim (VA Form 21-4138)';

export const workInProgressContent = {
  description:
    'We’re rolling out Submit a Statement to Support a Claim (VA Form 21-4138) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
};

export const STATEMENT_TYPES = Object.freeze({
  NEW_EVIDENCE: 'new-evidence',
  DECISION_REVIEW: 'decision-review',
  BUDDY_STATEMENT: 'buddy-statement',
  PRIORITY_PROCESSING: 'priority-processing',
  PERSONAL_RECORDS: 'personal-records',
  NOT_LISTED: 'not-listed',
});

export const STATEMENT_TYPE_LABELS = Object.freeze({
  [STATEMENT_TYPES.NEW_EVIDENCE]:
    'I have new evidence to submit for an open claim.',
  [STATEMENT_TYPES.DECISION_REVIEW]:
    "I disagree with VA's decision on my benefit or claim, and I'd like to request a decision review.",
  [STATEMENT_TYPES.BUDDY_STATEMENT]:
    'I want to submit a lay or witness statement to support a claim.',
  [STATEMENT_TYPES.PRIORITY_PROCESSING]:
    'I want to request faster claim processing because of my situation.',
  [STATEMENT_TYPES.PERSONAL_RECORDS]: 'I want to request my personal records.',
  [STATEMENT_TYPES.NOT_LISTED]: "What I want to do isn't listed here.",
});

export const STATEMENT_TYPE_DESCRIPTIONS = Object.freeze({
  [STATEMENT_TYPES.NEW_EVIDENCE]: '',
  [STATEMENT_TYPES.DECISION_REVIEW]:
    'In some situations, you can submit new evidence for closed claims.',
  [STATEMENT_TYPES.BUDDY_STATEMENT]:
    'You can do this for your claim, or as a "buddy statement" for another person\'s claim.',
  [STATEMENT_TYPES.PRIORITY_PROCESSING]:
    'Certain situations, like a recent job loss or homelessness, may qualify you for priority processing.',
  [STATEMENT_TYPES.PERSONAL_RECORDS]:
    'You can request your DD214, benefit records, and more.',
  [STATEMENT_TYPES.NOT_LISTED]: '',
});

export const STATEMENT_TYPE_PAGE = Object.freeze({
  title: 'What would you like to do?',
  description:
    "We’ve improved how we process certain types of statements and requests. Before you continue with VA Form 21-4138, tell us what you’re trying to do and we'll check if there's a quicker way to help you.",
});

export const DECISION_REVIEW_TYPES = Object.freeze({
  NEW_EVIDENCE: 'new-evidence',
  ERROR_MADE: 'error-made',
  BVA_REQUEST: 'bva-request',
});

export const DECISION_REVIEW_TYPE_LABELS = Object.freeze({
  [DECISION_REVIEW_TYPES.NEW_EVIDENCE]: 'I have new and relevant evidence.',
  [DECISION_REVIEW_TYPES.ERROR_MADE]:
    'I think there was an error with a decision on my case.',
  [DECISION_REVIEW_TYPES.BVA_REQUEST]:
    "I want the Board of Veteran's Appeals to review my case.",
});

export const DECISION_REVIEW_TYPE_DESCRIPTIONS = Object.freeze({
  [DECISION_REVIEW_TYPES.ERROR_MADE]:
    "Don't select this option if you have new evidence to submit.",
  [DECISION_REVIEW_TYPES.BVA_REQUEST]:
    'You can also submit new evidence with certain types of Board Appeals.',
});

export const LIVING_SITUATIONS = Object.freeze({
  OVERNIGHT:
    'I live or sleep overnight in a place that isn’t meant for regular sleeping. This includes a car, park, abandoned building, bus station, train station, airport, or camping ground.',
  SHELTER:
    'I live in a shelter (including a hotel or motel) that’s meant for temporary stays.',
  FRIEND_OR_FAMILY:
    'I’m staying with a friend or family member, because I can’t get my own home right now.',
  LEAVING_SHELTER:
    'In the next 30 days, I will have to leave a facility, like a homeless shelter.',
  LOSING_HOME:
    'In the next 30 days, I will lose my home. (Note: This could include a house, apartment, trailer, or other living space that you own, rent, or live in without paying rent. Or it could include a living space that you share with others. It could also include rooms in hotels or motels.)',
  OTHER_RISK: 'I have another housing risk not listed here.',
  NONE: 'None of these situations apply to me.',
});

export const OTHER_REASONS = Object.freeze({
  FINANCIAL_HARDSHIP:
    'I’m experiencing extreme financial hardship (such as loss of your job or sudden decrease in income).',
  ALS:
    'I have ALS (amyotrophic lateral sclerosis), also known as Lou Gehrig’s disease.',
  TERMINAL_ILLNESS: 'I have a terminal illness.',
  VSI_SI:
    'I have a status from the Defense Department of Very Seriously Injured or Ill (VSI) or Seriously Injured or Ill (SI).',
  OVER_85: 'I’m age 85 or older.',
  FORMER_POW: 'I’m a former prisoner of war (POW).',
  MEDAL_AWARD: 'I’m a Medal of Honor or Purple Heart award recipient.',
  NONE: 'None of these situations apply to me.',
});

export const ESCAPE_HATCH = Object.freeze(
  <div className="vads-u-margin-y--4">
    If you’d like to use VA Form 21-4138 for your statement instead, you can{' '}
    <a href="/supporting-forms-for-claims/submit-statement-form-21-4138/personal-information">
      go to VA Form 21-4138 now.
    </a>
  </div>,
);

export const LAY_OR_WITNESS_HANDOFF = Object.freeze(
  <div>
    <p>
      Based on your answer, you should submit a lay or witness statement to
      support a VA claim (VA Form 21-10210).
    </p>
    <PrimaryActionLink href="/supporting-forms-for-claims/lay-witness-statement-form-21-10210/introduction">
      Start your statement
    </PrimaryActionLink>
    <h2 className="vads-u-font-size--h3">About lay or witness statements</h2>
    <ul>
      <li>
        You can submit a statement to support your own VA claim or someone
        else’s VA claim. When it’s for someone else, people sometimes call this
        a “buddy statement.”
      </li>
      <li>
        To submit a statement to support someone else’s claim, you’ll need to
        give us information like their date of birth, Social Security number, VA
        file number (if available), and contact information.
      </li>
    </ul>
    {ESCAPE_HATCH}
  </div>,
);

export const DECISION_REVIEW_HANDOFF = Object.freeze(
  <div>
    <p>
      Based on your answer, you should explore your options for a decision
      review.
    </p>
    <PrimaryActionLink href="/resources/choosing-a-decision-review-option/">
      Choose a decision review option
    </PrimaryActionLink>
    <p>
      If you disagree with a VA benefit or claim decision, you can choose from 3
      decision review options (Supplemental Claim, Higher-Level Review, or Board
      Appeal) to continue your case.
    </p>
    <p>
      If you aren’t satisfied with the results of the first option you choose,
      you can try another eligible option.
    </p>
    {ESCAPE_HATCH}
  </div>,
);

export const NOD_OLD_HANDOFF = Object.freeze(
  <div>
    <p>
      Since it’s been more than 1 year since we made a decision, you should file
      a <strong>Supplemental Claim.</strong>
    </p>
    <p>
      We can help you gather any new evidence you identify (such as medical
      records) to support your claim.
    </p>
    <p>A reviewer will decide if this new evidence changes the decision.</p>
    <PrimaryActionLink href="/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995/start">
      File a Supplemental Claim online
    </PrimaryActionLink>
    <div className="vads-u-margin-y--4">
      <a
        href="/decision-reviews/supplemental-claim/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about supplemental claims (opens in new tab)
      </a>
    </div>
    {ESCAPE_HATCH}
  </div>,
);

export const NOD_SUPPLEMENTAL_HANDOFF = Object.freeze(
  <div>
    <p>
      Based on your answer, you may want to file a{' '}
      <strong>Supplemental Claim.</strong>
    </p>
    <p>
      We can help you gather any new evidence you identify (such as medical
      records) to support your claim.
    </p>
    <p>A reviewer will decide if this new evidence changes the decision.</p>
    <PrimaryActionLink href="/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995/start">
      File a Supplemental Claim online
    </PrimaryActionLink>
    <div className="vads-u-margin-y--4">
      <a
        href="/decision-reviews/supplemental-claim/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about supplemental claims (opens in new tab)
      </a>
    </div>
    {ESCAPE_HATCH}
  </div>,
);

export const NOD_HLR_HANDOFF = Object.freeze(
  <div>
    <p>
      Based on your answer, you may want to request a{' '}
      <strong>Higher-Level Review.</strong> A higher-level reviewer can review
      the case again and determine whether an error or a difference of opinion
      changes the decision.
    </p>
    <p>
      This is not the right option for you if you would like to submit new
      evidence.
    </p>
    <p>
      For disability compensation claims, you can request a Higher-Level Review
      online.
    </p>
    <PrimaryActionLink href="/decision-reviews/higher-level-review/request-higher-level-review-form-20-0996/">
      Request a High-Level Review online
    </PrimaryActionLink>
    <p>
      <strong>Note:</strong> At this time, you can use our online Higher-Level
      Review form for only disability compensation claims. For other types of
      claims, you’ll need to request a Higher-Level Review either by mail or in
      person.
    </p>
    <div className="vads-u-margin-y--4">
      <va-link
        download
        href="/decision-reviews/higher-level-review/request-higher-level-review-form-20-0996"
        text="Get VA Form 20-0996 to download"
      />
    </div>
    <div className="vads-u-margin-y--4">
      <a
        href="/decision-reviews/higher-level-review/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about Higher-Level Reviews and how to request one (opens in
        new tab)
      </a>
    </div>
    {ESCAPE_HATCH}
  </div>,
);

export const NOD_BA_HANDOFF = Object.freeze(
  <div>
    <p>
      Based on your answer, you may want to request a{' '}
      <strong>Board Appeal.</strong> That means a Veterans Law Judge at the
      Board of Veterans’ Appeals will review your case.
    </p>
    <p>
      When you fill out the form, you’ll need to request the type of review you
      want from the Board:
    </p>
    <ul style={{ margin: '6px' }}>
      <li>
        <strong>Direct review</strong>, if you don’t want to submit evidence or
        have a hearing
      </li>
      <li>
        <strong>Evidence submission</strong>, if you want to submit additional
        evidence without a hearing
      </li>
      <li>
        <strong>Hearing</strong>, if you want to have a hearing with a Veterans
        Law Judge (with or without new evidence)
      </li>
    </ul>
    <PrimaryActionLink href="/decision-reviews/board-appeal/request-board-appeal-form-10182/introduction">
      Request a Board Appeal online
    </PrimaryActionLink>
    <div className="vads-u-margin-y--4">
      <a
        href="/decision-reviews/board-appeal/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about Board Appeals and how to request one (opens in new tab)
      </a>
    </div>
    {ESCAPE_HATCH}
  </div>,
);

export const ADDITIONAL_INFO_OTHER_HOUSING_RISKS = Object.freeze(
  <va-additional-info
    trigger="What to know before sharing details about other housing risks"
    data-testid="otherHousingRisksAdditionalInfo"
  >
    <div>
      <p>
        We understand that you may have other housing risks not listed here. If
        you feel comfortable sharing more about your situation, you can do that
        here. Or you can simply check this option and not include any details.
        We’ll use this information only to prioritize your request.
      </p>
      <p>
        <b>Note:</b> If you need help because of domestic violence, call the
        National Domestic Violence hotline <va-telephone contact="8007997233" />{' '}
        (TTY: <va-telephone contact="8007873224" />) or text "START" to 88788.
        Staff are there to help 24 hours a day, 7 days a week. All conversations
        are private and confidential.
      </p>
    </div>
  </va-additional-info>,
);

export const PRIORITY_PROCESSING_HANDOFF = Object.freeze(
  <div>
    <p>
      Based on your answer, you should request priority processing for an
      existing claim (VA Form 20-10207).
    </p>
    <PrimaryActionLink href="/supporting-forms-for-claims/request-priority-processing-form-20-10207/introduction">
      Start your priority processing request
    </PrimaryActionLink>
    <h2 className="vads-u-font-size--h3">
      What to know before you request priority processing
    </h2>
    <p>
      To qualify for priority processing, one of these descriptions must be
      true:
    </p>
    <ul>
      <li>
        You’re homeless or at risk of becoming homeless,{' '}
        <span className="vads-u-font-weight--bold">or</span>
      </li>
      <li>
        You’re experiencing extreme financial hardship (such as loss of your job
        or a sudden decrease in income),{' '}
        <span className="vads-u-font-weight--bold">or</span>
      </li>
      <li>
        You have ALS (amyotrophic lateral sclerosis), also known as Lou Gehrig’s
        disease, <span className="vads-u-font-weight--bold">or</span>
      </li>
      <li>
        You have a terminal illness (a condition that can’t be treated),{' '}
        <span className="vads-u-font-weight--bold">or</span>
      </li>
      <li>
        You have a Very Seriously Injured or Ill (VSI) or Seriously Injured or
        Ill (SI) status from the Defense Department (DOD) (this status means you
        have a disability from a military operation that will likely result in
        your discharge from the military),{' '}
        <span className="vads-u-font-weight--bold">or</span>
      </li>
      <li>
        You’re age 85 or older,{' '}
        <span className="vads-u-font-weight--bold">or</span>
      </li>
      <li>
        You’re a former prisoner of war,{' '}
        <span className="vads-u-font-weight--bold">or</span>
      </li>
      <li>You received the Medal of Honor or the Purple Heart award</li>
    </ul>
    <p>
      We may need supporting documents based on the situation, but you can still
      submit your initial request without evidence.
    </p>
    {ESCAPE_HATCH}
  </div>,
);

export const PRIORITY_PROCESSING_NOT_QUALIFIED = Object.freeze(
  <div>
    <va-alert>
      Based on your responses, you may not qualify for priority processing.
    </va-alert>
    <p>
      It’s possible we don’t have enough information about your situation yet.
      You may use this form (VA Form 21-4138) to submit a detailed explanation
      about your circumstances.
    </p>
  </div>,
);

export const PRIORITY_PROCESSING_QUALIFIED = Object.freeze(
  <div>
    <va-alert status="success" uswds>
      Based on your responses, you may qualify for priority processing. The next
      step is for you to complete a priority processing request.
    </va-alert>
    <h2 className="vads-u-font-size--h3">How to request priority processing</h2>
    <p>
      We may need supporting documents based on the situation. If you don’t have
      supporting documents, you can still submit your request. But we’ll process
      your request faster if you submit all of the documents that you have
      available. You can start your request now, or you can keep reading to
      learn what types of evidence to submit.
    </p>
    <div className="vads-u-margin-y--3">
      <va-alert>
        Note: Since you’re signed into your account, you can save your
        application in progress and come back later to finish filling it out.
      </va-alert>
    </div>
    <PrimaryActionLinkWithOnClick href="/supporting-forms-for-claims/request-priority-processing-form-20-10207/introduction">
      Start your request
    </PrimaryActionLinkWithOnClick>
    <h2 className="vads-u-font-size--h3">Types of evidence to submit</h2>
    <p>You can submit any of these types of evidence.</p>
    <p>
      <strong>Note:</strong> Please don’t send original documents. Send copies
      instead.
    </p>
    <h3 className="vads-u-font-size--h4">For extreme financial hardship</h3>
    <ul>
      <li>Eviction or foreclosure notice</li>
      <li>Notices of past-due utility bills</li>
      <li>Collection notices from creditors</li>
    </ul>
    <h3 className="vads-u-font-size--h4">
      For ALS or other terminal illnesses
    </h3>
    <ul>
      <li>Medical evidence and diagnosis</li>
    </ul>
    <p>
      <strong>Note:</strong> If you want us to get your private treatment
      records, you’ll need to submit an authorization to release non-VA medical
      information to us (VA Forms 21-4142 and 21-4142a).
    </p>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="/supporting-forms-for-claims/release-information-to-va-form-21-4142/introduction"
    >
      Submit an authorization online to release non-VA medical information to us
      (opens in new tab)
    </a>
    <h3 className="vads-u-font-size--h4">
      For Very Seriously Injured or Ill (VSI) or Seriously Injured or Ill (SI)
    </h3>
    <ul>
      <li>Military personnel records, such as a determination from the DOD</li>
      <li>Medical evidence showing severe disability or injury</li>
    </ul>
    <h3 className="vads-u-font-size--h4">For former prisoners or war</h3>
    <ul>
      <li>Military personnel records, such as DD214</li>
      <li>Service number and branch and dates of service</li>
      <li>Dates and location of internment</li>
      <li>Detaining power or other relevant information</li>
    </ul>
    <h3 className="vads-u-font-size--h4">
      For Medal of Honor or Purple Heart award recipients
    </h3>
    <ul>
      <li>Military personnel records, such as DD214</li>
      <li>
        Information showing receipt of Medal of Honor or Purple Heart award
      </li>
    </ul>
    <h2 className="vads-u-font-size--h3">How to submit supporting evidence</h2>
    <ul>
      <li>
        You can upload your documents online as you complete this form. This
        will help us process your request faster.
      </li>
      <li>You can also send copies of your documents by mail.</li>
    </ul>
    <va-additional-info
      trigger="Where can I send documents by mail?"
      data-testid="ppQualifiedMailingAdditionalInfo"
    >
      <div>
        <p>
          Find the benefit type you’re requesting priority processing for. Then
          use the corresponding mailing address.
        </p>
        <p>
          <strong>Compensation claims</strong>
          <br />
          Department of Veterans Affairs Compensation Intake Center
          <br />
          PO Box 4444
          <br />
          Janesville, WI 53547-4444
        </p>
        <p>
          <strong>Pension and survivors benefit claims</strong>
          <br />
          Department of Veterans Affairs Pension Intake Center
          <br />
          PO Box 5365
          <br />
          Janesville, WI 53547-5365
        </p>
        <p>
          <strong>Board of Veterans' Appeals</strong>
          <br />
          Department of Veterans Affairs Board of Veterans' Appeals
          <br />
          PO Box 27063
          <br />
          Washington, DC 20038
        </p>
        <p>
          <strong>Fiduciary</strong>
          <br />
          Department of Veterans Affairs Fiduciary Intake Center
          <br />
          PO Box 5211
          <br />
          Janesville, WI 53547-5211
        </p>
      </div>
    </va-additional-info>
    <va-omb-info
      res-burden={5}
      omb-number="2900-0736"
      exp-date="02/28/2026"
      class="vads-u-margin-y--4"
    />
  </div>,
);

export const RECORDS_REQUEST_HANDOFF = Object.freeze(
  <div>
    <p>
      Based on your answer, you should make a Freedom of Information Act (FOIA)
      or Privacy Act (PA) Request (VA Form 20-10206).
    </p>
    <PrimaryActionLink href="/records/request-personal-records-form-20-10206/introduction">
      Start your request
    </PrimaryActionLink>
    <p>
      You can ask for your{' '}
      <span className="vads-u-font-weight--bold">military</span>,{' '}
      <span className="vads-u-font-weight--bold">compensation</span>,{' '}
      <span className="vads-u-font-weight--bold">pension</span>, or{' '}
      <span className="vads-u-font-weight--bold">benefit</span> records.
    </p>
    {ESCAPE_HATCH}
  </div>,
);

export const NEW_EVIDENCE_HANDOFF = Object.freeze(
  <div>
    <p>
      If you have an open claim, you can add evidence to support it. Evidence
      may include documents like court papers or service treatment records.
    </p>
    <PrimaryActionLink href="/track-claims/your-claims">
      Upload evidence using our claim status tool
    </PrimaryActionLink>
    <p>
      If you prefer to mail copies of your documents, we recommend filling out
      Document Evidence Submission (VA Form 20-10208) and submitting it along
      with the evidence.
    </p>
    <div className="vads-u-margin-y--4">
      <va-link
        download
        filetype="PDF"
        href="https://www.vba.va.gov/pubs/forms/VBA-20-10208-ARE.pdf"
        text="Get VA Form 20-10208 to download"
      />
    </div>
    {ESCAPE_HATCH}
  </div>,
);
