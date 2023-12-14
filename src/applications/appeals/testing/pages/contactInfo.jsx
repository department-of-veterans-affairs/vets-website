import React from 'react';

import ContactInformation from '../components/ContactInformation';
import { getFormattedPhone } from '../utils/contactInfo';

const contactInfo = {
  uiSchema: {
    'ui:description': ContactInformation,
  },
  schema: {
    type: 'object',
    properties: {},
  },
  review: data => ({
    'Mobile phone number': getFormattedPhone(data.veteran.mobilePhone),
    'Home phone number': getFormattedPhone(data.veteran.homePhone),
    'Email address': data.veteran.email,
    'Mailing address': (
      <>
        <div>{data.veteran.address.addressLine1}</div>
        <div>
          {`${data.veteran.address.city}, ${data.veteran.address.stateCode}`}
        </div>
        <div>{data.veteran.address.zipCode}</div>
        <div>{data.veteran.address.countryName || ''}</div>
      </>
    ),
  }),
};

export default contactInfo;
