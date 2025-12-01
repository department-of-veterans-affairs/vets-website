// @ts-check
import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI({
      title: 'Your identification information',
      description:
        'You must enter either a Social Security number or VA file number',
    }),
    idNumber: ssnOrVaFileNumberNoHintUI(),
    serviceNumber: serviceNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      idNumber: ssnOrVaFileNumberNoHintSchema,
      serviceNumber: serviceNumberSchema,
    },
  },
};
