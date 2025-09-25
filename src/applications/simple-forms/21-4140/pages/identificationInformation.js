// @ts-check
import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your identification information'),
    ssn: ssnUI(),
    vaFileNumber: vaFileNumberUI(),
    serviceNumber: serviceNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      ssn: ssnSchema,
      vaFileNumber: vaFileNumberSchema,
      serviceNumber: serviceNumberSchema,
    },
    required: ['ssn'],
  },
};
