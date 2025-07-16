import EditPhonePage from '../../../components/EditPhonePage';

/** @type {PageSchema} */
export default {
  title: 'Edit phone number',
  path: 'veteran-contact-information/phone',
  depends: () => false,
  hideNavButtons: true,
  CustomPage: EditPhonePage,
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
