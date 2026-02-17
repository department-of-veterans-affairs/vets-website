import React, { useRef, useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';

import { setData } from 'platform/forms-system/src/js/actions';
import { focusElement } from 'platform/utilities/ui/focus';
import { setReturnState } from 'platform/forms-system/src/js/utilities/data/profile';
import { createTransaction } from 'platform/user/profile/vap-svc/actions';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';

const EditPhone = ({
  data,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const [phone, setPhone] = useState(data?.phoneNumber || '');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (headerRef?.current) {
      focusElement(headerRef?.current);
    }
  }, [headerRef]);

  // Initialize phone from form data
  useEffect(() => {
    if (data?.phoneNumber) {
      setPhone(data.phoneNumber);
    }
  }, [data?.phoneNumber]);

  const validatePhone = value => {
    if (!value || value.trim() === '') {
      return 'Please provide a response.';
    }
    if (/[^0-9\-()]/.test(value)) {
      return 'You entered a character we can’t accept. You can only use numbers, dashes, and parentheses.';
    }
    // Remove non-digit characters for validation
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return 'This field should be at least 10 character(s)';
    }
    if (digitsOnly.length > 15) {
      return 'Phone number should be between 10-15 digits long';
    }
    return null;
  };

  const handleCancel = () => {
    setReturnState('phone', 'canceled');
    goToPath('/applicant-contact-info-logged-in');
  };

  const handleSubmit = async () => {
    const validationError = validatePhone(phone);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Extract digits only for storage
    const digitsOnly = phone.replace(/\D/g, '');
    const areaCode = digitsOnly.substring(0, 3);
    const phoneNumber = digitsOnly.substring(3);

    // Update form data locally first
    const updatedFormData = {
      ...data,
      phoneNumber: phone,
    };
    dispatch(setData(updatedFormData));

    // Try to update VA Profile (but don't block on failure)
    let profileUpdateSuccess = true;
    try {
      const vaProfilePhone = {
        areaCode,
        phoneNumber,
        phoneType: 'MOBILE',
      };

      const result = await dispatch(
        createTransaction(
          '/profile/telephones',
          'POST',
          FIELD_NAMES.MOBILE_PHONE,
          vaProfilePhone,
          'mobile-phone',
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
      setReturnState('phone', 'updated');
    } else {
      setReturnState('phone', 'form-only');
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
        <p>We may contact you at the phone number you provide here.</p>
        <va-text-input
          label="Phone number"
          name="phone"
          type="tel"
          value={phone}
          onInput={e => setPhone(e.target.value)}
          error={error}
          required
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

export default connect(mapStateToProps)(EditPhone);
