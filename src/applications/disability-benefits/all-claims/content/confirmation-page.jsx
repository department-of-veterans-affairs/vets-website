import React from 'react';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import DownloadPDF from '../components/DownloadPDF';
import { capitalizeEachWord, formatDate } from '../utils';
import {
  successMessage,
  checkLaterMessage,
  errorMessage,
} from './confirmation-poll';

import { NULL_CONDITION_STRING } from '../constants';
import { BddConfirmationAlert } from './bddConfirmationAlert';

const template = (props, title, content, submissionMessage, messageType) => {
  const { fullName, disabilities, submittedAt, isSubmittingBDD } = props;
  const { first, last, middle, suffix } = fullName;
  // This is easier than passing down props and checking if the form type
  const pageTitle = document.title.includes('Benefits')
    ? 'Benefits Delivery at Discharge Claim'
    : 'Disability Compensation Claim';

  const backButtonContent = (
    <div className="row form-progress-buttons schemaform-back-buttons">
      <div className="small-6 usa-width-one-half columns">
        <a href="/">Go back to VA.gov</a>
      </div>
    </div>
  );

  if (messageType === 'error') {
    return (
      <>
        <va-alert visible status={messageType} uswds>
          <h2 slot="headline">{title}</h2>
          {content}
        </va-alert>
        {isSubmittingBDD && <BddConfirmationAlert />}
        {backButtonContent}
      </>
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

      <va-alert visible status={messageType} uswds>
        <h2 slot="headline">{title}</h2>
        {content}
      </va-alert>
      {isSubmittingBDD && <BddConfirmationAlert />}

      <h2 className="vads-u-font-size--h5" id="note-email">
        We’ll send you an email to confirm that we received your claim.{' '}
        <span className="screen-only">
          You can also print this page for your records.
        </span>
      </h2>

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
          type="button"
          className="usa-button screen-only"
          onClick={window.print}
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
            How many injuries or conditions you claimed and how complex they are
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
          Assistance at <va-telephone contact={CONTACTS.VA_BENEFITS} />, Monday
          through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
        <p>
          <a href="/track-claims">Check the status of your claim</a>
        </p>

        {!isSubmittingBDD && (
          <>
            <h2 className="confirmation-guidance-heading vads-u-font-size--h4">
              What should I do next?
            </h2>
            <p className="confirmation-guidance-message">
              <strong>If you have a spouse or child</strong>, you may be
              entitled to additional payments.
            </p>
            <a
              className="vads-c-action-link--blue"
              href="https://www.va.gov/view-change-dependents/"
            >
              Apply online to add a dependent
            </a>
            <p>
              Or you can fill out and submit an Application Request to Add
              and/or Remove Dependents (VA Form 21-686c)
            </p>
            <p>
              <DownloadPDF
                formNumber="21-686c"
                fileName="VBA-21-686c-ARE"
                size="2.7"
              />
            </p>
            <p>
              <strong>Note:</strong> If you’re claiming your child who became
              permanently disabled before they turned 18, you’ll need to submit
              all military and private medical records relating to the child’s
              disabilities with your application.
            </p>
            <p>
              <strong>
                If you’re claiming a child who’s between 18 and 23 years old and
                attending school full time
              </strong>
              , you’ll need to fill out and submit a Request for Approval of
              School Attendance (VA Form 21-674) so we can verify their
              attendance.
            </p>
            <p>
              <DownloadPDF
                formNumber="21-674"
                fileName="VBA-21-674-ARE"
                size="1.3"
              />
            </p>
            <p>
              <strong>If you have dependent parents</strong>, you may be
              entitled to additional payments. Fill out and submit a Statement
              of Dependency of Parent(s) (VA Form 21P-509).
            </p>
            <p>
              <DownloadPDF
                formNumber="21P-509"
                fileName="VBA-21P-509-ARE"
                size="1"
              />
            </p>
          </>
        )}

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
      <p className="vads-u-font-size--base">
        This delay should be resolved within a few hours. We’ll keep trying to
        submit your claim. You can check the status of your claim online after
        24 hours.
      </p>
      <p className="vads-u-font-size--base">
        <a href="/track-claims">Check the status of your claim</a>
      </p>
      <p className="vads-u-font-size--base">
        <strong>
          If you don’t see your disability claim online after 24 hours,
        </strong>{' '}
        please call Veterans Benefits Assistance at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
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
    <></>,
    successMessage(props.claimId),
    'success',
  );

export const submitErrorContent = props => {
  const submissionIdContent = props.submissionId
    ? ` and provide this reference number ${props.submissionId}`
    : '';

  return template(
    props,
    'We’re sorry. Something went wrong when we tried to submit your claim.',
    <div>
      <h4>For help submitting your claim:</h4>
      <ul className="vads-u-font-size--base">
        <li>
          Please call Veterans Benefits Assistance at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} />, Monday through
          Friday, 8:00 a.m. to 9:00 p.m. ET
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
