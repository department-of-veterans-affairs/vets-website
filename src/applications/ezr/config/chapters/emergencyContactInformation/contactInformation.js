import merge from 'lodash/merge';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  titleUI,
  descriptionUI,
  // fullNameUI,
  // phoneUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';
// import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';

const {
  veteranContacts: { items: emergencyContact },
} = ezrSchema.properties;

const {
  // fullName,
  // primaryPhone,
  address: { properties: schemaOverride },
  // relationship,
  // contactType,
} = emergencyContact.properties;

export default {
  uiSchema: {
    ...titleUI(content['emergency-contact-information-title']),
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    // emergencyContactFullName: fullNameUI(
    //   title =>
    //     `${content['emergency-contact-information-name-prefix']} ${title}`,
    // ),
    // emergencyContactPhoneNumber: phoneUI(
    //   content['emergency-contact-information-phone-label'],
    // ),
    address: addressUI({ omit: ['isMilitary'] }),
    // relationship: {
    //   'ui:title': content['insurance-policy-number-label'],
    //   'ui:webComponentField': VaSelectField,
    // },
    // contactType: {
    //   'ui:title': content['insurance-policy-number-label'],
    //   'ui:webComponentField': VaSelectField,
    // },
  },
  schema: {
    type: 'object',
    properties: {
      // emergencyContactFullName: fullName,
      // emergencyContactPhoneNumber: primaryPhone,
      address: merge({}, addressSchema({ omit: ['isMilitary'] }), {
        properties: schemaOverride,
      }),
      // relationship,
      // contactType,
    },
  },
};
