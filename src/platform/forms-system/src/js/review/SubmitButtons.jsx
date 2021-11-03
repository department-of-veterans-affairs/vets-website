// libs
import React from 'react';
import PropTypes from 'prop-types';

// forms-system constants
import { APP_TYPE_DEFAULT } from '../constants';

// submit states
import ClientError from './submit-states/ClientError';
import Default from './submit-states/Default';
import GenericError from './submit-states/GenericError';
import Pending from './submit-states/Pending';
import Submitted from './submit-states/Submitted';
import ThrottledError from './submit-states/ThrottledError';
import ValidationError from './submit-states/ValidationError';

export default function SubmitButtons(props) {
  const { onBack, onSubmit, submission, formConfig, formErrors = {} } = props;

  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
  const buttonText =
    formConfig.customText?.submitButtonText || `Submit ${appType}`;

  if (submission.status === false) {
    return (
      <Default
        buttonText={buttonText}
        onBack={onBack}
        onSubmit={onSubmit}
        formConfig={formConfig}
      />
    );
  } else if (submission.status === 'submitPending') {
    return (
      <Pending onBack={onBack} onSubmit={onSubmit} formConfig={formConfig} />
    );
  } else if (submission.status === 'applicationSubmitted') {
    return (
      <Submitted onBack={onBack} onSubmit={onSubmit} formConfig={formConfig} />
    );
  } else if (submission.status === 'clientError') {
    return (
      <ClientError
        buttonText={buttonText}
        formConfig={formConfig}
        onBack={onBack}
        onSubmit={onSubmit}
      />
    );
  } else if (submission.status === 'throttledError') {
    return (
      <ThrottledError
        buttonText={buttonText}
        formConfig={formConfig}
        when={submission.extra}
        onBack={onBack}
        onSubmit={onSubmit}
      />
    );
  } else if (submission.status === 'validationError') {
    return (
      <ValidationError
        appType={appType}
        buttonText={buttonText}
        formConfig={formConfig}
        formErrors={formErrors}
        onBack={onBack}
        onSubmit={onSubmit}
      />
    );
  } else {
    return (
      <GenericError
        appType={appType}
        formConfig={formConfig}
        onBack={onBack}
        onSubmit={onSubmit}
      />
    );
  }
}

SubmitButtons.propTypes = {
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
  submission: PropTypes.object,
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      appType: PropTypes.string,
      submitButtonText: PropTypes.string,
    }),
  }),
};
