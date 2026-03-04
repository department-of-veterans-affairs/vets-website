import React from 'react';
import {
  titleUI,
  addressUI,
  addressSchema,
  checkboxUI,
  checkboxSchema,
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  internationalPhoneSchema,
  internationalPhoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...titleUI('Contact information', 'How can we reach you?'),
      [veteranFields.address]: addressUI({
        labels: {
          street2: 'Apartment or unit number',
          postalCode: 'ZIP code',
        },
        omit: ['street3'],
        required: true,
      }),
      [veteranFields.plannedAddress]: {
        ...addressUI({
          labels: {
            street2: 'Apartment or unit number',
            postalCode: 'ZIP code',
          },
          omit: ['street3'],
          required: false,
        }),
        'ui:title': 'Planned address (if applicable)',
        'ui:description': (
          <p className="vads-u-margin-top--0">
            If you&apos;re a service member planning early release, provide your
            planned address following release from active duty.
          </p>
        ),
        'ui:options': { hideEmptyValueInReview: true },
      },
      [veteranFields.homePhone]: {
        ...internationalPhoneUI({ title: 'Primary phone number' }),
        'ui:required': () => true,
      },
      [veteranFields.alternatePhone]: {
        ...internationalPhoneUI({
          title: 'Alternate or international phone number (optional)',
          hideEmptyValueInReview: true,
        }),
      },
      [veteranFields.email]: emailToSendNotificationsUI({
        title: 'Email address',
        hint: "We'll use this to confirm when we receive your form",
      }),
      [veteranFields.agreeToElectronicCorrespondence]: checkboxUI({
        title:
          'I agree to receive electronic correspondence from VA regarding my claim',
        'ui:options': { hideEmptyValueInReview: true },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        properties: {
          [veteranFields.address]: addressSchema({ omit: ['street3'] }),
          [veteranFields.plannedAddress]: addressSchema({
            omit: ['street3'],
            required: false,
          }),
          [veteranFields.homePhone]: internationalPhoneSchema({
            required: true,
          }),
          [veteranFields.alternatePhone]: internationalPhoneSchema(),
          [veteranFields.email]: emailToSendNotificationsSchema,
          [veteranFields.agreeToElectronicCorrespondence]: checkboxSchema,
        },
        required: [veteranFields.address, veteranFields.homePhone],
      },
    },
  },
};
