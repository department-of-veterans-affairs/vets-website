import {
  dateOfBirthSchema,
  dateOfBirthUI,
  ssnSchema,
  ssnUI,
  titleUI,
  vaFileNumberSchema,
  vaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Veteran’s information',
      'We need to know information about the Veteran whose benefits you’re connected to. In some cases, this Veteran may also be the deceased claimant.',
    ),
    veteranSsn: ssnUI(),
    veteranDateOfBirth: dateOfBirthUI(),
    veteranVaFileNumber: vaFileNumberUI('VA file number'),
  },
  schema: {
    type: 'object',
    properties: {
      veteranSsn: ssnSchema,
      veteranDateOfBirth: dateOfBirthSchema,
      veteranVaFileNumber: vaFileNumberSchema,
    },
    required: ['veteranDateOfBirth', 'veteranSsn'],
  },
};
