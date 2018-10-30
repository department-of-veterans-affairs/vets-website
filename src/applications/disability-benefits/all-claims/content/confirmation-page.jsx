import React from 'react';
import moment from 'moment';

import siteName from '../../../../platform/brand-consolidation/site-name';
import {
  successMessage,
  checkLaterMessage,
  errorMessage,
} from '../content/confirmation-poll';

const template = (props, title, content, submissionMessage) => {
  const { fullName, disabilities, submittedAt } = props;
  const { first, last, middle, suffix } = fullName;

  const renderableContent =
    typeof content === 'string' ? <p>{content}</p> : content;

  return (
    <div>
      <h3 className="confirmation-page-title">{title}</h3>
      {renderableContent}

      <div className="inset">
        <h4>
          Disability Compensation Claim{' '}
          <span className="additional">(Form 21-526EZ)</span>
        </h4>
        <span>
          For {first} {middle} {last} {suffix}
        </span>
        <ul className="claim-list">
          <strong>Conditions claimed</strong>
          <br />
          <ul className="disability-list">
            {disabilities
              .filter(item => item['view:selected'])
              .map((disability, i) => (
                <li key={i}>{disability.name}</li>
              ))}
          </ul>
          {submissionMessage}
          <li>
            <strong>Date submitted</strong>
            <br />
            <span>{moment(submittedAt).format('MMM D, YYYY')}</span>
          </li>
        </ul>
      </div>

      <h4 className="confirmation-guidance-heading">
        What happens after I apply?
      </h4>
      <p className="confirmation-guidance-message">
        You don’t need to do anything unless we send you a letter asking for
        more information.
      </p>
      <br />
      <a href="/disability-benefits/after-you-apply/">
        Learn more about what happens after you file a disability claim.
      </a>
      <div className="confirmation-guidance-container">
        <h4 className="confirmation-guidance-heading">Need help?</h4>
        <p className="confirmation-guidance-message">
          If you have questions, please call{' '}
          <a href="tel:+18772228387">1-877-222-8387</a>, Monday &#8211; Friday,
          8:00 a.m. &#8211; 8:00 p.m. (ET).
        </p>
      </div>
      <div className="row form-progress-buttons schemaform-back-buttons">
        <div className="small-6 usa-width-one-half medium-6 columns">
          <a href="/">
            <button className="usa-button-primary">
              Go Back to {siteName}
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export const retryableErrorContent = props =>
  template(
    props,
    'Your claim has been submitted.',
    'We process applications in the order we receive them. We may contact you if we have questions or need more information. You can print this page for your records.',
    checkLaterMessage(props.jobId),
  );

export const successfulSubmitContent = props =>
  template(
    props,
    'Your claim has successfully been submitted.',
    'We process applications in the order we receive them. We may contact you if we have questions or need more information. You can print this page for your records.',
    successMessage(props.claimId),
  );

export const submitErrorContent = props =>
  template(
    props,
    'We’re sorry. Something went wrong when we tried to submit your claim.',
    <div>
      <p>
        For help submitting your claim, please call Veterans Benefits Assistance
        at 1-800-827-1000, Monday – Friday, 8:30 a.m. – 4:30 p.m. (ET). Or, you
        can get in touch with your nearest Veterans Service Officer (VSO).
      </p>{' '}
      <a href="/disability-benefits/apply/help/">Contact your nearest VSO.</a>
    </div>,
    errorMessage(),
  );
