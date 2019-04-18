/* eslint-disable no-use-before-define */
import React from 'react';
import PropTypes from 'prop-types';
import { LocationType } from '../../constants';

const LocationPhoneLink = ({ location }) => {
  const isProvider = location.type === LocationType.CC_PROVIDER;

  if (isProvider) {
    const { phone, schedPhone = '866-606-8198' } = location.attributes;
    return (
      <div>
        {renderPhoneNumber(
          'If you have a referral',
          'Call this facility at',
          phone,
          'phone',
          true,
        )}
        {renderPhoneNumber(
          "If you don't have a referral",
          'Call the VA Medical Center at',
          schedPhone,
          null,
          true,
        )}
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

// eslint-disable-next-line prettier/prettier
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

LocationPhoneLink.propTypes = {
  location: PropTypes.object,
};

export default LocationPhoneLink;
