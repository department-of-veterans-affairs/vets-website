import React from 'react';
// import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
// import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';

export const homelessInfo = {
  uiSchema: {
    'view:homelessInfo': {
      'ui:description': (
        <></>
        // // COMMENTED OUT UNTIL WE FINALIZE WORDING
        // <va-additional-info
        //   trigger="If you don’t have an address"
        //   class="vads-u-margin-bottom--4"
        // >
        //   <p>
        //     If you don’t currently have a mailing address or are experiencing
        //     homelessness you can use{' '}
        //     <va-link
        //       text="General Delivery"
        //       target="_blank"
        //       href="https://faq.usps.com/s/article/What-is-General-Delivery"
        //     />{' '}
        //     through your local post office.
        //     <br />
        //     <br />
        //     If you are a veteran who is homeless or at imminent risk of
        //     homelessness, we strongly encourage you to contact the National Call
        //     Center for Homeless Veterans at{' '}
        //     <VaTelephone contact={CONTACTS['4AID_VET']} /> for assistance.
        //   </p>
        // </va-additional-info>
      ),
    },
  },
  schema: { 'view:homelessInfo': blankSchema },
};

export const noPhoneInfo = {
  uiSchema: {
    'view:noPhoneInfo': {
      'ui:description': (
        <></>
        // // COMMENTED OUT UNTIL WE FINALIZE WORDING
        // <va-additional-info
        //   trigger="If you don’t have a phone number"
        //   class="vads-u-margin-bottom--4"
        // >
        //   <p>
        //     If you don’t currently have a phone number, please enter a phone
        //     number of someone who you have contact with.
        //   </p>
        // </va-additional-info>
      ),
    },
  },
  schema: { 'view:noPhoneInfo': blankSchema },
};
