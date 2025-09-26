import {
  titleUI,
  ssnUI,
  ssnSchema,
  fullNameUI,
  fullNameSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('About the veteran'),
    veteranFullName: fullNameUI(),
    veteranSsn: ssnUI("Veteran's Social Security number"),
    veteranVaFileNumber: vaFileNumberUI(
      "Veteran's VA file number (if different from SSN)",
    ),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName', 'veteranSsn'],
    properties: {
      veteranFullName: fullNameSchema,
      veteranSsn: ssnSchema,
      veteranVaFileNumber: vaFileNumberSchema,
    },
  },
};
