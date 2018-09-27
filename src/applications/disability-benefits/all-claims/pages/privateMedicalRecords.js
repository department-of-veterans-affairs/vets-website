import { privateRecordsChoiceHelp } from '../content/privateMedicalRecords';

export const uiSchema = {
  'ui:description':
    'Now we’ll ask you about your private medical records for your claimed disability.',
  'view:aboutPrivateMedicalRecords': {
    'ui:title': 'About private medical records',
    'ui:description':
      `If you have your private medical records, you can upload them to your 
      application. If you want us to get them for you, you’ll need to 
      authorize their release.`
  },
  'view:uploadPrivateMedicalRecords': {
    'ui:title': 'Do you want to upload your private medical records?',
    'ui:widget': 'yesNo',
    'ui:options': {
      labels: {
        Y: 'Yes',
        N: 'No, my doctor has my medical records.'
      }
    }
  },
  'view:privateRecordsChoiceHelp': {
    'ui:description': privateRecordsChoiceHelp
  }
};

export const schema = {
  type: 'object',
  required: ['view:uploadPrivateMedicalRecords'],
  properties: {
    'view:aboutPrivateMedicalRecords': {
      type: 'object',
      properties: {}
    },
    'view:uploadPrivateMedicalRecords': {
      type: 'boolean'
    },
    'view:privateRecordsChoiceHelp': {
      type: 'object',
      properties: {}
    }
  }
};
