// @ts-check
import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const ssnOrVaFileNumberNoHintUISchema = ssnOrVaFileNumberNoHintUI();
ssnOrVaFileNumberNoHintUISchema.ssn = {
  ...ssnOrVaFileNumberNoHintUISchema.ssn,
  'ui:errorMessages': {
    ...ssnOrVaFileNumberNoHintUISchema.ssn['ui:errorMessages'],
    required: 'Please enter your Social Security number or VA file number',
  },
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI({
      title: 'Your identification information',
      description:
        'You must enter either a Social Security number or VA file number',
    }),
    idNumber: ssnOrVaFileNumberNoHintUISchema,
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
