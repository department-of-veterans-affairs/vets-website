import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  descriptionUI,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

const {
  veteranContacts: { items: emergencyContact },
} = ezrSchema.properties;

const { primaryPhone } = emergencyContact.properties;

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    emergencyContactPhoneNumber: phoneUI(
      content['emergency-contact-information-phone-label'],
    ),
  },
  schema: {
    type: 'object',
    properties: {
      emergencyContactPhoneNumber: primaryPhone,
    },
  },
};
