import React from 'react';
import { VaCard } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatPhone } from '../utils/helpers';

const ApplicantContactInfoCard = ({ formData, onEdit, content = '' }) => {
  const formContactInfo = formData || {};
  const { email, phoneNumber } = formContactInfo;

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
          Your phone number
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
          Your email address
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
