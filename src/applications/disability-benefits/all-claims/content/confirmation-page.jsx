import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { capitalizeEachWord, formatDate } from '../utils';
import {
  successMessage,
  checkLaterMessage,
  errorMessage,
} from '../content/confirmation-poll';

import { NULL_CONDITION_STRING } from '../constants';

const template = (props, title, content, submissionMessage, messageType) => {
  const { fullName, disabilities, submittedAt } = props;
  const { first, last, middle, suffix } = fullName;

  // This is easier than passing down props and checking if the form type
  const pageTitle = document.title.includes('Benefits')
    ? 'Benefits Delivery at Discharge Claim'
    : 'Disability Compensation Claim';

  const renderableContent =
    typeof content === 'string' && content !== '' ? <p>{content}</p> : content;

  const alertBox = (
    <AlertBox
      isVisible
      headline={title}
      content={renderableContent}
      status={messageType}
      level="2"
    />
  );

  const backButtonContent = (
    <div className="row form-progress-buttons schemaform-back-buttons">
      <div className="small-6 usa-width-one-half columns">
        <a href="/">Go back to VA.gov</a>
      </div>
    </div>
  );

  if (messageType === 'error') {
    return (
      <div>
        {alertBox}
        {backButtonContent}
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
        <h2>{pageTitle}</h2>
      </div>

      <AlertBox
        isVisible
        headline={title}
        content={renderableContent}
        status={messageType}
        level="2"
      />

      {props.areConfirmationEmailTogglesOn ? (
        <h2 className="vads-u-font-size--h5" id="note-email">
          We'll send you an email to confirm that we received your claim.{' '}
          <span className="screen-only">
            You can also print this page for your records.
          </span>
        </h2>
      ) : (
        <h2 className="vads-u-font-size--h5 screen-only" id="note-print">
          Please print this page for your records.
        </h2>
      )}

      <div className="inset">
        <h2 className="vads-u-font-size--h4">
          {pageTitle} <span className="additional">(Form 21-526EZ)</span>
        </h2>
        <span>
          For {first} {middle} {last} {suffix}
        </span>
        <ul className="claim-list">
          <li>
            <strong>Date submitted</strong>
            <br />
            <span>{formatDate(submittedAt)}</span>
          </li>
          <li>
            <strong>Conditions claimed</strong>
            <br />
            <ul className="disability-list vads-u-margin-top--0">
              {disabilities.map((disability, i) => (
                <li key={i} className="vads-u-margin-bottom--0">
                  {typeof disability === 'string'
                    ? capitalizeEachWord(disability)
                    : NULL_CONDITION_STRING}
                </li>
              ))}
            </ul>
            {submissionMessage}
          </li>
        </ul>
        <button
          className="usa-button screen-only"
          onClick={() => window.print()}
        >
          Print for your records
        </button>
      </div>

      <div className="confirmation-guidance-container">
        <h2 className="confirmation-guidance-heading vads-u-font-size--h4">
          How long will it take VA to make a decision on my claim?
        </h2>
        <p className="confirmation-guidance-message">
          We process applications in the order we receive them. The amount of
          time it takes us to review you claim depends on:
        </p>
        <ul>
          <li>The type of claim you filed</li>
          <li>
            How many injuries or disabilities you claimed and how complex they
            are
          </li>
          <li>
            How long it takes us to collect the evidence needed to decide your
            claim We may contact you if we have questions or need more
            information
          </li>
        </ul>

        <h2 className="confirmation-guidance-heading vads-u-font-size--h4">
          How can I check the status of my claim?
        </h2>
        <p className="confirmation-guidance-message">
          You can check the status of your claim online. Please allow 24 hours
          for your disability claim to show up there. If you don’t see your
          disability claim online after 24 hours, please call Veterans Benefits
          Assistance at <Telephone contact={CONTACTS.VA_BENEFITS} />, Monday
          through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
        <p>
          <a href="/track-claims">Check the status of your claim</a>
        </p>

        <h2 className="confirmation-guidance-heading vads-u-font-size--h4">
          What happens after I file a claim for disability compensation?
        </h2>
        <p className="confirmation-guidance-message">
          <a href="/disability/after-you-file-claim/">
            Learn more about what happens after you file a disability claim
          </a>
        </p>
      </div>

      {backButtonContent}
    </div>
  );
};

export const retryableErrorContent = props =>
  template(
    props,
    "It's taking us longer than expected to submit your claim.",
    <div>
      <p>
        This delay should be resolved within a few hours. We'll keep trying to
        submit your claim. You can check the status of your claim online after
        24 hours.
      </p>
      <p>
        <a href="/track-claims">Check the status of your claim</a>
      </p>
      <p>
        <strong>
          If you don’t see your disability claim online after 24 hours,
        </strong>{' '}
        please call Veterans Benefits Assistance at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
        8:00 a.m. to 9:00 p.m. ET and provide this reference number{' '}
        {props.jobId}.
      </p>
    </div>,
    checkLaterMessage(props.jobId),
    'warning',
  );

export const successfulSubmitContent = props =>
  template(
    props,
    'Your claim has successfully been submitted.',
    '',
    successMessage(props.claimId),
    'success',
  );

export const submitErrorContent = props => {
  const submissionIdContent = props.submissionId
    ? ` and provide this refernce number ${props.submissionId}`
    : '';

  return template(
    props,
    'We’re sorry. Something went wrong when we tried to submit your claim.',
    <div>
      <h4>For help submitting your claim:</h4>
      <ul>
        <li>
          Please call Veterans Benefits Assistance at{' '}
          <Telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
          8:00 a.m. to 9:00 p.m. ET
          {submissionIdContent}, <strong>or</strong>
        </li>
        <li>
          Get in touch with your nearest Veterans Service Officer (VSO).{' '}
          <a href="/disability/get-help-filing-claim/">
            Find out how to contact your nearest VSO
          </a>
        </li>
      </ul>
    </div>,
    errorMessage(),
    'error',
  );
};
