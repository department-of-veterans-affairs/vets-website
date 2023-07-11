import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '../ui';

const ShowPdfPassword = ({
  file,
  index,
  onSubmitPassword,
  ariaDescribedby = null,
  testVal = '', // for testing
}) => {
  const [value, setValue] = useState(testVal);
  const [dirty, setDirty] = useState(false);
  const inputRef = useRef(null);

  const errorMessage = 'Please provide a password to decrypt this file';

  const setFocus = () => {
    if (inputRef?.current) {
      focusElement('input', {}, inputRef.current.shadowRoot);
    } else {
      focusElement(`#root_additionalDocuments_file_${index}`);
    }
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
      <va-text-input
        ref={inputRef}
        label="PDF password"
        error={(dirty && !value && errorMessage) || null}
        name={`get_password_${index}`}
        required
        value={value}
        onInput={({ target }) => setValue(target.value || '')}
        onBlur={() => setDirty(true)}
        aria-describedby={ariaDescribedby}
      />
      <va-button
        className="vads-u-width--auto"
        text="Add password"
        onClick={() => {
          if (value) {
            onSubmitPassword(file, index, value);
          } else {
            setValue('');
            setDirty(true);
            setFocus();
          }
        }}
        aria-describedby={ariaDescribedby}
      />
    </div>
  );
};

ShowPdfPassword.propTypes = {
  ariaDescribedby: PropTypes.string,
  file: PropTypes.shape({}),
  index: PropTypes.number,
  testVal: PropTypes.string,
  onSubmitPassword: PropTypes.func,
};

const PasswordLabel = () => (
  <p>
    This is en encrypted PDF document. In order for us to be able to view the
    document, we will need the password to decrypt it.
  </p>
);

const PasswordSuccess = () => (
  <>
    <p>PDF password</p>
    <strong>The PDF password has been added.</strong>
  </>
);

export { ShowPdfPassword, PasswordLabel, PasswordSuccess };
