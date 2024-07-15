import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

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
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission?.timestamp;
  const confirmationNumber = submission?.response?.confirmationNumber;
  const submitterFullName = form.data?.['view:veteranPrefillStore']?.fullName;

  return (
    <ConfirmationPageView
      formType="submission"
      submitterHeader="Who submitted this form"
      submitterName={submitterFullName}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      content={content}
      childContent={<></>}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      'view:veteranPrefillStore': PropTypes.shape({
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
