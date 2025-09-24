import React from 'react';
import { VaCard } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ApplicantContactInfoCard = ({ formData, onEdit, content = '' }) => {
  const { email, phoneNumber } = formData?.application?.claimant || {};

  const formatPhone = phone => {
    if (!phone) return 'Not provided';
    // Phone is now a string, just return it as is
    return phone;
  };

  return (
    <div className="vads-u-margin-bottom--3">
      {content && (
        <div className="vads-u-margin-bottom--2">
          <p className="vads-u-margin--0">{content}</p>
        </div>
      )}

      <VaCard canEdit>
        <h4 className="vads-u-font-size--h3 vads-u-width--auto vads-u-margin-top--0 vads-u-margin-bottom--2">
          Phone number
        </h4>
        <div className="dd-privacy-hidden vads-u-margin-y--2">
          {formatPhone(phoneNumber)}
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

      <VaCard canEdit className="vads-u-margin-top--2">
        <h4 className="vads-u-font-size--h3 vads-u-width--auto vads-u-margin-top--0 vads-u-margin-bottom--2">
          Email address
        </h4>
        <div className="dd-privacy-hidden vads-u-margin-y--2">
          {email || 'Not provided'}
        </div>
        <div className="vads-u-margin-y--1">
          <va-link
            active
            onClick={() => onEdit('email')}
            label="Edit email address"
            text="Edit"
            data-testid="edit-email-button"
          />
        </div>
      </VaCard>
    </div>
  );
};

export default ApplicantContactInfoCard;
