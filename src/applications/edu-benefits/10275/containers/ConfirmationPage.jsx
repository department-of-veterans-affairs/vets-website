import React, { useEffect } from 'react';
import classNames from 'classnames';
import { format, isValid } from 'date-fns';
import { scrollAndFocus } from 'platform/utilities/scroll';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

import { getFullName } from '../helpers';

const onPrintPageClick = () => {
  window.print();
};

export const ConfirmationSubmissionAlert = () => (
  <p className="vads-u-margin--0">
    If we have any further questions for you, we will contact you.
  </p>
);

export const ConfirmationPrintThisPage = ({ data, submitDate }) => (
  <va-summary-box>
    <h3 slot="headline">Your application information</h3>
    <h4 className="vads-u-margin-top--1p5">Who submitted this form</h4>
    <p data-testid="full-name">
      {getFullName(data.authorizedOfficial?.fullName) || '---'}
    </p>
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

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const confirmationNumber =
    submission?.response?.attributes?.confirmationNumber || '';
  const agreementType =
    form.data.agreementType === 'newCommitment'
      ? 'new commitment'
      : 'withdrawal of commitment';

  useEffect(() => {
    const focusedEl = document.querySelector('va-alert');
    scrollAndFocus(focusedEl);
  }, []);

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
    >
      <ConfirmationView.SubmissionAlert
        title={`You've submitted your ${agreementType} to the Principles of Excellence for educational institutions`}
        content={<ConfirmationSubmissionAlert />}
        actions={null}
      />
      <ConfirmationPrintThisPage data={form.data} submitDate={submitDate} />
      <ConfirmationWhatsNextProcessList />
      <ConfirmationGoBackLink />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
