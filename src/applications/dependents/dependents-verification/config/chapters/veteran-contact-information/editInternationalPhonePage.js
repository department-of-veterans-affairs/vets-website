import EditInternationalPhonePage from '../../../components/EditInternationalPhonePage';

/** @type {PageSchema} */
export default {
  title: 'Edit phone number',
  path: 'veteran-contact-information/international-phone',
  depends: () => false,
  hideNavButtons: true,
  CustomPage: EditInternationalPhonePage,
  CustomPageReview: null,
  uiSchema: {
    'ui:options': {
      hideOnReview: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
