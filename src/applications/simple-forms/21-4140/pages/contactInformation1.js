import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  titleUI,
  addressUI,
  addressSchema,
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
      ...titleUI({
        title: 'Contact information',
        description:
          'We’ll send any important information about your application to this mailing address.',
      }),
      [veteranFields.address]: addressUI({
        labels: {
          street2: 'Apartment or unit number',
        },
        omit: ['street3'],
        required: true,
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
        'ui:required': () => true,
      },
      [veteranFields.alternatePhone]: internationalPhoneUI({
        title: 'Alternate or international phone number (if applicable)',
        hideEmptyValueInReview: true,
      }),
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
          [veteranFields.homePhone]: internationalPhoneSchema({ required: true }),
          [veteranFields.alternatePhone]: internationalPhoneSchema(),
        },
      },
    },
  },
};
