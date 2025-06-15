import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
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
