import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

const content = {
  headlineText: 'Thank you for submitting your authorization request',
  nextStepsText:
    'After we review your authorization, we’ll contact the private provider or hospital to get the requested records. If we can’t get the records within 15 days we’ll send you a follow-up letter by mail.',
};

export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission, data } = form;
  const preparerNameDefined =
    data.preparerIdentification?.preparerFullName?.first &&
    data.preparerIdentification?.preparerFullName?.last;
  const preparerName = preparerNameDefined
    ? data.preparerIdentification.preparerFullName
    : data.veteran.fullName;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationPageView
      submitterName={preparerName}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      content={content}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
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
