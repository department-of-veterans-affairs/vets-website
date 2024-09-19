import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  emailUI,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ContactInfoDescription from '../../../components/ContactInfoDescription';
import content from '../../../../../../shared/locales/en/content.json';

const { email, homePhone, mobilePhone } = ezrSchema.properties;

export default {
  uiSchema: {
    'view:contactInformation': {
      ...titleUI(content['vet-contact-info-title'], ContactInfoDescription),
      homePhone: {
        ...phoneUI(content['vet-home-phone-label']),
        'ui:errorMessages': {
          required: content['phone-number-error-message'],
          pattern: content['phone-number-error-message'],
        },
      },
      mobilePhone: {
        ...phoneUI(content['vet-mobile-phone-label']),
        'ui:errorMessages': {
          required: content['phone-number-error-message'],
          pattern: content['phone-number-error-message'],
        },
      },
      email: emailUI({
        errorMessages: {
          pattern: content['email-pattern-error-message'],
        },
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
