import {
  privateRecordsChoiceHelp,
  patientAcknowledgmentText,
} from '../content/privateMedicalRecords';
import { uploadDescription } from '../content/fileUploadDescriptions';
import fileUploadUI from 'us-forms-system/lib/js/definitions/file';
import environment from '../../../../platform/utilities/environment';
import _ from '../../../../platform/utilities/data';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { FIFTY_MB, DATA_PATHS } from '../constants';

const { attachments } = fullSchema.properties;

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
      },
    },
    'view:privateRecordsChoiceHelp': {
      'ui:description': privateRecordsChoiceHelp,
    },
  },
  privateMedicalRecords: Object.assign(
    {},
    fileUploadUI('Upload your private medical records', {
      buttonText: 'Upload Document',
      fileTypes: [
        'pdf',
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'tif',
        'tiff',
        'txt',
      ],
      expandUnder: 'view:uploadPrivateRecordsQualifier',
      expandUnderCondition: data =>
        _.get('view:hasPrivateRecordsToUpload', data, false),
      // TODO: This is the URL for Increase, check that it’s correct
      fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
      addAnotherLabel: 'Add Another Document',
      maxSize: FIFTY_MB,
      createPayload: file => {
        const payload = new FormData();
        payload.append('supporting_evidence_attachment[file_data]', file);
        return payload;
      },
      parseResponse: (response, file) => ({
        name: file.name,
        confirmationCode: response.data.attributes.guid,
      }),
      // this is the uiSchema passed to FileField for the attachmentId schema
      // FileField requires this name be used
      attachmentSchema: { 'ui:title': 'Document type' },
      // this is the uiSchema passed to FileField for the name schema
      // FileField requires this name be used
      attachmentName: { 'ui:title': 'Document name' },
    }),
    {
      'ui:description': uploadDescription,
      'ui:required': data =>
        _.get(DATA_PATHS.hasPrivateRecordsToUpload, data, false),
    },
  ),
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
      'ui:title': 'Patient Acknowledgement',
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
    privateMedicalRecords: attachments,
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
