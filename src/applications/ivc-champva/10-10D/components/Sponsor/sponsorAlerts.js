import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const blankSchema = { type: 'object', properties: {} };

export const homelessInfo = {
  uiSchema: {
    'view:homelessInfo': {
      'ui:description': (
        <va-alert status="info" visible uswds>
          <h3 slot="headline">Resources available</h3>
          <p>
            If you don’t currently have a mailing address or are experiencing
            homelessness you can use{' '}
            <a href="https://faq.usps.com/s/article/What-is-General-Delivery">
              General Delivery
            </a>{' '}
            through your local post office.
            <br />
            <br />
            If you are a veteran who is homeless or at imminent risk of
            homelessness, we strongly encourage you to contact the National Call
            Center for Homeless Veterans at{' '}
            <VaTelephone contact={CONTACTS['4AID_VET']} /> for assistance.
          </p>
        </va-alert>
      ),
    },
  },
  schema: { 'view:homelessInfo': blankSchema },
};

export const noPhoneInfo = {
  uiSchema: {
    'view:noPhoneInfo': {
      'ui:description': (
        <va-alert status="info" visible uswds>
          <h3 slot="headline">Resources available</h3>
          <p>
            If you don’t currently have a phone number, here is a suggestion and
            a link to a resource <VaTelephone contact={CONTACTS['4AID_VET']} />.
          </p>
        </va-alert>
      ),
    },
  },
  schema: { 'view:noPhoneInfo': blankSchema },
};
