/* eslint-disable @department-of-veterans-affairs/prefer-telephone-component */
// va-telephone doesn't display 1-800 numbers correctly
import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

const content = {
  headlineText: 'Thank you for submitting your authorization',
  nextStepsText: (
    <>
      <p>
        If you change your mind and do not want VA to give out your personal
        benefit or claim information, you may notify us in writing, or by
        telephone at{' '}
        <a href="tel:+18008271000" aria-label="1. 8 0 0. 8 2 7. 1 0 0 0.">
          1-800-827-1000
        </a>{' '}
        or contact VA online at{' '}
        <a href="https://ask.va.gov" target="_blank" rel="noopener noreferrer">
          Ask VA
          <va-icon icon="launch" srtext="opens in a new window" />
        </a>
        .
      </p>
      <p>
        Upon notification from you VA will no longer give out benefit or claim
        information (except for the information VA has already given out based
        on your permission).
      </p>
    </>
  ),
};

export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const fullName = form.data?.veteranFullName;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationPageView
      formType="authorization"
      submitterHeader="Submitter"
      submitterName={fullName}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      content={content}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string.isRequired,
        middle: PropTypes.string,
        last: PropTypes.string.isRequired,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: PropTypes.shape({
        attributes: PropTypes.shape({
          confirmationNumber: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      timestamp: PropTypes.string.isRequired,
    }),
  }),
  name: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
