import React from 'react';
import PropTypes from 'prop-types';
import { CLINIC_URGENTCARE_SERVICE, LocationType } from '../../constants';

const renderPhoneNumber = (
  title,
  subTitle = null,
  phone,
  icon = 'fw',
  altPhone,
  from,
  isCCProvider,
) => {
  if (!phone) {
    return null;
  }

  const re = /^(\d{3})[ -]?(\d{3})[ -]?(\d{4})[ ]?(x?)[ ]?(\d*)/;

  return (
    <div>
      {from === 'FacilityDetail' && <i className={`fa fa-${icon}`} />}
      {title && <strong>{title}: </strong>}
      {!isCCProvider && phone.replace(re, '$1-$2-$3 $4$5').replace(/x$/, '')}
      <br />
      {from === 'FacilityDetail' && <i className="fa fa-fw" />}
      {subTitle}
      {isCCProvider &&
        ` ${phone.replace(re, '$1-$2-$3 $4$5').replace(/x$/, '')}`}
      {from === 'FacilityDetail' ? (
        <a
          href={`tel:${phone.replace(/[ ]?x/, '')}`}
          className={altPhone && 'facility-phone-alt'}
        >
          {phone.replace(re, '$1-$2-$3 $4$5').replace(/x$/, '')}
        </a>
      ) : null}
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
          'phone',
          true,
          undefined,
          isCCProvider,
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
    <div>
      {renderPhoneNumber('Main Number', null, phone.main, 'phone', null, from)}
      {renderPhoneNumber(
        'Mental Health',
        null,
        phone.mentalHealthClinic,
        null,
        from,
      )}
    </div>
  );
};

LocationPhoneLink.propTypes = {
  location: PropTypes.object,
};

export default LocationPhoneLink;
