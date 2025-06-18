import EditEmailPage from '../../../components/EditEmailPage';

/** @type {PageSchema} */
export default {
  title: 'Edit email address',
  path: 'veteran-contact-information/email',
  depends: () => false,
  hideNavButtons: true,
  hideStepper: true,
  CustomPage: EditEmailPage,
  CustomPageReview: null,
  uiSchema: {
    veteranContactInformation: {
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranContactInformation: {
        type: 'object',
        properties: {},
      },
    },
  },
};
