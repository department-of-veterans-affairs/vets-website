import { phoneUI } from 'platform/forms-system/src/js/web-component-patterns';
import EditInternationalPhonePage from '../../../components/EditInternationalPhonePage';

const intPhoneSchema = {
  type: 'string',
  pattern: '^$|^\\d{11}$', // needs to allow empty string OR 11 digits for downstream services
};

/** @type {PageSchema} */
export default {
  title: 'Edit international number',
  path: 'veteran-contact-information/international-phone',
  hideNavButtons: true,
  CustomPage: EditInternationalPhonePage,
  CustomPageReview: null,
  uiSchema: {
    internationalPhone: {
      ...phoneUI({
        title: 'International number',
        errorMessages: {
          pattern: 'Enter an international number up to 11 digits',
        },
      }),
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      internationalPhone: intPhoneSchema,
    },
  },
};
