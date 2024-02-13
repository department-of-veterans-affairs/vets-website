import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  descriptionUI,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';
import content from '../../../locales/en/content.json';

const {
  veteranContacts: { items: emergencyContact },
} = ezrSchema.properties;
const updatedEzrSchema = emergencyContact.properties;
// Remove 'suffix' from the veteranContacts fullName schema
delete updatedEzrSchema.fullName.properties.suffix;
const { fullName, relationship } = updatedEzrSchema;

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    fullName: fullNameUI(
      title =>
        `${content['emergency-contact-information-name-prefix']} ${title}`,
    ),
    relationship: {
      'ui:title': content['emergency-contact-relationship-label'],
      'ui:webComponentField': VaSelectField,
    },
  },
  schema: {
    type: 'object',
    required: ['relationship'],
    properties: {
      fullName,
      relationship,
    },
  },
};
