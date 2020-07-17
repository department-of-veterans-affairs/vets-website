import {
  privateRecordsChoiceHelp,
  patientAcknowledgmentText,
} from '../content/privateMedicalRecords';
import { UploadDescription } from '../content/fileUploadDescriptions';
import _ from 'platform/utilities/data';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { ancillaryFormUploadUi } from '../utils';
import { DATA_PATHS } from '../constants';

const { privateMedicalRecordAttachments } = fullSchema.properties;

const fileUploadUi = ancillaryFormUploadUi(
  'to your private medical records',
  ' ',
  {
    attachmentId: '',
    addAnotherLabel: 'Add another document',
  },
);

export const uiSchema = {
  'ui:description':
    'Now we’ll ask you about your private medical records for your claimed disability.',
  'view:aboutPrivateMedicalRecords': {
    'ui:title': 'About private medical records',
    'ui:description': `If you have your private medical records, you can upload them to your
      application. If you want us to get them for you, you’ll need to
      authorize their release.`,
  },
  'view:uploadPrivateRecordsQualifier': {
    'view:hasPrivateRecordsToUpload': {
      'ui:title': 'Do you want to upload your private medical records?',
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          Y: 'Yes',
          N: 'No, please get my records from my doctor.',
        },
        // Force ReviewFieldTemplate to wrap this component in a <dl>
        useDlWrap: true,
      },
    },
    'view:privateRecordsChoiceHelp': {
      'ui:description': privateRecordsChoiceHelp,
    },
  },
  privateMedicalRecordAttachments: {
    ...fileUploadUi,
    'ui:options': {
      ...fileUploadUi['ui:options'],
      expandUnder: 'view:uploadPrivateRecordsQualifier',
      expandUnderCondition: data =>
        _.get('view:hasPrivateRecordsToUpload', data, false),
    },
    'ui:description': UploadDescription,
    'ui:required': data =>
      _.get(DATA_PATHS.hasPrivateRecordsToUpload, data, false),
  },
  'view:patientAcknowledgement': {
    'ui:title': ' ',
    'ui:help': patientAcknowledgmentText,
    'ui:options': {
      expandUnder: 'view:uploadPrivateRecordsQualifier',
      expandUnderCondition: data =>
        _.get('view:hasPrivateRecordsToUpload', data, true) === false,
      showFieldLabel: true,
    },
    'view:acknowledgement': {
      'ui:title': 'Patient Acknowledgment',
    },
    'ui:validations': [
      (errors, item) => {
        if (!item['view:acknowledgement']) {
          errors.addError('You must accept the acknowledgement');
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
        'view:hasPrivateRecordsToUpload': {
          type: 'boolean',
        },
        'view:privateRecordsChoiceHelp': {
          type: 'object',
          properties: {},
        },
      },
    },
    privateMedicalRecordAttachments,
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
      },
    },
  },
};
