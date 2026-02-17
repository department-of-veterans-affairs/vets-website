import {
  titleUI,
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Identification information',
      'You must enter a Social Security number or VA file number.',
    ),
    wcv3SsnNew: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3SsnNew: ssnOrVaFileNumberNoHintSchema,
    },
    required: ['wcv3SsnNew'],
  },
  initialData: {},
};
