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
} from 'platform/forms-system/src/js/web-component-patterns';
import { ssnUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const v3WCUI = ssnOrVaFileNumberOrServiceNumberUI(title => `V3 - ${title}`);

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI('RJSF'),
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
    wc: titleUI('Web component', {
      classNames: 'vads-u-margin-top--4',
    }),
    ssnNew: {
      ...ssnNewUI(),
      'ui:options': {
        uswds: false,
      },
    },
    vaFileNumberNew: {
      ...vaFileNumberNewUI(),
      'ui:options': {
        uswds: false,
      },
    },
    serviceNumberNew: {
      ...serviceNumberNewUI(),
      'ui:options': {
        uswds: false,
      },
    },
    wcv3: titleUI('Web component v3', {
      classNames: 'vads-u-margin-top--4',
    }),
    ssnNewV3: v3WCUI.socialSecurityNumber,
    vaFileNumberNewV3: v3WCUI.vaFileNumber,
    serviceNumberNewV3: v3WCUI.serviceNumber,
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
      ssn: {
        $ref: '#/definitions/ssn',
      },
      vaFileNumber: {
        $ref: '#/definitions/vaFileNumber',
      },
      serviceNumber: {
        $ref: '#/definitions/veteranServiceNumber',
      },
      wc: titleSchema,
      ssnNew: ssnNewSchema,
      vaFileNumberNew: vaFileNumberNewSchema,
      serviceNumberNew: serviceNumberNewSchema,
      wcv3: titleSchema,
      ssnNewV3: ssnNewSchema,
      vaFileNumberNewV3: vaFileNumberNewSchema,
      serviceNumberNewV3: serviceNumberNewSchema,
    },
    required: ['ssn', 'ssnNew', 'ssnNewV3'],
  },
  initialData: {},
};
