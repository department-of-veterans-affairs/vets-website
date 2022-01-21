import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';
import RadioWidget from 'platform/forms-system/src/js/widgets/RadioWidget';
import OtherTextField from '@@profile/components/personal-information/OtherTextField';

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
  'lesbianGayHomosexual',
  'straightOrHeterosexual',
  'bisexual',
  'queer',
  'dontKnow',
  'preferNotToAnswer',
  'sexualOrientationNotListed',
];
const sexualOrientationLabels = {
  lesbianGayHomosexual: 'Lesbian, gay, or homosexual',
  straightOrHeterosexual: 'Straight or heterosexual',
  bisexual: 'Bisexual',
  queer: 'Queer',
  dontKnow: 'Don’t know',
  preferNotToAnswer: 'Prefer not to answer',
  sexualOrientationNotListed: 'A sexual orientation not listed here',
};

const pronounsLabels = {
  heHimHis: 'He/him/his',
  sheHerHers: 'She/her/hers',
  theyThemTheirs: 'They/them/theirs',
  zeZirZirs: 'Ze/zir/zirs',
  useMyPreferredName: 'Use my preferred name',
  preferNotToAnswer: 'Prefer not to answer',
  pronounsNotListed: 'Pronouns not listed here',
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
      heHimHis: { type: 'boolean' },
      sheHerHers: { type: 'boolean' },
      theyThemTheirs: { type: 'boolean' },
      zeZirZirs: { type: 'boolean' },
      useMyPreferredName: { type: 'boolean' },
      preferNotToAnswer: { type: 'boolean' },
      pronounsNotListed: { type: 'boolean' },
      pronounsNotListedText: {
        type: 'string',
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
      sexualOrientationNotListedText: {
        type: 'string',
      },
    },

    required: [],
  },
};

export const personalInformationUiSchemas = {
  preferredName: {
    preferredName: {
      'ui:widget': TextWidget,
      'ui:title': `Provide your preferred name (100 characters maximum)`,
      'ui:errorMessages': {
        pattern: 'Preferred name required',
      },
    },
  },
  pronouns: {
    'ui:description': 'Select all of your pronouns',
    'ui:widget': 'checkbox',
    heHimHis: { 'ui:title': 'He/him/his' },
    sheHerHers: { 'ui:title': 'She/her/hers' },
    theyThemTheirs: { 'ui:title': 'They/them/theirs' },
    zeZirZirs: { 'ui:title': 'Ze/zir/zirs' },
    useMyPreferredName: { 'ui:title': 'Use my preferred name' },
    preferNotToAnswer: { 'ui:title': 'Prefer not to answer' },
    pronounsNotListed: {
      'ui:title': 'Pronouns not listed here',
    },
    pronounsNotListedText: {
      'ui:options': {
        widgetClassNames: 'my-class-here',
        hideLabelText: true,
        widget: OtherTextField,
        title:
          'If not listed, please provide your preferred pronouns (255 characters maximum)',
      },
    },
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
    sexualOrientationNotListedText: {
      'ui:title':
        'If not listed, please provide your sexual orientation (255 characters maximum)',
    },
  },
};

export const formatPronouns = (pronounValues, pronounsNotListedText = '') => {
  if (pronounValues.includes('pronounsNotListed') && !pronounsNotListedText) {
    throw new Error(
      'pronounsNotListedText must be provided if pronounsNotListed is in selected pronouns array',
    );
  }

  if (pronounValues.length === 1) {
    return pronounValues.includes('pronounsNotListed')
      ? pronounsNotListedText
      : pronounsLabels[pronounValues[0]];
  }

  return pronounValues
    .map(pronounKey => {
      return pronounKey === 'pronounsNotListed'
        ? pronounsNotListedText
        : pronounsLabels[pronounKey];
    })
    .join(', ');
};

export const formatGenderIdentity = genderKey => genderLabels?.[genderKey];

export const formatSexualOrientation = (
  sexualOrientationKey,
  sexualOrientationNotListedText = '',
) => {
  if (
    sexualOrientationKey === 'sexualOrientationNotListed' &&
    !sexualOrientationNotListedText
  ) {
    throw new Error(
      'sexualOrientationNotListedText must be provided if sexualOrientationNotListed is selected',
    );
  }

  if (sexualOrientationKey !== 'sexualOrientationNotListed') {
    return sexualOrientationLabels[sexualOrientationKey];
  }
  return sexualOrientationNotListedText;
};
