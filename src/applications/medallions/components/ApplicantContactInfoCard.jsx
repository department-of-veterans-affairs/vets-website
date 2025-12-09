import React from 'react';
import { useSelector } from 'react-redux';
import { VaCard } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectProfile } from 'platform/user/selectors';

const ApplicantContactInfoCard = ({ formData, onEdit, content = '' }) => {
  const profile = useSelector(selectProfile);
  const { vapContactInfo } = profile || {};
  const { email: profileEmail, mobilePhone: profileMobilePhone } =
    vapContactInfo || {};

  // Use VA profile data if available, otherwise fall back to form data
  const formContactInfo = formData || {};
  const email = profileEmail?.emailAddress || formContactInfo.email;
  // const email = formContactInfo.email;

  // Get raw phone number (just area code + phone number, no extension)
  const phoneNumber = profileMobilePhone
    ? `${profileMobilePhone.areaCode}${profileMobilePhone.phoneNumber}`
    : formContactInfo.phoneNumber;

  const formatPhone = phone => {
    if (!phone) return 'Not provided';

    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');

    // Format as xxx-xxx-xxxx if we have exactly 10 digits
    if (digitsOnly.length === 10) {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(
        3,
        6,
      )}-${digitsOnly.slice(6)}`;
    }

    // If not 10 digits, return as-is (fallback)
    return phone;
  };

  return (
    <div className="vads-u-margin-bottom--3">
      <h3>Confirm the contact information we have on file for you</h3>
      {content && (
        <div className="vads-u-margin-bottom--2">
          <p className="vads-u-margin--0">{content}</p>
        </div>
      )}

      <VaCard canEdit>
        <h4 className="vads-u-font-size--h3 vads-u-width--auto vads-u-margin-top--0 vads-u-margin-bottom--2">
          Your contact information
        </h4>
        <div className="dd-privacy-hidden vads-u-margin-y--2">
          Email address: {email || 'Not provided'}
        </div>
        <div className="dd-privacy-hidden vads-u-margin-y--2">
          Phone number: {formatPhone(phoneNumber)}
        </div>
        <div className="vads-u-margin-y--1">
          <va-link
            active
            onClick={() => onEdit('phone')}
            label="Edit phone number"
            text="Edit"
            data-testid="edit-phone-button"
          />
        </div>
      </VaCard>
    </div>
  );
};

export default ApplicantContactInfoCard;
