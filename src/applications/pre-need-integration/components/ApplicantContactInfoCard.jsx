import React from 'react';
import { VaCard } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ApplicantContactInfoCard = ({ formData, onEdit, content = '' }) => {
  const { email, phoneNumber } = formData?.application?.claimant || {};

  const formatPhone = phone => {
    if (!phone) return 'Not provided';
    return `${phone.areaCode}${phone.phoneNumber}${
      phone.phoneNumberExt ? ` ext. ${phone.phoneNumberExt}` : ''
    }`;
  };

  return (
    <div className="vads-u-margin-bottom--3">
      {content && (
        <div className="vads-u-margin-bottom--2">
          <p className="vads-u-margin--0">{content}</p>
        </div>
      )}

      <VaCard>
        <div className="vads-u-padding--2">
          <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Contact information
          </h3>

          <div className="vads-u-margin-bottom--2">
            <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--flex-start">
              <div>
                <p className="vads-u-margin--0">
                  <strong>Phone number</strong>
                </p>
                <p className="vads-u-margin--0">{formatPhone(phoneNumber)}</p>
              </div>
              <va-button
                secondary
                text="Edit"
                onClick={() => onEdit('phone')}
                data-testid="edit-phone-button"
              />
            </div>
          </div>

          <div>
            <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--flex-start">
              <div>
                <p className="vads-u-margin--0">
                  <strong>Email address</strong>
                </p>
                <p className="vads-u-margin--0">{email || 'Not provided'}</p>
              </div>
              <va-button
                secondary
                text="Edit"
                onClick={() => onEdit('email')}
                data-testid="edit-email-button"
              />
            </div>
          </div>
        </div>
      </VaCard>
    </div>
  );
};

export default ApplicantContactInfoCard;
