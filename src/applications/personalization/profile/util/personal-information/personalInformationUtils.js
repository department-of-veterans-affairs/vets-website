import { mapValues } from 'lodash';
import moment from 'moment';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';
import OtherTextField from '@@profile/components/personal-information/OtherTextField';
import { NOT_SET_TEXT } from '../../constants';

const createBooleanSchemaPropertiesFromOptions = obj =>
  mapValues(obj, () => {
    return { type: 'boolean' };
  });

const createUiTitlePropertiesFromOptions = obj => {
  return Object.entries(obj).reduce((accumulator, [key, value]) => {
    accumulator[key] = { 'ui:title': value };
    return accumulator;
  }, {});
};

const deselectOnPreferNotToAnswer = (formData, schema) => {
  if (formData?.preferNotToAnswer === true) {
    Object.keys(formData).forEach(key => {
      // eslint-disable-next-line no-param-reassign
      if (key !== 'preferNotToAnswer') formData[key] = undefined;
    });
  }

  return schema;
};

const genderLabels = {
  woman: 'Woman',
  man: 'Man',
  transgenderWoman: 'Transgender woman',
  transgenderMan: 'Transgender man',
  nonBinary: 'Non-binary',
  preferNotToAnswer: 'Prefer not to answer',
  genderNotListed: 'A gender not listed here',
};

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
      ...createBooleanSchemaPropertiesFromOptions(pronounsLabels),
      ...{
        pronounsNotListedText: {
          type: 'string',
        },
      },
    },
    required: [],
  },
  genderIdentity: {
    type: 'object',
    properties: {
      ...createBooleanSchemaPropertiesFromOptions(genderLabels),
    },
    required: [],
  },

  sexualOrientation: {
    type: 'object',
    properties: {
      ...createBooleanSchemaPropertiesFromOptions(sexualOrientationLabels),
      ...{
        sexualOrientationNotListedText: {
          type: 'string',
        },
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
    ...createUiTitlePropertiesFromOptions(pronounsLabels),
    pronounsNotListedText: {
      'ui:options': {
        hideLabelText: true,
        widget: OtherTextField,
        title:
          'If not listed, please provide your preferred pronouns (255 characters maximum)',
      },
    },
  },
  genderIdentity: {
    'ui:widget': 'checkbox',
    'ui:description': `Select your gender identity`,
    ...createUiTitlePropertiesFromOptions(genderLabels),
    'ui:options': {
      updateSchema: deselectOnPreferNotToAnswer,
    },
  },
  sexualOrientation: {
    'ui:widget': 'checkbox',
    'ui:description': `Select your sexual orientation`,
    ...createUiTitlePropertiesFromOptions(sexualOrientationLabels),
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

export const renderGender = gender => {
  let content = NOT_SET_TEXT;
  if (gender === 'M') content = 'Male';
  else if (gender === 'F') content = 'Female';
  return content;
};

export const renderDOB = dob => (dob ? moment(dob).format('LL') : NOT_SET_TEXT);
