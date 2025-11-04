import {
  fullNameSchema,
  fullNameUI,
  titleUI,
  ssnUI,
  ssnSchema,
  dateOfBirthSchema,
  dateOfBirthUI,
  yesNoSchema,
  yesNoUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { claimantRelationshipOptions } from '../../../utils/labels';
import { seriouslyDisabledDescription } from '../../../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Claimant’s relationship to the Veteran'),
    claimantRelationship: radioUI({
      title: 'What is the claimant’s relationship to the Veteran?',
      labels: claimantRelationshipOptions,
      errorMessages: {
        required: 'Select what your relationship is to the Veteran',
      },
    }),
    seriouslyDisabled: {
      'ui:description': seriouslyDisabledDescription,
    },
    claimantFullName: fullNameUI(),
    claimantSocialSecurityNumber: ssnUI(),
    claimantDateOfBirth: dateOfBirthUI({
      monthSelect: false,
    }),
    claimantIsVeteran: yesNoUI({
      title: 'Is the claimant a Veteran?',
    }),
  },
  schema: {
    type: 'object',
    required: [
      'claimantRelationship',
      'claimantFullName',
      'claimantSocialSecurityNumber',
      'claimantIsVeteran',
      'claimantDateOfBirth',
    ],
    properties: {
      claimantRelationship: radioSchema(
        Object.keys(claimantRelationshipOptions),
      ),
      seriouslyDisabled: {
        type: 'object',
        properties: {},
      },
      claimantFullName: fullNameSchema,
      claimantSocialSecurityNumber: ssnSchema,
      claimantDateOfBirth: dateOfBirthSchema,
      claimantIsVeteran: yesNoSchema,
    },
  },
};
