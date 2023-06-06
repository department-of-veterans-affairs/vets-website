import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

const content = {
  headlineText: 'You’ve successfully submitted your Lay/Witness Statement',
  nextStepsText:
    'Once we’ve reviewed your submission, a coordinator will contact you to discuss next steps.',
};

export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const fullName = { first: 'John', middle: 'M', last: 'Doe', suffix: 'Jr.' };
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
