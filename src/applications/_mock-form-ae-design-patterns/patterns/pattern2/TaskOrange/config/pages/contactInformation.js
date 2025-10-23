import React from 'react';

import {
  ContactInformation,
  ContactInformationReview,
} from '../../pages/contact-information/ContactInformation';

export const contactInformation = {
  title: 'Contact information',
  path: 'personal-information/contact-information',
  initialData: {},
  CustomPage: ContactInformation,
  CustomPageReview: null,
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {},
  },
  review: props => ({
    'Contact Information': (() => {
      return <ContactInformationReview {...props} />;
    })(),
  }),
};
