import {
  titleUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberNoHintUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Veteran’s or Reservist’s identification information',
      'You must enter either a VA file number or Social Security number.',
    ),
    veteranId: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranId: ssnOrVaFileNumberSchema,
    },
  },
};
