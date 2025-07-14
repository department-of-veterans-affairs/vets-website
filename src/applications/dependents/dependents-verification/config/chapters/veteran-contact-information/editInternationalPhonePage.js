import {
  phoneSchema,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import EditInternationalPhonePage from '../../../components/EditInternationalPhonePage';

/** @type {PageSchema} */
export default {
  title: 'Edit international phone number',
  path: 'veteran-contact-information/international-phone',
  hideNavButtons: true,
  CustomPage: EditInternationalPhonePage,
  CustomPageReview: null,
  uiSchema: {
    internationalPhone: {
      ...phoneUI(),
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      internationalPhone: phoneSchema,
    },
  },
};

// export default {
//   title: 'Edit mailing address',
//   path: 'veteran-contact-information/mailing-address',
//   CustomPage: EditMailingAddressPage,
//   CustomPageReview: null,
//   uiSchema: {
//     address: {
//       ...addressUI(),
//       'ui:options': {
//         hideOnReview: true,
//       },
//     },
//   },
//   schema: {
//     type: 'object',
//     properties: {
//       address: addressSchema(),
//     },
//   },
// };
