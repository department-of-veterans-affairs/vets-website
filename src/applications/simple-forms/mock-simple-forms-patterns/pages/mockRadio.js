import {
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import { CompensationTypeDescription } from 'applications/hca/components/FormDescriptions';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI('RJSF'),
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
    wc: titleUI('Web component', {
      classNames: 'vads-u-margin-top--4',
    }),
    wcVaCompensationType: {
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
    wcVaTileCompensationType: {
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
    wcCurrentlyActiveDuty: {
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
    wcv3: titleUI('Web component v3', {
      classNames: 'vads-u-margin-top--4',
    }),
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
      rjsf: titleSchema,
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
      wc: titleSchema,
      wcVaCompensationType: {
        type: 'string',
        enum: ['lowDisability', 'highDisability', 'none'],
      },
      wcVaTileCompensationType: {
        type: 'string',
        enum: ['lowDisability', 'highDisability', 'none'],
      },
      wcCurrentlyActiveDuty: {
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
      wcv3: titleSchema,
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
      'wcVaCompensationType',
      'wcVaTileCompensationType',
      'wcv3VaCompensationType',
      'wcv3VaTileCompensationType',
    ],
  },
};
