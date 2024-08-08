import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  privateRecordsChoiceHelp,
  patientAcknowledgmentTitle,
  patientAcknowledgmentText,
} from '../content/privateMedicalRecords';

export const uiSchema = {
  'ui:description':
    'Now we’ll ask you about your private medical records for your condition.',
  'view:aboutPrivateMedicalRecords': {
    'ui:title': 'About private medical records',
    'ui:description': `If you have your private medical records, you can upload them to your
      application. If you want us to get them for you, you’ll need to
      authorize their release.`,
  },
  'view:uploadPrivateRecordsQualifier': {
    'view:hasPrivateRecordsToUpload': yesNoUI({
      title: 'Do you want to upload your private medical records?',
      labels: {
        Y: 'Yes',
        N: 'No, please get my records from my doctor.',
      },
    }),
    'view:privateRecordsChoiceHelp': {
      'ui:description': privateRecordsChoiceHelp,
    },
  },
  'view:patientAcknowledgement': {
    'ui:title': patientAcknowledgmentTitle,
    'ui:options': {
      expandUnder: 'view:uploadPrivateRecordsQualifier',
      expandUnderCondition: data =>
        data?.['view:hasPrivateRecordsToUpload'] === false,
      showFieldLabel: false,
      // forceDivWrapper: true,
    },
    'view:acknowledgement': {
      'ui:title': 'I acknowledge and authorize this release of information',
      'ui:webComponentField': VaCheckboxField,
      'ui:options': {
        useDlWrap: true,
      },
    },
    'view:helpText': {
      'ui:title': ' ',
      'ui:description': patientAcknowledgmentText,
      'ui:options': {
        forceDivWrapper: true,
      },
    },
    'ui:validations': [
      (errors, item) => {
        if (!item['view:acknowledgement']) {
          errors.addError('You must accept the acknowledgment');
        }
      },
    ],
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:uploadPrivateRecordsQualifier': {
      required: ['view:hasPrivateRecordsToUpload'],
      type: 'object',
      properties: {
        'view:aboutPrivateMedicalRecords': {
          type: 'object',
          properties: {},
        },
        'view:hasPrivateRecordsToUpload': yesNoSchema,
        'view:privateRecordsChoiceHelp': {
          type: 'object',
          properties: {},
        },
      },
    },
    // Note: this property is misspelled. Should be
    // `view:patientAcknowledgment` but isn't worth writing a migration for at
    // this time since it's only used on this page.
    'view:patientAcknowledgement': {
      type: 'object',
      required: ['view:acknowledgement'],
      properties: {
        'view:acknowledgement': {
          type: 'boolean',
          default: true,
        },
        'view:helpText': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
