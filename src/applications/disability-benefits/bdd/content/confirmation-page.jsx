import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { capitalizeEachWord } from '../../all-claims/utils';
import {
  successMessage,
  checkLaterMessage,
  errorMessage,
} from '../../all-claims/content/confirmation-poll';

const template = (props, title, content, submissionMessage, messageType) => {
  const { fullName, disabilities, submittedAt } = props;
  const { first, last, middle, suffix } = fullName;

  const renderableContent =
    typeof content === 'string' ? <p>{content}</p> : content;

  const alertBox = (
    <AlertBox
      isVisible
      headline={title}
      content={renderableContent}
      status={messageType}
    />
  );

  const backButtonContent = (
    <div className="row form-progress-buttons schemaform-back-buttons">
      <div className="small-6 usa-width-one-half columns">
        <a href="/">
          <button className="usa-button-primary">Go back to VA.gov</button>
        </a>
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
    <div>
      <h2 className="vads-u-font-size--h5">
        Please print this page for your records.
      </h2>

      <AlertBox
        isVisible
        headline={title}
        content={renderableContent}
        status={messageType}
      />

      <div className="inset">
        <h3 className="vads-u-font-size--h4">
          Benefits Delivery at Discharge{' '}
          <span className="additional">(Form 21-526EZ)</span>
        </h3>
        <span>
          For {first} {middle} {last} {suffix}
        </span>
        <ul className="claim-list">
          <li>
            <strong>Date submitted</strong>
            <br />
            <span>{moment(submittedAt).format('MMM D, YYYY')}</span>
          </li>
          <li>
            <strong>Conditions claimed</strong>
            <br />
            <ul className="disability-list">
              {disabilities.map((disability, i) => (
                <li key={i}>{capitalizeEachWord(disability)}</li>
              ))}
            </ul>
            {submissionMessage}
          </li>
        </ul>
      </div>

      <div className="confirmation-guidance-container">
        <h3 className="confirmation-guidance-heading vads-u-font-size--h4">
          How long will it take VA to make a decision on my claim?
        </h3>
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

        <h3 className="confirmation-guidance-heading vads-u-font-size--h4">
          How can I check the status of my claim?
        </h3>
        <p className="confirmation-guidance-message">
          You can check the status of your claim online. Please allow 24 hours
          for your disability claim to show up there. If you don’t see your
          disability claim online after 24 hours, please call Veterans Benefits
          Assistance at{' '}
          <a href="tel:+18008271000" aria-label="800. 8 2 7. 1000">
            800-827-1000
          </a>
          , Monday through Friday, 8:30 a.m. to 4:30 p.m. ET.
        </p>
        <p>
          <a href="/track-claims">Check the status of your claim</a>
        </p>

        <h3 className="confirmation-guidance-heading vads-u-font-size--h4">
          What happens after I file a claim for disability compensation?
        </h3>
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
        <a href="tel:+18008271000" aria-label="800. 8 2 7. 1000">
          800-827-1000
        </a>
        , Monday through Friday, 8:30 a.m. to 4:30 p.m. ET and provide this
        reference number {props.jobId}.
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

export const submitErrorContent = props =>
  template(
    props,
    'We’re sorry. Something went wrong when we tried to submit your claim.',
    <div>
      <h4>For help submitting your claim:</h4>
      <ul>
        <li>
          Please call Veterans Benefits Assistance at{' '}
          <a href="tel:+18008271000" aria-label="800. 8 2 7. 1000">
            800-827-1000
          </a>
          , Monday through Friday, 8:30 a.m. to 4:30 p.m. ET,{' '}
          <strong>or</strong>
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
