import {
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
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
    veteranSocialSecurityNumber: ssnOrVaFileNumberNoHintUI(),
    veteranServiceNumber: serviceNumberUI('Service number'),
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber'],
    properties: {
      veteranSocialSecurityNumber: ssnOrVaFileNumberNoHintSchema,
      veteranServiceNumber: serviceNumberSchema,
    },
  },
};
