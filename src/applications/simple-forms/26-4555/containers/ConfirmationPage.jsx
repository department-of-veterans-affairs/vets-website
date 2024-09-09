import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

export const ConfirmationPage = props => {
  const { form } = props;
  const { submission, data } = form;

  const { fullName } = data.veteran;
  const submitDate = submission.timestamp;
  const { referenceNumber, status } = submission.response;

  let content = {
    headlineText: 'Thank you for completing your benefit application',
    nextStepsText: `After we review your application, we’ll contact you to validate your information. If you have any questions about your application, contact us at 877-827-3702, select the Specially Adapted Housing grant option, and give them your confirmation number ${referenceNumber}.`,
  };

  if (status === 'REJECTED') {
    content = {
      headlineText: 'Thank you for completing your benefit application',
      nextStepsText: `We received your application, but there was a problem. For more information, contact us at 877-827-3702, select the Specially Adapted Housing grant option, and give them your confirmation number ${referenceNumber}.`,
    };
  } else if (status === 'DUPLICATE') {
    content = {
      headlineText: 'Thank you for completing your benefit application',
      nextStepsText: `We received your application, but we already have an existing housing grant application from you on file. We're still processing your existing application. If you have any questions, contact us at 877-827-3702, select the Specially Adapted Housing grant option.`,
    };
  }

  return (
    <ConfirmationPageView
      submitterName={fullName}
      submitDate={submitDate}
      confirmationNumber={referenceNumber}
      content={content}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteran: {
        fullName: {
          first: PropTypes.string,
          middle: PropTypes.string,
          last: PropTypes.string,
          suffix: PropTypes.string,
        },
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
      response: {
        referenceNumber: PropTypes.string,
        status: PropTypes.string,
      },
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
