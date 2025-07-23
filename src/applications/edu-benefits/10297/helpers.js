import React from 'react';

import classNames from 'classnames';
import { format, isValid } from 'date-fns';
import PropTypes from 'prop-types';

const getFullName = fullName => {
  if (!fullName) return null;

  const first = (fullName?.first || '').trim();
  const middle = (fullName?.middle || '').trim();
  const last = (fullName?.last || '').trim();

  return [first, middle, last].filter(Boolean).join(' ');
};

const onPrintPageClick = () => {
  window.print();
};

export const ConfirmationSubmissionAlert = () => (
  <p className="vads-u-margin-bottom--0">
    We’ve received your application. We’ll review it and email you a decision
    soon.
  </p>
);

export const ConfirmationPrintThisPage = ({ data, submitDate }) => (
  <va-summary-box>
    <h3 slot="headline">Your application information</h3>
    <h4 className="vads-u-margin-top--1p5">Who submitted this form</h4>
    <p data-testid="full-name">{getFullName(data.fullName) || '---'}</p>
    <h4 className="vads-u-margin-top--1">Date submitted</h4>
    <p data-testid="data-submitted">
      {isValid(submitDate) ? format(submitDate, 'MMM d, yyyy') : '---'}
    </p>
    <h4 className="vads-u-margin-top--1">Confirmation for your recrods</h4>
    <p className="vads-u-padding-bottom--3">
      You can print this confirmation page for your records.
    </p>
    <va-button onClick={onPrintPageClick} text="Print this page" />
  </va-summary-box>
);

ConfirmationPrintThisPage.propTypes = {
  data: PropTypes.object,
  submitDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export const ConfirmationWhatsNextProcessList = () => (
  <>
    <h2>What to expect next</h2>
    <va-process-list>
      <va-process-list-item header="We'll review your application and determine your eligibility">
        <p>
          If you’re eligible and the yearly cap of 4,000 students hasn’t been
          met, we’ll send you a Certificate of Eligibility. If not, we’ll send
          you a letter explaining why you’re not eligible.
        </p>
      </va-process-list-item>
      <va-process-list-item header="We'll check the training provider(s) you listed">
        <p>
          If you reported a school you want to attend, we’ll review whether that
          school has programs currently approved for the High Technology
          Program. If it doesn’t, we’ll reach out to the school to explore if
          approval can be set up.
        </p>
      </va-process-list-item>
      <va-process-list-item header="We'll keep you updated">
        <p>
          You’ll get an email with our decision. If you’re signed up for VA
          Notify, we’ll also send updates there.
        </p>
      </va-process-list-item>
    </va-process-list>
  </>
);

export const ConfirmationGoBackLink = () => (
  <div
    className={classNames(
      'confirmation-go-back-link-section',
      'screen-only',
      'vads-u-margin-top--2',
    )}
  >
    <va-link-action href="/" text="Go back to VA.gov" type="primary" />
  </div>
);

export const getCardDescription = item => {
  return item ? (
    <>
      <div className=" vads-u-margin-y--2" data-testid="card-street">
        <p>{item?.address?.street}</p>
        <p data-testid="card-address">
          {item?.address?.city}, {item?.address?.state}{' '}
          {item?.address?.postalCode}
        </p>
      </div>
    </>
  ) : null;
};

export const trainingProviderArrayOptions = {
  arrayPath: 'trainingProvider',
  nounSingular: 'training provider',
  nounPlural: 'training providers',
  required: false,
  isItemIncomplete: item => {
    return (
      !item?.name ||
      !item?.address?.street ||
      !item?.address?.city ||
      !item?.address?.country ||
      !item?.address?.postalCode
    );
  },
  maxItems: 4,
  text: {
    getItemName: item => (item?.name ? `${item?.name}`.trim() : 'null'),
    cardDescription: item => getCardDescription(item),
    cancelAddYes: 'Yes, cancel',
    cancelAddNo: 'No, continue adding information',
    summaryTitle: 'Review your training provider information',
    cancelAddButtonText: "Cancel adding this training provider's information",
  },
};
