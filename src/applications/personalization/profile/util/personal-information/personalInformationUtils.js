import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';
import SelectWidget from 'platform/forms-system/src/js/widgets/SelectWidget';

const pronouns = [
  'He/him/his',
  'She/her/hers',
  'They/them/theirs',
  'Ze/zir/zirs',
  'Use my preferred name',
  'Prefer not to answer',
  'Pronouns not listed here',
];
const gender = [
  'Woman',
  'Man',
  'Transgender woman',
  'Transgender man',
  'Non-binary',
  'Prefer not to answer',
  'A gender not listed here',
];
const sexualOrientation = [
  'Lesbian, gay, or homosexual',
  'Straight or heterosexual',
  'Bisexual',
  'Queer',
  'Don’t know',
  'Prefer not to answer',
  'A sexual orientation not listed here',
];
export const personalInformationFormSchemas = {
  preferredName: {
    type: 'object',
    properties: {
      preferredName: {
        type: 'string',
        pattern: '/[a-zA-Z]*/g',
        minLength: 1,
        maxLength: 25,
      },
    },
    required: [],
  },
  pronouns: {
    type: 'object',
    properties: {
      pronouns: {
        type: 'string',
        enum: pronouns,
        enumNames: pronouns,
      },
    },
    required: [],
  },
  genderIdentity: {
    type: 'object',
    properties: {
      genderIdentity: {
        type: 'string',
        enum: gender,
        enumNames: gender,
      },
    },
    required: [],
  },
  sexualOrientation: {
    type: 'object',
    properties: {
      sexualOrientation: {
        type: 'string',
        enum: sexualOrientation,
        enumNames: sexualOrientation,
      },
    },
    required: [],
  },
};

export const personalInformationUiSchemas = {
  preferredName: {
    preferredName: {
      'ui:widget': TextWidget,
      'ui:title': `Provide your preferred name (25 characters maximum)`,
      'ui:errorMessages': {
        pattern: 'Preferred name required',
      },
    },
  },
  pronouns: {
    pronouns: {
      'ui:widget': SelectWidget,
      'ui:title': 'Select all of your pronouns',
    },
  },
  genderIdentity: {
    genderIdentity: {
      'ui:widget': SelectWidget,
      'ui:title': `Select your gender identity`,
    },
  },
  sexualOrientation: {
    sexualOrientation: {
      'ui:widget': SelectWidget,
      'ui:title': `Select your sexual orientation`,
    },
  },
};
