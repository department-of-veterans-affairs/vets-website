import React from 'react';
import { useSelector } from 'react-redux';
import { VaCard } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectProfile } from 'platform/user/selectors';

const ApplicantMailingAddressCard = ({ formData, onEdit, content = '' }) => {
  const profile = useSelector(selectProfile);
  const { vapContactInfo } = profile || {};
  const { mailingAddress: profileMailingAddress } = vapContactInfo || {};

  // Use VA profile data if available, otherwise fall back to form data
  const formAddressInfo = formData?.application?.claimant?.address || {};

  const address = profileMailingAddress || formAddressInfo;

  const formatAddress = addr => {
    if (!addr) return null;

    const {
      addressLine1,
      addressLine2,
      city,
      stateCode,
      zipCode,
      countryName,
      // Form data field names
      street,
      street2,
      state,
      postalCode,
      country,
    } = addr;

    // Handle both profile format and form format
    const line1 = addressLine1 || street;
    const line2 = addressLine2 || street2;
    const addressCity = city;
    const addressState = stateCode || state;
    const addressZip = zipCode || postalCode;
    const addressCountry = countryName || country;

    if (!line1) return null;

    const addressLines = [];

    // Add address line 1
    addressLines.push(line1);

    // Add address line 2 if it exists
    if (line2) {
      addressLines.push(line2);
    }

    // Add city, state, zip line if any exist
    if (addressCity || addressState || addressZip) {
      const cityStateZip = `${addressCity || ''}${
        addressCity && (addressState || addressZip) ? ', ' : ''
      }${addressState || ''}${
        addressState && addressZip ? ' ' : ''
      }${addressZip || ''}`;
      addressLines.push(cityStateZip);
    }

    // Add country if it's not US
    if (addressCountry && addressCountry !== 'United States') {
      addressLines.push(addressCountry);
    }

    return addressLines;
  };

  return (
    <div className="vads-u-margin-bottom--3">
      <h3>Confirm the mailing address we have on file for you</h3>
      {content && (
        <div className="vads-u-margin-bottom--2">
          <p className="vads-u-margin--0">{content}</p>
        </div>
      )}

      <VaCard canEdit>
        <h4 className="vads-u-font-size--h3 vads-u-width--auto vads-u-margin-top--0 vads-u-margin-bottom--2">
          Your mailing address
        </h4>
        <div className="dd-privacy-hidden vads-u-margin-y--2">
          {formatAddress(address) ? (
            formatAddress(address).map((line, index) => (
              <div key={index} className="vads-u-margin-bottom--2">
                {line}
              </div>
            ))
          ) : (
            <div>Not provided</div>
          )}
        </div>
        <div className="vads-u-margin-y--1">
          <va-link
            active
            onClick={() => onEdit('address')}
            label="Edit mailing address"
            text="Edit"
            data-testid="edit-address-button"
          />
        </div>
      </VaCard>
    </div>
  );
};

export default ApplicantMailingAddressCard;
