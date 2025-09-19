import React from 'react';

import classNames from 'classnames';
import { format, isValid } from 'date-fns';
import PropTypes from 'prop-types';

export const ConfirmationSubmissionAlert = () => (
  <p className="vads-u-margin--0">
    If we have any further questions for you, we will contact you.
  </p>
);

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
    <p className="vads-u-margin-bottom--4">
      Your form will be evaluated, and you will receive a notification within 10
      business days.
    </p>
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
