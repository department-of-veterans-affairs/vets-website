import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView.v2';

const content = {
  headlineText: 'Your form has been submitted and is pending processing',
  nextStepsText: (
    <p>
      Right now your form is pending processing. We’ll review your submission
      and contact you if we have any questions.
    </p>
  ),
};

const ConfirmationPage = () => {
  const form = require('../tests/e2e/fixtures/mocks/mock-form.json');
  const formConfig = require('../tests/e2e/fixtures/mocks/mock-form-config.json');
  const { timestamp, response = {} } = form.submission;
  const submitterFullName = form.data?.veteran?.fullName;

  return (
    <ConfirmationPageView
      formType="submission"
      formConfig={formConfig}
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
