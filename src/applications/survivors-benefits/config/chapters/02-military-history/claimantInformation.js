import {
  fullNameSchema,
  titleUI,
  ssnUI,
  ssnSchema,
  dateOfBirthSchema,
  dateOfBirthUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { seriouslyDisabledDescription } from '../../../components/formDescriptons/index';
import { benefitsIntakeFullNameUI } from './helpers';

/** @type {PageSchema} */
export default {
  title: 'Claimant information',
  path: 'claimant/information',
  uiSchema: {
    ...titleUI('Claimant information'),
    claimantRelationship: {
      'ui:title': 'What is your relationship to the Veteran?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          SPOUSE: 'Surviving spouse',
          CUSTODIAN: 'Custodian filing for child under 18',
          ADULT_CHILD_STILL_IN_SCHOOL:
            'Adult child who is 18-23 and still in school',
          ADULT_CHILD_SERIOUSLY_DISABLED:
            'Adult child who is seriously disabled',
        },
      },
      'ui:errorMessages': {
        required: 'Select what your relationship is to the Veteran',
      },
    },
    seriouslyDisabled: {
      'ui:description': seriouslyDisabledDescription,
    },
    claimantFullName: benefitsIntakeFullNameUI(),
    claimantSocialSecurityNumber: ssnUI(),
    claimantDateOfBirth: dateOfBirthUI({
      monthSelect: false,
    }),
    claimantIsVeteran: yesNoUI({
      title: 'Are you the Veteran?',
    }),
  },
  schema: {
    type: 'object',
    required: [
      'claimantRelationship',
      'claimantFullName',
      'claimantSocialSecurityNumber',
      'claimantIsVeteran',
    ],
    properties: {
      claimantRelationship: {
        type: 'string',
        enum: [
          'SPOUSE',
          'CUSTODIAN',
          'ADULT_CHILD_STILL_IN_SCHOOL',
          'ADULT_CHILD_SERIOUSLY_DISABLED',
        ],
      },
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
