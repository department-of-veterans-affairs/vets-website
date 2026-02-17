import React, { useRef, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import { setData } from 'platform/forms-system/src/js/actions';
import { focusElement } from 'platform/utilities/ui/focus';
import { setReturnState } from 'platform/forms-system/src/js/utilities/data/profile';
import { createTransaction } from 'platform/user/profile/vap-svc/actions';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';

const EditEmail = ({
  data,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const [email, setEmail] = useState(data?.email || '');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (headerRef?.current) {
      focusElement(headerRef?.current);
    }
  }, [headerRef]);

  // Initialize email from form data
  useEffect(() => {
    if (data?.email) {
      setEmail(data.email);
    }
  }, [data?.email]);

  const validateEmail = value => {
    if (!value || value.trim() === '') {
      return 'Please provide a response.';
    }
    if (/[^a-zA-Z0-9@./~!$%&*_=}{'`?\\-]/.test(value)) {
      return 'You entered a character we can’t accept. Try removing spaces and any special characters like commas or brackets.';
    }
    if (
      value.length > 50 ||
      value.startsWith('.') ||
      value.endsWith('.') ||
      value.includes('..') ||
      value.includes('.@') ||
      value.includes('@.') ||
      (value.match(/@/g) || []).length !== 1 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      return 'Enter a valid email address using the format email@domain.com.';
    }
    return null;
  };

  const handleCancel = () => {
    setReturnState('email', 'canceled');
    goToPath('/applicant-contact-info-logged-in');
  };

  const handleSubmit = async () => {
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Update form data locally first
    const updatedFormData = {
      ...data,
      email,
    };
    dispatch(setData(updatedFormData));

    // Try to update VA Profile (but don't block on failure)
    let profileUpdateSuccess = true;
    try {
      const vaProfileEmail = {
        emailAddress: email,
      };

      const result = await dispatch(
        createTransaction(
          '/profile/email_addresses',
          'POST',
          FIELD_NAMES.EMAIL,
          vaProfileEmail,
          'email',
        ),
      );

      // Check if the transaction failed
      if (!result || result.error || result.errors) {
        profileUpdateSuccess = false;
      }
    } catch (profileError) {
      // VA Profile update failed, but form data is already updated
      profileUpdateSuccess = false;
    }

    // Set return state based on whether profile update succeeded
    if (profileUpdateSuccess) {
      setReturnState('email', 'updated');
    } else {
      setReturnState('email', 'form-only');
    }

    setIsSubmitting(false);
    goToPath('/applicant-contact-info-logged-in');
  };

  return (
    <div>
      <div className="va-profile-wrapper">
        <va-alert status="info" visible slim>
          <p className="vads-u-margin--0">
            Any changes you make will also be reflected on your VA.gov profile.
          </p>
        </va-alert>
        <h3 ref={headerRef} className="vads-u-font-size--h3">
          Edit your contact information
        </h3>
        <p>We may contact you at the email address you provide here.</p>
        <va-text-input
          label="Email address"
          name="email"
          type="email"
          value={email}
          onInput={e => setEmail(e.target.value)}
          error={error}
          required
          maxLength={50}
        />
        <div className="vads-u-margin-top--2">
          <va-button
            text="Update"
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
          <va-button
            text="Cancel"
            secondary
            onClick={handleCancel}
            class="vads-u-margin-left--1"
          />
        </div>
      </div>
      {contentBeforeButtons}
      {contentAfterButtons}
    </div>
  );
};

// Map state to props
const mapStateToProps = state => ({
  data: state?.form?.data,
});

export default connect(mapStateToProps)(EditEmail);
