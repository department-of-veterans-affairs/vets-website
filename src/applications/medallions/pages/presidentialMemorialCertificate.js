import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';

import { learnMoreAboutCertsLink } from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Presidential Memorial Certificate',
      'You can get a Presidential Memorial Certificate (PMC) sent to your mailing address.',
    ),
    'ui:description': learnMoreAboutCertsLink,

    pmcYesNo: yesNoUI({
      title: 'Do you want a Presidential Memorial Certificate?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      pmcYesNo: yesNoSchema,
    },
    required: ['pmcYesNo'],
  },
};
