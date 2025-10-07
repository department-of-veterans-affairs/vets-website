import {
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const veteranIdUI = ssnOrVaFileNumberUI();
veteranIdUI.ssn['ui:title'] = "Deceased Veteran's Social Security number";
veteranIdUI.vaFileNumber['ui:title'] = "Deceased Veteran's VA file number";

export default {
  uiSchema: {
    ...titleUI('Deceased Veteran identification'),
    'ui:description':
      "We need the deceased Veteran's Social Security number or VA file number to locate their records in our system. You can find this information on your original DIC award letter or previous VA correspondence.",
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
