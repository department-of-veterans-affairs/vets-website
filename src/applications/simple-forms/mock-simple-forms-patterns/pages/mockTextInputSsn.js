import {
  ssnUI as ssnNewUI,
  ssnSchema as ssnNewSchema,
  vaFileNumberSchema as vaFileNumberNewSchema,
  vaFileNumberUI as vaFileNumberNewUI,
  serviceNumberUI as serviceNumberNewUI,
  serviceNumberSchema as serviceNumberNewSchema,
  ssnOrVaFileNumberOrServiceNumberUI,
  titleSchema,
  titleUI,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ssnUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const v3WCUI = ssnOrVaFileNumberOrServiceNumberUI(title => `V3 - ${title}`);

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsfTitle: titleUI('RJSF'),
    ssn: {
      ...ssnUI(),
      'ui:title': 'Social security number',
    },
    vaFileNumber: {
      'ui:title': 'VA file number',
      'ui:errorMessages': {
        pattern: 'Your VA file number must be 8 or 9 digits',
      },
    },
    serviceNumber: {
      'ui:title': 'Service number',
    },
    wcTitle: inlineTitleUI('Web component'),
    wcOldSsn: {
      ...ssnNewUI(),
      'ui:options': {
        uswds: false,
      },
    },
    wcOldVaFileNumber: {
      ...vaFileNumberNewUI(),
      'ui:options': {
        uswds: false,
      },
    },
    wcOldServiceNumber: {
      ...serviceNumberNewUI(),
      'ui:options': {
        uswds: false,
      },
    },
    wcv3Title: inlineTitleUI('Web component v3'),
    wcv3SsnNew: v3WCUI.socialSecurityNumber,
    wcv3VaFileNumberNew: v3WCUI.vaFileNumber,
    wcv3ServiceNumberNew: v3WCUI.serviceNumber,
  },
  schema: {
    type: 'object',
    properties: {
      rjsfTitle: titleSchema,
      ssn: {
        $ref: '#/definitions/ssn',
      },
      vaFileNumber: {
        $ref: '#/definitions/vaFileNumber',
      },
      serviceNumber: {
        $ref: '#/definitions/veteranServiceNumber',
      },
      wcTitle: inlineTitleSchema,
      wcOldSsn: ssnNewSchema,
      wcOldVaFileNumber: vaFileNumberNewSchema,
      wcOldServiceNumber: serviceNumberNewSchema,
      wcv3Title: inlineTitleSchema,
      wcv3SsnNew: ssnNewSchema,
      wcv3VaFileNumberNew: vaFileNumberNewSchema,
      wcv3ServiceNumberNew: serviceNumberNewSchema,
    },
    required: ['ssn', 'wcOldSsn', 'wcv3SsnNew'],
  },
  initialData: {},
};
