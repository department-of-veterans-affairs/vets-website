import React from 'react';
import { formatAddress } from 'platform/forms/address/helpers';
import ReceiveTextMessages from 'platform/user/profile/vap-svc/containers/ReceiveTextMessages';
import { FIELD_NAMES } from '@@vap-svc/constants';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

const ContactInformationView = props => {
  const { data, type, fieldName } = props;
  if (!data) {
    return null;
  }

  if (type === 'email') {
    return <span>{data?.emailAddress}</span>;
  }

  if (type === 'phone') {
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

  if (type === 'address') {
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

  return null;
};

export default ContactInformationView;
