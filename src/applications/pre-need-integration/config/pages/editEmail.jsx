import React, { useState } from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const EditEmail = ({
  data,
  setFormData,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const initialEmail = data?.application?.claimant?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email || email.trim() === '') {
      setError('Email address is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const handleSave = () => {
    if (!validateEmail()) {
      return;
    }

    const updatedData = {
      ...data,
      application: {
        ...data.application,
        claimant: {
          ...data.application.claimant,
          email: email.trim(),
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
      <h3>Edit email address</h3>
      <p>Please update your email address.</p>

      <div className="vads-u-margin-bottom--3">
        <VaTextInput
          label="Email address"
          name="email"
          type="email"
          value={email}
          onInput={e => {
            setEmail(e.target.value);
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

export default EditEmail;
