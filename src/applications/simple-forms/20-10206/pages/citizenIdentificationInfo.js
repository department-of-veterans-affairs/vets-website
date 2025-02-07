import {
  titleUI,
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI({
      title: 'Identification information',
      description:
        'You must enter either a Social Security number or VA File number',
      headerLevel: 3,
    }),
    citizenId: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      citizenId: ssnOrVaFileNumberNoHintSchema,
    },
  },
};
