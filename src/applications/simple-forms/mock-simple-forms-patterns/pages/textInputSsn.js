import {
  ssnUI,
  ssnSchema,
  vaFileNumberSchema,
  vaFileNumberUI,
  serviceNumberUI,
  serviceNumberSchema,
} from 'platform/forms-system/src/js/web-component-schemas';

export default {
  uiSchema: {
    ssn: ssnUI(),
    vaFileNumber: vaFileNumberUI(),
    serviceNumber: serviceNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      ssn: ssnSchema(),
      vaFileNumber: vaFileNumberSchema(),
      serviceNumber: serviceNumberSchema(),
    },
    required: ['ssn'],
  },
  initialData: {},
};
