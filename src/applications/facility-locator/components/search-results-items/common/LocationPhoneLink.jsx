import React from 'react';
import PropTypes from 'prop-types';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import {
  LocationType,
  CLINIC_URGENTCARE_SERVICE,
  PHARMACY_RETAIL_SERVICE,
  Covid19Vaccine,
} from '../../../constants';
import { parsePhoneNumber } from '../../../utils/phoneNumbers';

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
  const isCovid19Search =
    query &&
    query.facilityType === LocationType.HEALTH &&
    query.serviceType === Covid19Vaccine;
  const isCCProvider =
    query &&
    query.facilityType === LocationType.CC_PROVIDER &&
    query.serviceType !== CLINIC_URGENTCARE_SERVICE &&
    query.serviceType !== PHARMACY_RETAIL_SERVICE;

  if (isProvider) {
    const { caresitePhone: phone } = location.attributes;
    return (
      <div>
        {renderPhoneNumber('Main number', null, phone, true)}
        {isCCProvider && (
          <p id={'referral-message'}>
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
    <div className="facility-phone-group vads-u-margin-top--2">
      {renderPhoneNumber('Main number', null, phone.main, from)}
      {!isCovid19Search &&
        phone.mentalHealthClinic && <div style={{ minHeight: '20px' }} />}
      {!isCovid19Search &&
        renderPhoneNumber(
          'Mental health',
          null,
          phone.mentalHealthClinic,
          from,
        )}
    </div>
  );
};

LocationPhoneLink.propTypes = {
  location: PropTypes.object,
  from: PropTypes.string,
  query: PropTypes.object,
};

export default LocationPhoneLink;
