import { mapValues } from 'lodash';
import moment from 'moment';

import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';
import OtherTextField from '@@profile/components/personal-information/OtherTextField';
import { NOT_SET_TEXT } from '../../constants';
import DeselectableObjectField from '../../components/personal-information/DeselectableObjectField';

export const notListedKeySuffix = 'NotListedText';

export const createNotListedTextKey = fieldName =>
  `${fieldName}${notListedKeySuffix}`;

export const createBooleanSchemaPropertiesFromOptions = obj =>
  mapValues(obj, () => {
    return { type: 'boolean' };
  });

export const createUiTitlePropertiesFromOptions = obj => {
  return Object.entries(obj).reduce((accumulator, [key, value]) => {
    accumulator[key] = { 'ui:title': value };
    return accumulator;
  }, {});
};

const genderLabels = {
  woman: 'Woman',
  man: 'Man',
  transgenderWoman: 'Transgender woman',
  transgenderMan: 'Transgender man',
  nonBinary: 'Non-binary',
  preferNotToAnswer: 'Prefer not to answer (un-checks other options)',
  genderNotListed: 'A gender not listed here',
};

const sexualOrientationLabels = {
  lesbianGayHomosexual: 'Lesbian, gay, or homosexual',
  straightOrHeterosexual: 'Straight or heterosexual',
  bisexual: 'Bisexual',
  queer: 'Queer',
  dontKnow: 'Don’t know',
  preferNotToAnswer: 'Prefer not to answer (un-checks other options)',
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

const allLabels = {
  pronouns: pronounsLabels,
  genderIdentity: genderLabels,
  sexualOrientation: sexualOrientationLabels,
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
    'ui:field': DeselectableObjectField,
    'ui:description': `Select your gender identity`,
    ...createUiTitlePropertiesFromOptions(genderLabels),
  },
  sexualOrientation: {
    'ui:field': DeselectableObjectField,
    'ui:widget': 'checkbox',
    'ui:description': `Select your sexual orientation`,
    ...createUiTitlePropertiesFromOptions(sexualOrientationLabels),
    sexualOrientationNotListedText: {
      'ui:title':
        'If not listed, please provide your sexual orientation (255 characters maximum)',
    },
  },
};

export const formatMultiSelectAndText = (data, fieldName) => {
  const notListedTextKey = `${fieldName}NotListedText`;

  const fieldLength = data?.[fieldName]?.length;

  // handle no checkboxes selected and only a text field value
  if ((!fieldLength || fieldLength < 1) && data[notListedTextKey]) {
    return data[notListedTextKey];
  }

  const mergedValues = [
    ...data[fieldName].map(key => allLabels[fieldName][key]),
    ...(data?.[notListedTextKey] ? [data[notListedTextKey]] : []),
  ];

  if (mergedValues.length > 0) return mergedValues.join(', ');

  return null;
};

export const renderGender = gender => {
  let content = NOT_SET_TEXT;
  if (gender === 'M') content = 'Male';
  else if (gender === 'F') content = 'Female';
  return content;
};

export const renderDOB = dob => (dob ? moment(dob).format('LL') : NOT_SET_TEXT);
