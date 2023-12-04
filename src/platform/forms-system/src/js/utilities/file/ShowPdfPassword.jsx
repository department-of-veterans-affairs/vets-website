import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from '../ui';

const ShowPdfPassword = ({
  file,
  index,
  onSubmitPassword,
  passwordLabel = null,
  testVal = '', // for testing
  uswds,
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
      <VaTextInput
        ref={inputRef}
        label="PDF password"
        error={(dirty && !value && errorMessage) || null}
        name={`get_password_${index}`}
        required
        value={value}
        onInput={({ target }) => setValue(target.value || '')}
        onBlur={() => setDirty(true)}
        messageAriaDescribedby={passwordLabel}
        uswds={uswds}
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
        label={passwordLabel}
        uswds={uswds}
      />
    </div>
  );
};

ShowPdfPassword.propTypes = {
  file: PropTypes.shape({}),
  index: PropTypes.number,
  passwordLabel: PropTypes.string,
  testVal: PropTypes.string,
  uswds: PropTypes.bool,
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
