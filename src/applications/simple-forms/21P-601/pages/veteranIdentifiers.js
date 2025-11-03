import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI(
      'Veteran’s identification information',
      'You must enter either a Social Security number or a VA file number',
    ),
    veteranIdentification: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranIdentification'],
    properties: {
      veteranIdentification: ssnOrVaFileNumberSchema,
    },
  },
};
