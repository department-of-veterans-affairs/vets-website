import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  emailUI,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ContactInfoDescription from '../../../components/FormDescriptions/ContactInfoDescription';
import content from '../../../locales/en/content.json';

const { email, homePhone, mobilePhone } = ezrSchema.properties;

export default {
  uiSchema: {
    'view:contactInformation': {
      ...titleUI(content['vet-contact-info-title'], ContactInfoDescription),
      homePhone: phoneUI({
        title: content['vet-home-phone-label'],
        errorMessages: { pattern: content['phone-number-error-message'] },
      }),
      mobilePhone: phoneUI({
        title: content['vet-mobile-phone-label'],
        errorMessages: { pattern: content['phone-number-error-message'] },
      }),
      email: emailUI({
        errorMessages: { pattern: content['email-pattern-error-message'] },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:contactInformation': {
        type: 'object',
        properties: {
          homePhone,
          mobilePhone,
          email,
        },
      },
    },
  },
};
