import {
  inlineTitleSchema,
  inlineTitleUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import { CompensationTypeDescription } from 'applications/hca/components/FormDescriptions';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsfTitle: titleUI('RJSF'),
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
    currentlyActiveDuty: {
      yes: {
        'ui:title': 'Are you on active duty now?',
        'ui:widget': 'yesNo',
      },
      onTerminalLeave: {
        'ui:title': 'Are you on terminal leave now?',
        'ui:widget': 'yesNo',
        'ui:options': {
          expandUnder: 'yes',
        },
      },
    },
    wcTitle: inlineTitleUI('Web component'),
    wcOldVaCompensationType: {
      'ui:title': 'Do you receive VA disability compensation?',
      'ui:description': CompensationTypeDescription,
      'ui:webComponentField': VaRadioField,
      'ui:options': {
        uswds: false,
        labels: {
          lowDisability:
            'Yes, for a service-connected disability rating of up to 40%',
          highDisability:
            'Yes, for a service-connected disability rating of 50% or higher',
          none: 'No',
        },
      },
    },
    wcOldVaTileCompensationType: {
      'ui:title': 'Do you receive VA disability compensation?',
      'ui:description': CompensationTypeDescription,
      'ui:webComponentField': VaRadioField,
      'ui:options': {
        uswds: false,
        tile: true,
        labels: {
          lowDisability:
            'Yes, for a service-connected disability rating of up to 40%',
          highDisability:
            'Yes, for a service-connected disability rating of 50% or higher',
          none: 'No',
        },
      },
    },
    wcOldCurrentlyActiveDuty: {
      yes: {
        ...yesNoUI('Are you on active duty now?'),
        'ui:options': {
          uswds: false,
        },
      },
      onTerminalLeave: {
        ...yesNoUI('Are you on terminal leave now?'),
        'ui:options': {
          expandUnder: 'yes',
          uswds: false,
        },
      },
    },
    wcv3Title: inlineTitleUI('Web component v3'),
    wcv3VaCompensationType: {
      'ui:title': 'Do you receive VA disability compensation?',
      'ui:description': CompensationTypeDescription,
      'ui:webComponentField': VaRadioField,
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
    wcv3VaTileCompensationType: {
      'ui:title': 'Do you receive VA disability compensation?',
      'ui:description': CompensationTypeDescription,
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        tile: true,
        labels: {
          lowDisability:
            'Yes, for a service-connected disability rating of up to 40%',
          highDisability:
            'Yes, for a service-connected disability rating of 50% or higher',
          none: 'No',
        },
      },
    },
    wcv3CurrentlyActiveDuty: {
      yes: yesNoUI('Are you on active duty now?'),
      onTerminalLeave: {
        ...yesNoUI('Are you on terminal leave now?'),
        'ui:options': {
          expandUnder: 'yes',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      rjsfTitle: titleSchema,
      vaCompensationType: {
        type: 'string',
        enum: ['lowDisability', 'highDisability', 'none'],
      },
      currentlyActiveDuty: {
        type: 'object',
        properties: {
          yes: {
            type: 'boolean',
          },
          onTerminalLeave: {
            type: 'boolean',
          },
        },
      },
      wcTitle: inlineTitleSchema,
      wcOldVaCompensationType: {
        type: 'string',
        enum: ['lowDisability', 'highDisability', 'none'],
      },
      wcOldVaTileCompensationType: {
        type: 'string',
        enum: ['lowDisability', 'highDisability', 'none'],
      },
      wcOldCurrentlyActiveDuty: {
        type: 'object',
        properties: {
          yes: {
            type: 'boolean',
          },
          onTerminalLeave: {
            type: 'boolean',
          },
        },
      },
      wcv3Title: inlineTitleSchema,
      wcv3VaCompensationType: {
        type: 'string',
        enum: ['lowDisability', 'highDisability', 'none'],
      },
      wcv3VaTileCompensationType: {
        type: 'string',
        enum: ['lowDisability', 'highDisability', 'none'],
      },
      wcv3CurrentlyActiveDuty: {
        type: 'object',
        properties: {
          yes: {
            type: 'boolean',
          },
          onTerminalLeave: {
            type: 'boolean',
          },
        },
      },
    },
    required: [
      'vaCompensationType',
      'wcOldVaCompensationType',
      'wcOldVaTileCompensationType',
      'wcv3VaCompensationType',
      'wcv3VaTileCompensationType',
    ],
  },
};
