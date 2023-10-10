import ezrSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  emailUI,
  phoneUI,
  descriptionUI,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ContactInfoDescription from '../../../components/FormDescriptions/ContactInfoDescription';
import content from '../../../locales/en/content.json';

const { email } = ezrSchema.properties;
const { phone } = ezrSchema.definitions;

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:pageTitle': inlineTitleUI(
      content['vet-contact-info-title'],
      ContactInfoDescription,
    ),
    homePhone: phoneUI(content['vet-home-phone-label']),
    mobilePhone: phoneUI(content['vet-mobile-phone-label']),
    email: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:pageTitle': inlineTitleSchema,
      homePhone: phone,
      mobilePhone: phone,
      email,
    },
  },
};
