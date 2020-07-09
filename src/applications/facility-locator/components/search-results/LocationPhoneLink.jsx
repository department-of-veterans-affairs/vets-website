import React from 'react';
import PropTypes from 'prop-types';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';
import { LocationType } from '../../constants';

const renderPhoneNumber = (title, subTitle = null, phone, from) => {
  if (!phone) {
    return null;
  }

  // TODO: write a unit test for this parsing logic!
  const re = /^(\d{3})[ -]?(\d{3})[ -]?(\d{4})\s?(x|ext)[ ]?(\d*)/i;
  const formattedPhoneNumber = phone
    .replace(re, '$1-$2-$3 x$5')
    .replace(/x$/, '');
  const extension = phone.replace(re, '$5').replace(/\D/g, '');
  const contact = phone.replace(re, '$1$2$3');

  return (
    <div>
      {from === 'FacilityDetail' && (
        <i aria-hidden="true" role="presentation" className="fa fa-phone" />
      )}
      {title && <strong>{title}: </strong>}
      {subTitle}
      <Telephone
        className="vads-u-margin-left--0p25"
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
  const isCCProvider = query && query.facilityType === LocationType.CC_PROVIDER;
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
    <div>
      {renderPhoneNumber('Main Number', null, phone.main, from)}
      {renderPhoneNumber('Mental Health', null, phone.mentalHealthClinic, from)}
    </div>
  );
};

LocationPhoneLink.propTypes = {
  location: PropTypes.object,
  from: PropTypes.string,
};

export default LocationPhoneLink;
