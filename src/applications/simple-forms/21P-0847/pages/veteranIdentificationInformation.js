import {
  dateOfBirthSchema,
  dateOfBirthUI,
  ssnSchema,
  ssnUI,
  titleSchema,
  titleUI,
  vaFileNumberSchema,
  vaFileNumberUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI(
      'Veteran’s information',
      'We need to know information about the original Veteran claimant. In some cases, this Veteran may also be the deceased claimant.',
    ),
    veteranSsn: ssnUI(),
    veteranDateOfBirth: dateOfBirthUI(),
    veteranVaFileNumber: vaFileNumberUI('VA file number'),
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
      veteranSsn: ssnSchema,
      veteranDateOfBirth: dateOfBirthSchema,
      veteranVaFileNumber: vaFileNumberSchema,
    },
    required: ['veteranDateOfBirth', 'veteranSsn'],
  },
};
