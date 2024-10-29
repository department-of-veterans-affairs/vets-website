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
    depends: args => {
      // on the review page we want to show this page
      // so passing in location to check if we are on the review page
      const pathname = args?.location?.pathname;
      const shouldShow = pathname?.includes?.('review');
      return !!shouldShow;
    },
  };
}
