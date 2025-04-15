import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaCheckbox } from '../../utils/imports';
import content from '../../locales/en/content.json';
import NoticeAgreement from './NoticeAgreement';

const PreSubmitNotice = ({ preSubmitInfo, showError, onSectionComplete }) => {
  const formSubmitted = !!useSelector(state => state.form.submission.status);
  const { field, required } = preSubmitInfo;

  const [accepted, setAccepted] = useState(false);

  const onVaCheckboxChange = useCallback(
    event => setAccepted(event.target.checked),
    [],
  );

  const error = useMemo(
    () =>
      accepted || formSubmitted || !showError
        ? null
        : content['presubmit--error-message'],
    [accepted, formSubmitted, showError],
  );

  useEffect(
    () => {
      onSectionComplete(accepted);
      return () => onSectionComplete(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accepted],
  );

  return (
    <>
      <NoticeAgreement />
      <VaCheckbox
        name={field}
        label={content['presubmit--checkbox-label']}
        onVaChange={onVaCheckboxChange}
        error={error}
        required={required}
      />
    </>
  );
};

PreSubmitNotice.propTypes = {
  preSubmitInfo: PropTypes.shape({
    field: PropTypes.string,
    required: PropTypes.bool,
  }),
  showError: PropTypes.bool,
  onSectionComplete: PropTypes.func,
};

export default PreSubmitNotice;
