import React from 'react';
import PropTypes from 'prop-types';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';
import { LocationType, CLINIC_URGENTCARE_SERVICE } from '../../constants';
import { parsePhoneNumber } from '../../utils/phoneNumbers';

const renderPhoneNumber = (title, subTitle = null, phone, from) => {
  if (!phone) {
    return null;
  }

  const { formattedPhoneNumber, extension, contact } = parsePhoneNumber(phone);

  // The Telephone component will throw an error if passed an invalid phone number.
  // Since we can't use try/catch or componentDidCatch here, we'll just do this:
  if (contact.length !== 10) {
    return null;
  }

  return (
    <div>
      {from === 'FacilityDetail' && (
        <i aria-hidden="true" role="presentation" className="fa fa-phone" />
      )}
      {title && <strong>{title}: </strong>}
      {subTitle}
      <Telephone
        className={
          subTitle ? 'vads-u-margin-left--0p5' : 'vads-u-margin-left--0p25'
        }
        contact={contact}
        extension={extension}
      >
        {formattedPhoneNumber}
      </Telephone>
    </div>
  );
};

const LocationPhoneLink = ({ location, from, query }) => {
  const isProvider = location.type === LocationType.CC_PROVIDER;
  const isCCProvider =
    query &&
    query.facilityType === LocationType.CC_PROVIDER &&
    query.serviceType !== CLINIC_URGENTCARE_SERVICE;
  if (isProvider) {
    const { caresitePhone: phone } = location.attributes;
    return (
      <div>
        {renderPhoneNumber(
          isCCProvider ? 'If you have a referral' : null,
          isCCProvider ? 'Call this facility at' : null,
          phone,
          true,
        )}
        {isCCProvider && (
          <p>
            If you don’t have a referral, contact your local VA medical center.
          </p>
        )}
      </div>
    );
  }

  const {
    attributes: { phone },
  } = location;
  return (
    <div className="facility-phone-group">
      {renderPhoneNumber('Main number', null, phone.main, from)}
      {renderPhoneNumber('Mental health', null, phone.mentalHealthClinic, from)}
    </div>
  );
};

LocationPhoneLink.propTypes = {
  location: PropTypes.object,
  from: PropTypes.string,
};

export default LocationPhoneLink;
