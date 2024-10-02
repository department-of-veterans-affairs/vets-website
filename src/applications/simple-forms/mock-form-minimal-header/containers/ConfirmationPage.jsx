import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

const content = {
  headlineText: 'Thank you for completing your application',
  nextStepsText:
    'After we review your application, we’ll contact you to tell you what happens next in the application process.',
};

export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission, data } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationPageView
      submitterName={data.fullName}
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
