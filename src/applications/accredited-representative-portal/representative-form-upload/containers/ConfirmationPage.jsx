import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationPageView } from '../components/ConfirmationPageView';
import { getFormContent } from '../helpers';

const content = {
  headlineText: 'You’ve submitted your form',
  nextStepsText: (
    <p>We’ll review your form and contact you if we need more information.</p>
  ),
};

const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmation_number;

  const { formNumber } = getFormContent();

  return (
    <ConfirmationPageView
      formType="submission"
      submitterHeader="Who submitted this form"
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      content={content}
      formNumber={formNumber}
      childContent={<></>}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteran: PropTypes.shape({
        fullName: PropTypes.shape({
          first: PropTypes.string,
          middle: PropTypes.string,
          last: PropTypes.string,
        }).isRequired,
      }),
    }),
    submission: PropTypes.shape({
      response: PropTypes.shape({
        confirmationNumber: PropTypes.string,
      }),
      timestamp: PropTypes.string,
    }),
  }),
};

export default ConfirmationPage;
