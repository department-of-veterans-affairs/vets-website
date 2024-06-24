import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import errorMessages from '../content/errorMessages';

const ShowPdfPassword = ({
  file,
  index,
  onSubmitPassword,
  passwordLabel = null,
  cancelButton,
  testVal = '', // for testing
}) => {
  const [value, setValue] = useState(testVal);
  const [dirty, setDirty] = useState(false);
  const inputRef = useRef(null);

  const setFocus = () => {
    if (inputRef?.current) {
      focusElement('input', {}, inputRef.current.shadowRoot);
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
        error={(dirty && !value && errorMessages.upload) || null}
        name={`get_password_${index}`}
        required
        value={value}
        onInput={({ target }) => setValue(target.value || '')}
        onBlur={() => setDirty(true)}
        messageAriaDescribedby={passwordLabel}
      />
      <va-button
        class="add-password vads-u-width--auto vads-u-margin-top--2"
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
      />
      {cancelButton}
    </div>
  );
};

ShowPdfPassword.propTypes = {
  cancelButton: PropTypes.element,
  file: PropTypes.shape({}),
  index: PropTypes.number,
  passwordLabel: PropTypes.string,
  testVal: PropTypes.string,
  onSubmitPassword: PropTypes.func,
};

export { ShowPdfPassword };
