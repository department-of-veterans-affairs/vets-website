import { mapValues } from 'lodash';
import { format } from 'date-fns';

import OtherTextField from '../../components/OtherTextField';
import TextWidget from '../../../../../forms-system/src/js/widgets/TextWidget';
import { NOT_SET_TEXT } from '../../constants';
import DeselectableObjectField from '../../components/DeselectableObjectField';
import { parseStringOrDate } from '../../../../../utilities/date';
import { MessagingSignatureDescription } from './MessagingSignatureDescription';

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

const signatureErrorMessage = 'Both fields are required to save a signature.';

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
  messagingSignature: {
    type: 'object',
    properties: {
      signatureName: {
        type: 'string',
        pattern: /^(?!\s*$).+/,
        maxLength: 60,
      },
      signatureTitle: {
        type: 'string',
        pattern: /^(?!\s*$).+/,
        maxLength: 60,
      },
    },
    required: ['signatureName', 'signatureTitle'],
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
  messagingSignature: {
    'ui:description': MessagingSignatureDescription,
    signatureName: {
      'ui:widget': TextWidget,
      'ui:title': `Signature name (60 characters maximum)`,
      'ui:errorMessages': {
        required: signatureErrorMessage,
        pattern: signatureErrorMessage,
      },
    },
    signatureTitle: {
      'ui:widget': TextWidget,
      'ui:title': `Signature title (60 characters maximum)`,
      'ui:errorMessages': {
        required: signatureErrorMessage,
        pattern: signatureErrorMessage,
      },
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

export const renderDOB = dob =>
  dob ? format(parseStringOrDate(dob), 'MMMM d, yyyy') : NOT_SET_TEXT;
