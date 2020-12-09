import React from 'react';
import { formatAddress } from 'platform/forms/address/helpers';
import ReceiveTextMessages from 'platform/user/profile/vap-svc/containers/ReceiveTextMessages';
import { FIELD_NAMES } from '@@vap-svc/constants';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

const renderContactInformation = (data, type, fieldName) => {
  if (type === 'address' && data) {
    const { street, cityStateZip, country } = formatAddress(data);

    return (
      <div>
        {street}
        <br />
        {cityStateZip}

        {country && (
          <>
            <br />
            {country}
          </>
        )}
      </div>
    );
  }

  if (type === 'email' && data) {
    return <span>{data?.emailAddress}</span>;
  }

  if (type === 'phone' && data) {
    return (
      <div>
        <Telephone
          contact={`${data?.areaCode}${data?.phoneNumber}`}
          extension={data?.extension}
          notClickable
        />

        {fieldName === FIELD_NAMES.MOBILE_PHONE && (
          <ReceiveTextMessages fieldName={FIELD_NAMES.MOBILE_PHONE} />
        )}
      </div>
    );
  }

  return null;
};

export default renderContactInformation;
