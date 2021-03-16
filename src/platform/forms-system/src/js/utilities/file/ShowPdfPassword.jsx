import React, { useState } from 'react';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

const ShowPdfPassword = ({ file, index, onSubmitPassword }) => {
  const [fieldObj, setFieldObj] = useState({
    dirty: false,
    charMax: 255,
    value: '',
  });

  const showError = fieldObj.dirty && !fieldObj.value;
  return (
    <div className="vads-u-margin-bottom--2">
      <TextInput
        label={'PDF password'}
        errorMessage={
          showError && 'Please provide a password to decrypt this file'
        }
        name={`get_password_${index}`}
        required
        field={fieldObj}
        onValueChange={updatedField => {
          setFieldObj(updatedField);
        }}
      />
      <button
        type="button"
        className="usa-button-primary va-button-primary vads-u-width--auto"
        onClick={() => {
          if (fieldObj.value) {
            onSubmitPassword(file, index, fieldObj.value);
          } else {
            setFieldObj({
              dirty: true,
              charMax: 255,
              value: '',
            });
          }
        }}
      >
        Add password
      </button>
    </div>
  );
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
