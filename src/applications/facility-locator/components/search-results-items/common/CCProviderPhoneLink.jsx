import React from 'react';
import PropTypes from 'prop-types';
import { renderPhoneNumber } from './LocationPhoneLink';
import {
  LocationType,
  CLINIC_URGENTCARE_SERVICE,
  PHARMACY_RETAIL_SERVICE,
  EMERGENCY_CARE_SERVICES,
} from '../../../constants';

const CCProviderPhoneLink = ({ location, query }) => {
  const { caresitePhone: phone } = location.attributes;
  const isCCProvider =
    query &&
    query.facilityType === LocationType.CC_PROVIDER &&
    query.serviceType !== CLINIC_URGENTCARE_SERVICE &&
    query.serviceType !== PHARMACY_RETAIL_SERVICE &&
    !EMERGENCY_CARE_SERVICES.includes(query.serviceType);

  return (
    <div>
      {renderPhoneNumber('Main number', null, phone, location)}
      <p>
        <strong>Telecommunications Relay Services (using TTY):</strong>{' '}
        <va-telephone tty contact="711" />
      </p>
      {isCCProvider && (
        <p className="referral-message">
          If you don’t have a referral, contact your local VA medical center.
        </p>
      )}
    </div>
  );
};

CCProviderPhoneLink.propTypes = {
  location: PropTypes.object,
  query: PropTypes.object,
};

export default CCProviderPhoneLink;
