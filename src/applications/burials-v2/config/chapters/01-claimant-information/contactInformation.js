import {
  phoneUI,
  emailUI,
  phoneSchema,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Contact information'),
    claimantEmail: {
      ...emailUI('Your email address'),
      'ui:options': {
        uswds: true,
      },
    },
    claimantPhone: {
      ...phoneUI('Your phone number'),
      'ui:options': {
        uswds: true,
      },
    },
    claimantIntPhone: {
      ...phoneUI('Your international phone number'),
      'ui:options': {
        uswds: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      claimantEmail: emailSchema,
      claimantPhone: phoneSchema,
      claimantIntPhone: phoneSchema,
    },
  },
};
