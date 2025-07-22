import {
  emailSchema,
  emailUI,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import environment from 'platform/utilities/environment';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...(environment.isProduction()
      ? titleUI(
          'Tell us how we can reach you if there’s a question about your request',
        )
      : titleUI(
          'Contact details',
          'Tell us how we can reach you if there’s a question about your request.',
        )),
    applicantPhone: phoneUI(),
    applicantEmail: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      applicantPhone: phoneSchema,
      applicantEmail: emailSchema,
    },
    required: ['applicantPhone'],
  },
};
