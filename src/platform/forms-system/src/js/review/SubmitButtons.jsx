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
  const {
    onBack,
    onSubmit,
    renderErrorMessage,
    submission,
    formConfig,
  } = props;

  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;

  if (submission.status === false) {
    return (
      <Default
        appType={appType}
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
        appType={appType}
        formConfig={formConfig}
        onBack={onBack}
        onSubmit={onSubmit}
      />
    );
  } else if (submission.status === 'throttledError') {
    return (
      <ThrottledError
        appType={appType}
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
        formConfig={formConfig}
        onBack={onBack}
        onSubmit={onSubmit}
      />
    );
  } else {
    return (
      <GenericError
        appType={appType}
        formConfig={formConfig}
        renderErrorMessage={renderErrorMessage}
        onBack={onBack}
        onSubmit={onSubmit}
      />
    );
  }
}

SubmitButtons.propTypes = {
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
  renderErrorMessage: PropTypes.bool,
  submission: PropTypes.object,
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      appType: PropTypes.string,
    }),
  }),
};
