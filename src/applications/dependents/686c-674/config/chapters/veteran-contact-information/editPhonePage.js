import {
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import EditPhonePage from '../../../components/EditPhonePage';

// const phoneSchema = {
//   type: 'string',
//   pattern: '^$|^\\d{3}-?\\d{3}-?\\d{4}$', // needs to allow empty string OR 10 digits
// };

/** @type {PageSchema} */
export default {
  title: 'Edit phone number',
  path: 'veteran-contact-information/phone',
  hideNavButtons: true,
  CustomPage: EditPhonePage,
  CustomPageReview: null,
  depends: () => false,
  uiSchema: {
    phoneNumber: {
      ...phoneUI({
        required: () => true,
      }),
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      phoneNumber: phoneSchema,
    },
  },
};
