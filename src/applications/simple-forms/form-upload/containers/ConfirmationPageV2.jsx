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

const ConfirmationPageV2 = () => {
  const form = {
    data: { veteran: { fullName: { first: 'John', last: 'Veteran' } } },
    submission: {
      timestamp: 1721999975,
      response: { confirmationNumber: '2106a7e8-27dd-46b4-886a-29b780723f4c' },
    },
  };
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

ConfirmationPageV2.propTypes = {
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

export default ConfirmationPageV2;
