import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import content from '../../locales/en/content.json';
import NoticeAgreement from './NoticeAgreement';

const PreSubmitNotice = props => {
  const { onSectionComplete, preSubmitInfo, showError, submission } = props;
  const { field, required } = preSubmitInfo;

  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState(undefined);
  const formSubmitted = !!submission.status;

  // set section complete value--unset if user navigates away from the page before submitting the form.
  useEffect(
    () => {
      onSectionComplete(accepted);
      return () => {
        onSectionComplete(false);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accepted],
  );

  // set error message status
  useEffect(
    () => {
      const hasError = accepted === true || formSubmitted ? false : showError;
      const message = hasError ? content['presubmit-error-message'] : undefined;
      setError(message);
    },
    [accepted, showError, formSubmitted],
  );

  return (
    <>
      <NoticeAgreement />
      <VaCheckbox
        required={required}
        name={field}
        error={error}
        onVaChange={event => setAccepted(event.target.checked)}
        label={content['presubmit-checkbox-label']}
        uswds
      />
    </>
  );
};

PreSubmitNotice.propTypes = {
  formData: PropTypes.object,
  preSubmitInfo: PropTypes.object,
  showError: PropTypes.bool,
  submission: PropTypes.object,
  onSectionComplete: PropTypes.func,
};

const mapStateToProps = state => ({
  submission: state.form.submission,
});

export default connect(mapStateToProps)(PreSubmitNotice);
