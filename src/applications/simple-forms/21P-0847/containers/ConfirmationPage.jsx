import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

const content = {
  headlineText: 'Thank you for submitting your request',
  nextStepsText:
    'You may now submit evidence in support of pending claims or appeals for potential accrued benefits for the claimant.',
};

export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission, data } = form;
  const { fullName } = data.veteran;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationPageView
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
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
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
