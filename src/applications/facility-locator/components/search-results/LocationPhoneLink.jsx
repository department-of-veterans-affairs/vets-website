import React from 'react';
import PropTypes from 'prop-types';
import { LocationType } from '../../constants';

const renderPhoneNumber = (
  title,
  subTitle = null,
  phone,
  icon = 'fw',
  altPhone,
) => {
  if (!phone) {
    return null;
  }

  const re = /^(\d{3})[ -]?(\d{3})[ -]?(\d{4})[ ]?(x?)[ ]?(\d*)/;

  return (
    <div>
      <i className={`fa fa-${icon}`} />
      <strong>{title}:</strong>
      <br />
      <i className="fa fa-fw" />
      {subTitle}
      <a
        href={`tel:${phone.replace(/[ ]?x/, '')}`}
        className={altPhone && 'facility-phone-alt'}
      >
        {phone.replace(re, '$1-$2-$3 $4$5').replace(/x$/, '')}
      </a>
    </div>
  );
};

const LocationPhoneLink = ({ location }) => {
  const isProvider = location.type === LocationType.CC_PROVIDER;

  if (isProvider) {
    const { phone } = location.attributes;
    return (
      <div>
        {renderPhoneNumber(
          'If you have a referral',
          'Call this facility at',
          phone,
          'phone',
          true,
        )}
        <p>
          If you don’t have a referral, contact your local VA medical center.
        </p>
      </div>
    );
  }

  const {
    attributes: { phone },
  } = location;
  return (
    <div>
      {renderPhoneNumber('Main Number', null, phone.main, 'phone')}
      {renderPhoneNumber('Mental Health', null, phone.mentalHealthClinic)}
    </div>
  );
};

LocationPhoneLink.propTypes = {
  location: PropTypes.object,
};

export default LocationPhoneLink;
