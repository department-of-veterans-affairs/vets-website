import React from 'react';
import { useSelector } from 'react-redux';
import { VaCard } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectProfile } from 'platform/user/selectors';

const ApplicantMailingAddressCard = ({ formData, onEdit }) => {
  const profile = useSelector(selectProfile);
  const { vapContactInfo } = profile || {};
  const { mailingAddress: profileAddress } = vapContactInfo || {};

  // Use form data first (updated by user), then fall back to profile data
  const formAddress = formData?.applicantMailingAddress || {};
  const address = formAddress.street
    ? formAddress
    : profileAddress || formAddress;

  const formatAddress = addr => {
    if (!addr || (!addr.street && !addr.city)) return 'Not provided';

    const addressLines = [];

    // Street address lines
    if (addr.street) addressLines.push(addr.street);
    if (addr.street2) addressLines.push(addr.street2);

    // City, state, postal code line
    const cityStateZip = [];
    if (addr.city) cityStateZip.push(addr.city);
    if (addr.state) cityStateZip.push(addr.state);
    if (addr.postalCode) cityStateZip.push(addr.postalCode);
    if (cityStateZip.length > 0) {
      addressLines.push(cityStateZip.join(', '));
    }

    // Country (if not US)
    if (addr.country && addr.country !== 'US' && addr.country !== 'USA') {
      addressLines.push(addr.country);
    }

    return addressLines;
  };

  const addressLines = formatAddress(address);
  const hasAddress =
    addressLines.length > 0 && addressLines[0] !== 'Not provided';

  return (
    <div className="vads-u-margin-bottom--3">
      <VaCard canEdit>
        <h4 className="vads-u-font-size--h3 vads-u-width--auto vads-u-margin-top--0 vads-u-margin-bottom--2">
          Your mailing address
        </h4>
        <div className="dd-privacy-hidden vads-u-margin-y--2">
          {hasAddress
            ? addressLines.map((line, index) => (
                <div key={index} className="vads-u-margin-bottom--1">
                  {line}
                </div>
              ))
            : 'Not provided'}
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
