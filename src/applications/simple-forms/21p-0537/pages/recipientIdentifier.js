import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Deceased veteran identification'),
    'ui:description':
      "We need the deceased veteran's Social Security number or VA file number to locate their records in our system. You can find this information on your original DIC award letter or previous VA correspondence.",
    veteranSocialSecurityNumber: ssnUI(
      "Deceased veteran's Social Security number",
    ),
    vaFileNumber: {
      ...vaFileNumberUI("Deceased veteran's VA file number"),
      'ui:description':
        "Enter this number only if it's different than their Social Security number",
    },
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber'],
    properties: {
      veteranSocialSecurityNumber: ssnSchema,
      vaFileNumber: vaFileNumberSchema,
    },
  },
};
