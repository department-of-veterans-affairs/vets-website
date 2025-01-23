import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';

const {
  disabledInLineOfDuty,
  isFormerPow,
  postNov111998Combat,
  purpleHeartRecipient,
  swAsiaCombat,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI('Service history', 'Check all that apply to you.'),
    'view:serviceHistory': {
      purpleHeartRecipient: {
        'ui:title': 'Purple Heart award recipient',
      },
      isFormerPow: {
        'ui:title': 'Former Prisoner of War',
      },
      postNov111998Combat: {
        'ui:title':
          'Served in combat theater of operations after November 11, 1998',
      },
      disabledInLineOfDuty: {
        'ui:title':
          'Discharged or retired from the military for a disability incurred in the line of duty',
      },
      swAsiaCombat: {
        'ui:title':
          'Served in Southwest Asia during the Gulf War between August 2, 1990, and November 11, 1998',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:serviceHistory': {
        type: 'object',
        properties: {
          purpleHeartRecipient,
          isFormerPow,
          postNov111998Combat,
          disabledInLineOfDuty,
          swAsiaCombat,
        },
      },
    },
  },
};
