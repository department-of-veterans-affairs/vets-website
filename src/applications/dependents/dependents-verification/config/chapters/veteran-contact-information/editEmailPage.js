import {
  emailSchema,
  emailUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import EditEmailPage from '../../../components/EditEmailPage';

/** @type {PageSchema} */
export default {
  title: 'Edit email address',
  path: 'veteran-contact-information/email',
  hideNavButtons: true,
  hideStepper: true,
  CustomPage: EditEmailPage,
  CustomPageReview: null,
  uiSchema: {
    email: {
      ...emailUI({
        title: 'Email address',
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
      email: emailSchema,
    },
  },
};
