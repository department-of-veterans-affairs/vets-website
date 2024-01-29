import {
  ssnUI as ssnNewUI,
  ssnSchema as ssnNewSchema,
  vaFileNumberSchema as vaFileNumberNewSchema,
  vaFileNumberUI as vaFileNumberNewUI,
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  titleUI,
  inlineTitleUI,
  inlineTitleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ssnUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF'),
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
    'view:wcTitle': inlineTitleUI('Web component'),
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
    'view:wcv3Title': inlineTitleUI('Web component v3'),
    wcv3SsnNew: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      ssn: {
        $ref: '#/definitions/ssn',
      },
      vaFileNumber: {
        $ref: '#/definitions/vaFileNumber',
      },
      'view:wcTitle': inlineTitleSchema,
      wcOldSsn: ssnNewSchema,
      wcOldVaFileNumber: vaFileNumberNewSchema,
      'view:wcv3Title': inlineTitleSchema,
      wcv3SsnNew: ssnOrVaFileNumberSchema,
    },
    required: ['ssn', 'wcOldSsn', 'wcv3SsnNew'],
  },
  initialData: {},
};
