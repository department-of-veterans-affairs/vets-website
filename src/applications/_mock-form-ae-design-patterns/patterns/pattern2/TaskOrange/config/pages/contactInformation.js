import React from 'react';

import {
  PersonalInformationContactReview,
  PersonalInformationContact,
} from '../../pages/ContactInformation';

export const contactInformation = {
  title: 'Contact information',
  path: 'personal-information/contact-information',
  initialData: {},
  CustomPage: PersonalInformationContact,
  CustomPageReview: null,
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {},
  },
  review: props => ({
    'Contact Information': (() => {
      return <PersonalInformationContactReview {...props} />;
    })(),
  }),
};
