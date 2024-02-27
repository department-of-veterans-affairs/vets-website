import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import MilitaryPrefillMessage from 'platform/forms/save-in-progress/MilitaryPrefillMessage';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { teraInformationEnabled } from '../../../utils/helpers/form-config';

const {
  campLejeune,
  disabledInLineOfDuty,
  exposedToRadiation,
  isFormerPow,
  postNov111998Combat,
  purpleHeartRecipient,
  radiumTreatments,
  swAsiaCombat,
  vietnamService,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    ...titleUI('Service history', 'Check all that apply to you.'),
    'ui:description': MilitaryPrefillMessage,
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
      vietnamService: {
        'ui:title':
          'Served in Vietnam between January 9, 1962, and May 7, 1975',
        'ui:options': {
          hideIf: teraInformationEnabled,
        },
      },
      exposedToRadiation: {
        'ui:title': 'Exposed to radiation while in the military',
        'ui:options': {
          hideIf: teraInformationEnabled,
        },
      },
      radiumTreatments: {
        'ui:title':
          'Received nose/throat radium treatments while in the military',
        'ui:options': {
          hideIf: teraInformationEnabled,
        },
      },
      campLejeune: {
        'ui:title':
          'Served on active duty at least 30 days at Camp Lejeune from January 1, 1953, through December 31, 1987',
        'ui:options': {
          hideIf: teraInformationEnabled,
        },
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
          vietnamService,
          exposedToRadiation,
          radiumTreatments,
          campLejeune,
        },
      },
    },
  },
};
