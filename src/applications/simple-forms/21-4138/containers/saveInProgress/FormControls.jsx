import React from 'react';
import PropTypes from 'prop-types';
import { fromUnixTime, isBefore } from 'date-fns';
import FormStartControls from '~/platform/forms/save-in-progress/FormStartControls';

const FormControls = props => {
  const {
    ariaDescribedby,
    ariaLabel,
    fetchInProgressForm,
    formId,
    gaStartEventName,
    messages,
    migrations,
    prefillTransformer,
    removeInProgressForm,
    resumeOnly,
    returnUrl,
    savedForm,
    startPage,
    startText,
    user,
  } = props;
  const { profile } = user;
  const prefillAvailable = !!(
    profile && profile.prefillsAvailable.includes(formId)
  );
  const isExpired = savedForm
    ? isBefore(fromUnixTime(savedForm.metadata.expiresAt), new Date())
    : false;
  return (
    <FormStartControls
      ariaDescribedby={ariaDescribedby}
      ariaLabel={ariaLabel}
      fetchInProgressForm={fetchInProgressForm}
      formId={formId}
      formSaved={!!savedForm}
      gaStartEventName={gaStartEventName}
      isExpired={isExpired}
      messages={messages}
      migrations={migrations}
      prefillAvailable={prefillAvailable}
      prefillTransformer={prefillTransformer}
      removeInProgressForm={removeInProgressForm}
      resumeOnly={resumeOnly}
      returnUrl={returnUrl}
      startPage={startPage}
      startText={startText}
    />
  );
};

FormControls.propTypes = {
  fetchInProgressForm: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  savedForm: PropTypes.object.isRequired,
  startPage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  gaStartEventName: PropTypes.string,
  messages: PropTypes.object,
  migrations: PropTypes.array,
  prefillTransformer: PropTypes.func,
  resumeOnly: PropTypes.bool,
  returnUrl: PropTypes.string,
  startText: PropTypes.string,
};

export default FormControls;
