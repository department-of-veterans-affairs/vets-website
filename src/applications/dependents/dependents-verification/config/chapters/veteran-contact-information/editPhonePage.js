import { phoneUI } from 'platform/forms-system/src/js/web-component-patterns';
import EditPhonePage from '../../../components/EditPhonePage';

const phoneSchema = {
  type: 'string',
  pattern: '^$|^\\d{3}-?\\d{3}-?\\d{4}$', // needs to allow empty string OR 10 digits
};

/** @type {PageSchema} */
export default {
  title: 'Edit phone number',
  path: 'veteran-contact-information/phone',
  hideNavButtons: true,
  CustomPage: EditPhonePage,
  CustomPageReview: null,
  uiSchema: {
    phone: {
      ...phoneUI({
        title: 'Phone number',
      }),
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
    },
  },
};
