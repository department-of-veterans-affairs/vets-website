import React from 'react';

import ContactInformation from '../components/ContactInformation';

const contactInfo = {
  uiSchema: {
    'ui:description': ContactInformation,
  },
  schema: {
    type: 'object',
    properties: {},
  },
  review: data => ({
    'Mobile phone number': '+1 (123) 456-7890',
    'Home phone number': '+1 (098) 765-4321',
    'Email address': 'allesandra.baker@gmail.com',
    'Mailing address': (
      <>
        <div>123 Charlesgate Rd</div>
        <div>Providence, Rhode Island</div>
        <div>02903</div>
      </>
    ),
    'Primary number': data.primaryPhone,
  }),
};

export default contactInfo;
