import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { specialMonthlyPensionDescription } from '../helpers';
import { SpecialMonthlyPensionEvidenceAlert } from '../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Special monthly pension',
    'ui:description': specialMonthlyPensionDescription,
    specialMonthlyPension: yesNoUI({
      title: 'Are you claiming special monthly pension?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
    'view:warningAlert': {
      'ui:description': SpecialMonthlyPensionEvidenceAlert,
      'ui:options': {
        hideIf: formData => formData.specialMonthlyPension !== true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['specialMonthlyPension'],
    properties: {
      specialMonthlyPension: yesNoSchema,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
