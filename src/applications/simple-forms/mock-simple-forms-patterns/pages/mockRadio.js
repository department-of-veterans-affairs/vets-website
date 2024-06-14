import {
  inlineTitleSchema,
  inlineTitleUI,
  radioSchema,
  radioUI,
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CompensationTypeDescription } from '../components/formDescriptions';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF'),
    vaCompensationType: {
      'ui:title': 'Do you receive VA disability compensation?',
      'ui:description': CompensationTypeDescription,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          lowDisability:
            'Yes, for a service-connected disability rating of up to 40%',
          highDisability:
            'Yes, for a service-connected disability rating of 50% or higher',
          none: 'No',
        },
      },
    },
    isCurrentlyActiveDuty: {
      'ui:title': 'Are you on active duty now?',
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          Y: 'Before military service',
          N: 'After military service',
        },
      },
    },
    'view:inlineTitle': inlineTitleUI('Web component v3'),
    wcv3VaCompensationType: radioUI({
      title: 'Do you receive VA disability compensation?',
      description: CompensationTypeDescription,
      labels: {
        lowDisability:
          'Yes, for a service-connected disability rating of up to 40%',
        highDisability:
          'Yes, for a service-connected disability rating of 50% or higher',
        none: 'No',
      },
    }),
    wcv3VaTileCompensationType: radioUI({
      title: 'Do you receive VA disability compensation?',
      description: CompensationTypeDescription,
      tile: true,
      labels: {
        lowDisability:
          'Yes, for a service-connected disability rating of up to 40%',
        highDisability:
          'Yes, for a service-connected disability rating of 50% or higher',
        none: 'No',
      },
    }),
    wcv3IsCurrentlyActiveDuty: yesNoUI({
      title: 'Are you on active duty now?',
      labels: {
        Y: 'Yes, the Veteran is on active duty now',
        N: 'No, the Veteran is not on active duty now',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      vaCompensationType: {
        type: 'string',
        enum: ['lowDisability', 'highDisability', 'none'],
      },
      isCurrentlyActiveDuty: {
        type: 'boolean',
      },
      'view:inlineTitle': inlineTitleSchema,
      wcv3VaCompensationType: radioSchema([
        'lowDisability',
        'highDisability',
        'none',
      ]),
      wcv3VaTileCompensationType: radioSchema([
        'lowDisability',
        'highDisability',
        'none',
      ]),
      wcv3IsCurrentlyActiveDuty: yesNoSchema,
    },
    required: [
      'vaCompensationType',
      'wcv3VaCompensationType',
      'wcv3VaTileCompensationType',
      'wcv3IsCurrentlyActiveDuty',
    ],
  },
};
