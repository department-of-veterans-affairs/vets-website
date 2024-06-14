import React from 'react';
import PropTypes from 'prop-types';
import { LocationType } from '../../../constants';
import { parsePhoneNumber } from '../../../utils/phoneNumbers';
import CCProviderPhoneLink from './CCProviderPhoneLink';

export const renderPhoneNumber = (
  title,
  subTitle = null,
  phone,
  from,
  location,
) => {
  if (!phone) {
    return null;
  }

  const { formattedPhoneNumber, extension, contact } = parsePhoneNumber(phone);

  // The Telephone component will throw an error if passed an invalid phone number.
  // Since we can't use try/catch or componentDidCatch here, we'll just do this:
  if (contact.length !== 10) {
    return null;
  }

  const phoneNumberId = `${location.id}-${title.replaceAll(/\s+/g, '')}`;

  return (
    <div>
      {from === 'FacilityDetail' && <va-icon icon="phone" size="3" />}
      {title && <strong id={phoneNumberId}>{title}: </strong>}
      {subTitle}
      <va-telephone
        className={
          subTitle ? 'vads-u-margin-left--0p5' : 'vads-u-margin-left--0p25'
        }
        contact={contact}
        extension={extension}
        aria-describedby={phoneNumberId}
        message-aria-describedby={title}
      >
        {formattedPhoneNumber}
      </va-telephone>
    </div>
  );
};

// NOTE: Do not use this component to display Covid19 appointment phone numbers.
// Use Covid19PhoneLink instead.

const LocationPhoneLink = ({
  location,
  from,
  query,
  showHealthConnectNumber = false,
}) => {
  const isProvider = location.type === LocationType.CC_PROVIDER;
  const { phone } = location.attributes;

  if (isProvider) {
    return (
      <CCProviderPhoneLink
        location={location}
        query={query}
        renderPhoneNumber={renderPhoneNumber}
      />
    );
  }

  return (
    <div className="facility-phone-group vads-u-margin-top--2">
      {renderPhoneNumber('Main number', null, phone.main, from, location)}
      {showHealthConnectNumber && <div style={{ minHeight: '20px' }} />}
      {showHealthConnectNumber &&
        renderPhoneNumber(
          'VA health connect',
          null,
          phone.healthConnect,
          from,
          location,
        )}
      {phone.mentalHealthClinic && <div style={{ minHeight: '20px' }} />}
      {renderPhoneNumber(
        'Mental health',
        null,
        phone.mentalHealthClinic,
        from,
        location,
      )}
    </div>
  );
};

LocationPhoneLink.propTypes = {
  from: PropTypes.string,
  location: PropTypes.object,
  query: PropTypes.object,
  showHealthConnectNumber: PropTypes.bool,
};

export default LocationPhoneLink;
