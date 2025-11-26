import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
  serviceNumberSchema,
  serviceNumberUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Veteran’s identification information',
      'You must enter a Social Security number or VA file number',
    ),
    veteranSocialSecurityNumber: {
      ...ssnOrVaFileNumberUI(),
      vaFileNumber: {
        ...ssnOrVaFileNumberUI().vaFileNumber,
        'ui:title': 'VA file number',
        'ui:options': {
          ...ssnOrVaFileNumberUI().vaFileNumber['ui:options'],
          hint: '',
        },
      },
    },
    veteranServiceNumber: serviceNumberUI('Service number'),
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber'],
    properties: {
      veteranSocialSecurityNumber: ssnOrVaFileNumberSchema,
      veteranServiceNumber: serviceNumberSchema,
    },
  },
};
