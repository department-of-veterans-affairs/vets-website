import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ShowPdfPassword = ({
  file,
  index,
  onSubmitPassword,
  ariaDescribedby = null,
  testVal = '', // for testing
}) => {
  const [value, setValue] = useState(testVal);
  const [dirty, setDirty] = useState(false);

  const errorMessage =
    dirty && !value ? 'Please provide a password to decrypt this file' : null;

  return (
    <div className="vads-u-margin-bottom--2">
      <va-text-input
        label="PDF password"
        error={errorMessage}
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
