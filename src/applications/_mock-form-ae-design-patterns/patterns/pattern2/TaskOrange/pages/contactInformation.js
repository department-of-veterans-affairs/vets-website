import React from 'react';

import {
  PersonalInformationContactReview,
  PersonalInformationContact,
} from './PersonalInformation';

export default function createContactInformationPage() {
  return {
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
}
