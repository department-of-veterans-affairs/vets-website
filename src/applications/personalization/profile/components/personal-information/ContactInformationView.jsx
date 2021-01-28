import React from 'react';
import PropTypes from 'prop-types';
import { formatAddress } from 'platform/forms/address/helpers';
import ReceiveTextMessages from 'platform/user/profile/vap-svc/containers/ReceiveTextMessages';
import { FIELD_NAMES } from '@@vap-svc/constants';
import * as VAP_SERVICE from '@@vap-svc/constants';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import {
  addresses,
  phoneNumbers,
} from '~/applications/personalization/profile/util/contact-information/getContactInfoFieldAttributes';

const ContactInformationView = props => {
  const { data, fieldName } = props;
  if (!data) {
    return null;
  }

  if (fieldName === FIELD_NAMES.EMAIL) {
    return <span>{data.emailAddress}</span>;
  }

  if (phoneNumbers.includes(fieldName)) {
    return (
      <div>
        <Telephone
          contact={`${data.areaCode}${data.phoneNumber}`}
          extension={data.extension}
          notClickable
        />

        {fieldName === FIELD_NAMES.MOBILE_PHONE && (
          <ReceiveTextMessages fieldName={FIELD_NAMES.MOBILE_PHONE} />
        )}
      </div>
    );
  }

  if (addresses.includes(fieldName)) {
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

ContactInformationView.propTypes = {
  data: PropTypes.object,
  fieldName: PropTypes.oneOf(Object.values(VAP_SERVICE.FIELD_NAMES)).isRequired,
};

export default ContactInformationView;
