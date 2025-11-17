import React from 'react';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  addressUI,
  addressSchema,
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  internationalPhoneSchema,
  internationalPhoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { inlineTitleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

import { veteranFields } from '../definitions/constants';
import TelephoneFieldNoInternalErrors from '../components/TelephoneFieldNoInternalErrors';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...inlineTitleUI('Contact information'),
      'ui:description': () => (
        <div style={{ paddingTop: '2rem' }}>
          How can we reach you? We’ll send any important information about your
          application to this mailing address.
        </div>
      ),

      [veteranFields.address]: addressUI({
        labels: {
          street2: 'Apartment or unit number',
          postalCode: 'Postal Code',
        },
        omit: ['street3'],
        required: true,
        errorMessages: {
          postalCode: 'Enter a Zip/Postal code',
        },
      }),
      [veteranFields.email]: emailToSendNotificationsUI({
        title: 'Email address',
        classNames: 'vads-u-margin-top--3',
      }),
      [veteranFields.agreeToElectronicCorrespondence]: {
        'ui:title':
          'I agree to receive electronic correspondence from VA about my application.',
        'ui:webComponentField': VaCheckboxField,
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
      [veteranFields.homePhone]: {
        ...internationalPhoneUI({
          title: 'Primary phone number',
        }),
        'ui:webComponentField': TelephoneFieldNoInternalErrors,
        'ui:required': () => true,
      },
      [veteranFields.alternatePhone]: {
        ...internationalPhoneUI({
          title: 'Alternate or international phone number (if applicable)',
          hideEmptyValueInReview: true,
        }),
        'ui:webComponentField': TelephoneFieldNoInternalErrors,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        required: [veteranFields.homePhone],
        properties: {
          [veteranFields.address]: addressSchema({ omit: ['street3'] }),
          [veteranFields.email]: emailToSendNotificationsSchema,
          [veteranFields.agreeToElectronicCorrespondence]: {
            type: 'boolean',
          },
          [veteranFields.homePhone]: internationalPhoneSchema({
            required: true,
          }),
          [veteranFields.alternatePhone]: internationalPhoneSchema(),
        },
      },
    },
  },
};
