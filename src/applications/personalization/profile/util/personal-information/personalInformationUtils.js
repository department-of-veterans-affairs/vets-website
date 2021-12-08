import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';
import RadioWidget from 'platform/forms-system/src/js/widgets/RadioWidget';

const pronounsLabels = [
  'He/him/his',
  'She/her/hers',
  'They/them/theirs',
  'Ze/zir/zirs',
  'Use my preferred name',
  'Prefer not to answer',
  'Pronouns not listed here',
];
const genderOptions = [
  'woman',
  'man',
  'transgenderWoman',
  'transgenderMan',
  'nonBinary',
  'preferNotToAnswer',
  'genderNotListed',
];
const genderLabels = {
  woman: 'Woman',
  man: 'Man',
  transgenderWoman: 'Transgender woman',
  transgenderMan: 'Transgender man',
  nonBinary: 'Non-binary',
  preferNotToAnswer: 'Prefer not to answer',
  genderNotListed: 'A gender not listed here',
};
const sexualOrientationOptions = [
  'lesBianGayHomosexual',
  'straightOrHeterosexual',
  'bisexual',
  'queer',
  'dontKnow',
  'preferNotToAnswer',
  'sexualOrientationNotListed',
];
const sexualOrientationLabels = {
  lesBianGayHomosexual: 'Lesbian, gay, or homosexual',
  straightOrHeterosexual: 'Straight or heterosexual',
  bisexual: 'Bisexual',
  queer: 'Queer',
  dontKnow: 'Don’t know',
  preferNotToAnswer: 'Prefer not to answer',
  sexualOrientationNotListed: 'A sexual orientation not listed here',
};
export const personalInformationFormSchemas = {
  preferredName: {
    type: 'object',
    properties: {
      preferredName: {
        type: 'string',
        pattern: '^[A-Za-z\\s]+$',
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
        type: 'object',
        properties: {
          'he/him/his': { type: 'boolean' },
          'she/her/hers': { type: 'boolean' },
          'they/them/theirs': { type: 'boolean' },
          'ze/zir/zirs': { type: 'boolean' },
          preferredName: { type: 'boolean' },
          preferNotToAnswer: { type: 'boolean' },
          pronounsNotListed: { type: 'boolean' },
        },
      },
    },
    required: [],
  },
  genderIdentity: {
    type: 'object',
    properties: {
      genderIdentity: {
        type: 'string',
        enum: genderOptions,
      },
    },
    required: [],
  },
  sexualOrientation: {
    type: 'object',
    properties: {
      sexualOrientation: {
        type: 'string',
        enum: sexualOrientationOptions,
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
    'ui:description': 'Select all of your pronouns',
    'ui:widget': 'checkbox',
    'ui:options': {
      labels: {
        'he/him/his': pronounsLabels[0],
        'she/her/hers': pronounsLabels[1],
        'they/them/theirs': pronounsLabels[2],
        'ze/zir/zirs': pronounsLabels[3],
        preferredName: pronounsLabels[4],
        preferNotToAnswer: pronounsLabels[5],
        pronounsNotListed: pronounsLabels[6],
      },
    },
    // 'he/him/his': {
    //   'ui:title': pronounsLabels[0],
    // },
    // 'she/her/hers': {
    //   'ui:title': pronounsLabels[1],
    // },
    // 'they/them/theirs': {
    //   'ui:title': pronounsLabels[2],
    // },
    // 'ze/zir/zirs': {
    //   'ui:title': pronounsLabels[3],
    // },
    // preferredName: {
    //   'ui:title': pronounsLabels[4],
    // },
    // preferNotToAnswer: {
    //   'ui:title': pronounsLabels[5],
    // },
    // pronounsNotListed: {
    //   'ui:title': pronounsLabels[6],
    // },
  },
  genderIdentity: {
    genderIdentity: {
      'ui:widget': RadioWidget,
      'ui:title': `Select your gender identity`,
      'ui:options': {
        labels: genderLabels,
      },
    },
  },
  sexualOrientation: {
    sexualOrientation: {
      'ui:widget': RadioWidget,
      'ui:title': `Select your sexual orientation`,
      'ui:options': {
        labels: sexualOrientationLabels,
      },
    },
  },
};
