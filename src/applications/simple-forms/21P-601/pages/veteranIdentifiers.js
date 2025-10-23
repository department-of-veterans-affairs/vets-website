import {
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const veteranIdUI = ssnOrVaFileNumberUI();
veteranIdUI.ssn['ui:title'] = "Veteran's Social Security number";
veteranIdUI.vaFileNumber['ui:title'] = "Veteran's VA file number";

export default {
  uiSchema: {
    ...titleUI('Veteran identification'),
    'ui:description':
      "We need the Veteran's Social Security number or VA file number to locate their records in our system.",
    veteranIdentification: veteranIdUI,
  },
  schema: {
    type: 'object',
    required: ['veteranIdentification'],
    properties: {
      veteranIdentification: ssnOrVaFileNumberSchema,
    },
  },
};
