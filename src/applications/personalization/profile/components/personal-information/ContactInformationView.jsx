import React from 'react';
import PropTypes from 'prop-types';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { formatAddress } from '~/platform/forms/address/helpers';

import { FIELD_NAMES } from '@@vap-svc/constants';
import * as VAP_SERVICE from '@@vap-svc/constants';

import {
  addresses,
  phoneNumbers,
} from '@@profile/util/contact-information/getContactInfoFieldAttributes';

import ReceiveAppointmentReminders from './ReceiveAppointmentReminders';

const ContactInformationView = props => {
  const { data, fieldName, title } = props;
  if (!data) {
    return <span>Edit your profile to add a {title.toLowerCase()}.</span>;
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
          <ReceiveAppointmentReminders
            isReceivingReminders={data.isTextPermitted}
          />
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
