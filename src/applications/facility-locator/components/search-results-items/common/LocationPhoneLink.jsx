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

  const {
    extension,
    contact,
    processed,
    international,
    countryCode,
  } = parsePhoneNumber(phone);
  // The Telephone component will throw an error if passed an invalid phone number.
  // Since we can't use try/catch or componentDidCatch here, we'll just do this:
  if (contact.length !== 10) {
    return null;
  }

  const phoneNumberId = `${location.id}-${title.replaceAll(/\s+/g, '')}`;

  return (
    <p data-testid={title}>
      {from === 'FacilityDetail' && (
        <va-icon class="vads-u-margin-right--0p5" icon="phone" size="3" />
      )}
      {title && <strong id={phoneNumberId}>{title}: </strong>}
      {subTitle}
      {processed ? (
        <va-telephone
          className={
            subTitle ? 'vads-u-margin-left--0p5' : 'vads-u-margin-left--0p25'
          }
          contact={contact}
          extension={extension}
          message-aria-describedby={title}
          country-code={countryCode}
          international={international}
        />
      ) : (
        // eslint-disable-next-line @department-of-veterans-affairs/prefer-telephone-component
        <a href={`tel:${contact}`} aria-describedby={phoneNumberId}>
          {contact}
        </a>
      )}
    </p>
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
    <div className="facility-phone-group">
      {renderPhoneNumber('Main number', null, phone.main, from, location)}
      {showHealthConnectNumber &&
        renderPhoneNumber(
          'VA health connect',
          null,
          phone.healthConnect,
          from,
          location,
        )}
      {renderPhoneNumber(
        'Mental health',
        null,
        phone.mentalHealthClinic,
        from,
        location,
      )}
      <p>
        <strong>Telecommunications Relay Services (using TTY):</strong>{' '}
        <va-telephone tty contact="711" />
      </p>
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
