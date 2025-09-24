import React, { useState } from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const EditPhone = ({
  data,
  setFormData,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const initialPhone = data?.application?.claimant?.phoneNumber || '';
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [error, setError] = useState('');

  const validatePhone = () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      setError('Phone number is required');
      return false;
    }

    // Remove all non-digits to check length
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setError('Phone number must be at least 10 digits');
      return false;
    }

    setError('');
    return true;
  };

  const handleSave = () => {
    if (!validatePhone()) {
      return;
    }

    const updatedData = {
      ...data,
      application: {
        ...data.application,
        claimant: {
          ...data.application.claimant,
          phoneNumber: phoneNumber.trim(),
        },
      },
    };
    setFormData(updatedData);
    goToPath('applicant-contact-details-logged-in', { force: true });
  };

  const handleCancel = () => {
    goToPath('applicant-contact-details-logged-in', { force: true });
  };

  return (
    <div>
      {contentBeforeButtons}
      <h3>Edit phone number</h3>
      <p>Please update your phone number.</p>

      <div className="vads-u-margin-bottom--3">
        <VaTextInput
          label="Phone number"
          name="phoneNumber"
          value={phoneNumber}
          type="tel"
          inputmode="tel"
          onInput={e => {
            setPhoneNumber(e.target.value);
            if (error) {
              setError('');
            }
          }}
          error={error}
          required
        />
      </div>

      <div className="vads-u-margin-bottom--3">
        <va-button onClick={handleSave} text="Save" />
        <va-button
          secondary
          onClick={handleCancel}
          text="Cancel"
          className="vads-u-margin-left--1"
        />
      </div>

      {contentAfterButtons}
    </div>
  );
};

export default EditPhone;
