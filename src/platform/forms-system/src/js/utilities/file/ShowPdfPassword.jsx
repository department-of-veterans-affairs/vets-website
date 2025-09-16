import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from '../ui';
import validatePdfPassword from './validatePdfPassword';

const ShowPdfPassword = ({
  file,
  index,
  onSubmitPassword,
  passwordLabel = null,
  testVal = '', // for testing
}) => {
  const [value, setValue] = useState(testVal);
  const [dirty, setDirty] = useState(false);
  const [validating, setValidating] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const inputRef = useRef(null);

  const setFocus = () => {
    if (inputRef?.current) {
      focusElement('input', {}, inputRef.current.shadowRoot);
    } else {
      focusElement(`#root_additionalDocuments_file_${index}`);
    }
  };

  const errorMessage =
    passwordError || 'Please provide a password to decrypt this file';

  const handleSubmit = async () => {
    if (!value) {
      setValue('');
      setDirty(true);
      setFocus();
      return;
    }

    setValidating(true);
    setPasswordError(null);

    // Validate password before uploading
    const validation = await validatePdfPassword(file, value);

    if (!validation.valid && !validation.skipped) {
      setPasswordError(validation.error);
      setValidating(false);
      setFocus();
      return;
    }

    // Password is valid or validation was skipped - proceed with upload
    setValidating(false);
    onSubmitPassword(file, index, value);
  };

  useEffect(
    () => {
      if (dirty && !value && inputRef?.current) {
        setFocus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dirty, value, inputRef],
  );

  return (
    <div className="vads-u-margin-bottom--2">
      <VaTextInput
        ref={inputRef}
        label="PDF password"
        // Show specific passwordError if present (e.g. incorrect password), otherwise
        // show required message when field is dirty & empty
        error={passwordError || (dirty && !value ? errorMessage : null)}
        name={`get_password_${index}`}
        required
        value={value}
        onInput={({ target }) => setValue(target.value || '')}
        onBlur={() => setDirty(true)}
        messageAriaDescribedby={passwordLabel}
        uswds
      />
      <va-button
        class="vads-u-width--auto vads-u-margin-top--2"
        text={validating ? 'Validating...' : 'Add password'}
        onClick={handleSubmit}
        disabled={validating}
        label={passwordLabel}
        uswds
      />
    </div>
  );
};

ShowPdfPassword.propTypes = {
  file: PropTypes.shape({}),
  index: PropTypes.number,
  passwordLabel: PropTypes.string,
  testVal: PropTypes.string,
  onSubmitPassword: PropTypes.func,
};

const PasswordLabel = () => (
  <p>
    This is an encrypted PDF document. In order for us to be able to view the
    document, we will need the password to decrypt it.
  </p>
);

const PasswordSuccess = () => (
  <>
    <p className="vads-u-margin-top--2">PDF password</p>
    <strong>The PDF password has been added.</strong>
  </>
);

export { ShowPdfPassword, PasswordLabel, PasswordSuccess };
