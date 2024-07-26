import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

const content = {
  headlineText: "You've submitted your form",
  nextStepsText: (
    <p>We’ll review your form and contact you if we need more information.</p>
  ),
};

const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { timestamp, response = {} } = form.submission;
  const submitterFullName = form.data?.veteran?.fullName;

  return (
    <ConfirmationPageView
      formType="submission"
      submitterHeader="Who submitted this form"
      submitterName={submitterFullName}
      submitDate={timestamp}
      confirmationNumber={response.confirmationNumber}
      content={content}
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
