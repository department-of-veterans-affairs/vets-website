import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import UnauthenticatedWarningAlert from '../../../components/UnauthenticatedWarningAlert';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your identity'),
    'view:warningAlert': {
      'ui:description': UnauthenticatedWarningAlert,
    },
    claimantNotVeteran: yesNoUI({
      title: 'Which of these best describes you?',
      yesNoReverse: true,
      labels: {
        Y: 'I’m a Veteran, and I want to report unreimbursed medical expenses',
        N:
          'I’m a spouse, child or dependent of a deceased Veteran, and I want to report unreimbursed medical expenses',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantNotVeteran'],
    properties: {
      claimantNotVeteran: {
        type: 'boolean',
      },
    },
  },
};
