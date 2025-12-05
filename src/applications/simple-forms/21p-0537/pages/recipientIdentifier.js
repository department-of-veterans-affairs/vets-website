import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const veteranIdUI = ssnOrVaFileNumberNoHintUI();

export default {
  uiSchema: {
    ...titleUI("Deceased Veteran's identification information"),
    'ui:description':
      "You must enter either the deceased Veteran's VA file number or Social Security number. We'll use this information to locate their records in our system. You can find them on your original DIC award letter or previous VA communications.",
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
