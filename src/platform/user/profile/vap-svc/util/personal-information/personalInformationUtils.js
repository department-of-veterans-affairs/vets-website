import { mapValues } from 'lodash';
import moment from 'moment';

import OtherTextField from '../../components/OtherTextField';
import TextWidget from '../../../../../forms-system/src/js/widgets/TextWidget';
import { NOT_SET_TEXT } from '../../constants';
import DeselectableObjectField from '../../components/DeselectableObjectField';

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

const pronounsLabels = {
  heHimHis: 'He/him/his',
  sheHerHers: 'She/her/hers',
  theyThemTheirs: 'They/them/theirs',
  zeZirZirs: 'Ze/zir/zirs',
  useMyPreferredName: 'Use my preferred name',
};

const genderLabels = {
  M: 'Man',
  B: 'Non-binary',
  TM: 'Transgender man',
  TF: 'Transgender woman',
  F: 'Woman',
  N: 'Prefer not to answer',
  O: 'A gender not listed here',
};

// use the keys from the genderLabels object as the option values
const genderOptions = Object.keys(genderLabels);

const sexualOrientationLabels = {
  lesbianGayHomosexual: 'Lesbian, gay, or homosexual',
  straightOrHeterosexual: 'Straight or heterosexual',
  bisexual: 'Bisexual',
  queer: 'Queer',
  dontKnow: 'Don’t know',
  preferNotToAnswer: 'Prefer not to answer (un-checks other options)',
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
        pattern: '^[A-Za-z]+$',
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
      genderIdentity: {
        type: 'string',
        enum: genderOptions,
      },
    },
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
        pattern: 'This field accepts alphabetic characters only',
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
    genderIdentity: {
      'ui:widget': 'radio',
      'ui:title': `Select your gender identity`,
      'ui:options': {
        labels: genderLabels,
        enumOptions: genderOptions,
      },
    },
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

export const formatIndividualLabel = (key, label) => {
  if (key === 'preferNotToAnswer') {
    return label.replace('(un-checks other options)', '').trim();
  }
  return label;
};

export const formatGenderIdentity = genderData => {
  if (genderData?.code) {
    return genderLabels?.[genderData.code];
  }
  return null;
};

export const formatMultiSelectAndText = (data, fieldName) => {
  const notListedTextKey = `${fieldName}NotListedText`;

  const fieldLength = data?.[fieldName]?.length;

  // handle no checkboxes selected and only a text field value
  if ((!fieldLength || fieldLength < 1) && data[notListedTextKey]) {
    return data[notListedTextKey];
  }

  const mergedValues = [
    ...data[fieldName].map(key =>
      formatIndividualLabel(key, allLabels[fieldName][key]),
    ),
    ...(data?.[notListedTextKey] ? [data[notListedTextKey]] : []),
  ];

  if (mergedValues.length > 0) return mergedValues.join('; ');

  return null;
};

export const renderDOB = dob => (dob ? moment(dob).format('LL') : NOT_SET_TEXT);
