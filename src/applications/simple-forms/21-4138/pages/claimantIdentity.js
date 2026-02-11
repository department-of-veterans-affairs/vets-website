import {
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns/titlePattern';

const IDENTITY_DESCRIPTION =
  'This helps us understand your relationship to the person you are filling out this form for (called the "claimant"). The claimant is the person who is claiming the VA benefit or service.';

const CLAIMANT_TYPES = {
  SELF: 'self',
  FOR_VETERAN: 'forVeteran',
  ANOTHER_VETERAN: 'anotherVeteran',
  FAMILY_MEMBER: 'familyMember',
  FAMILY_MEMBER_OTHER_VETERAN: 'familyMemberOtherVeteran',
};

const VETERAN_IDENTITY_OPTIONS = {
  [CLAIMANT_TYPES.SELF]: "I'm filling out this form for myself",
  [CLAIMANT_TYPES.ANOTHER_VETERAN]:
    "I'm filling out this form for another Veteran",
  [CLAIMANT_TYPES.FAMILY_MEMBER]:
    "I'm filling out this form for my family member",
  [CLAIMANT_TYPES.FAMILY_MEMBER_OTHER_VETERAN]:
    "I'm filling out this form for a family member of another Veteran",
};

const NON_VETERAN_IDENTITY_OPTIONS = {
  [CLAIMANT_TYPES.SELF]:
    "I'm a Veteran filling out this form based on my own status",
  [CLAIMANT_TYPES.FOR_VETERAN]: "I'm filling out this form for a Veteran",
};

const isUserVeteran = formData => formData?.['view:userIsVeteran'] === true;

const getIdentityOptions = formData =>
  isUserVeteran(formData)
    ? VETERAN_IDENTITY_OPTIONS
    : NON_VETERAN_IDENTITY_OPTIONS;

const getIdentityTitle = formData =>
  isUserVeteran(formData)
    ? "Our records show that you're a Veteran. Who are you filling out this form for?"
    : 'Which of these best describes you?';

/** @type {PageSchema} */
export const claimantIdentityPage = {
  uiSchema: {
    ...titleUI({ title: 'Your identity', headerLevel: 1 }),
    claimantType: radioUI({
      labels: VETERAN_IDENTITY_OPTIONS,
      labelHeaderLevel: '3',
      labelHeaderLevelStyle: '3',
      errorMessages: {
        required: 'Select the option that best describes you',
      },
      updateUiSchema: formData => ({
        'ui:title': getIdentityTitle(formData),
        'ui:description': IDENTITY_DESCRIPTION,
        'ui:options': {
          labels: getIdentityOptions(formData),
        },
      }),
      updateSchema: formData => ({
        enum: Object.keys(getIdentityOptions(formData)),
      }),
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantType'],
    properties: {
      claimantType: radioSchema(Object.values(CLAIMANT_TYPES)),
    },
  },
};
