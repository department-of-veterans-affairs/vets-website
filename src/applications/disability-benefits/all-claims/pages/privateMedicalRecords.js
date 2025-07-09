// import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  privateRecordsChoiceHelp,
  // patientAcknowledgmentTitle,
  // patientAcknowledgmentText,
  // patientAcknowledgmentError,
} from '../content/privateMedicalRecords';
import { standardTitle } from '../content/form0781';

// const isNotUploadingPrivateRecords = data =>
//   data?.['view:hasPrivateRecordsToUpload'] === false;

export const uiSchema = {
  'ui:title': standardTitle('Private medical records'),
  'ui:description':
    'Now we’ll ask you about your private medical records for your condition.',
  'view:uploadPrivateRecordsQualifier': {
    'view:hasPrivateRecordsToUpload': yesNoUI({
      title: 'Do you want to upload your private medical records?',
      labels: {
        Y: 'Yes',
        N: 'No, please get my records from my provider.',
      },
    }),
    'view:privateRecordsChoiceHelp': {
      'ui:description': privateRecordsChoiceHelp,
    },
  },
  // 'view:patientAcknowledgement': {
  //   'ui:title': patientAcknowledgmentTitle,
  //   'ui:options': {
  //     expandUnder: 'view:uploadPrivateRecordsQualifier',
  //     expandUnderCondition: isNotUploadingPrivateRecords,
  //     showFieldLabel: true,
  //   },
  //   'ui:validations': [
  //     (errors, fieldData, formData) => {
  //       const shouldValidate =
  //         formData?.['view:uploadPrivateRecordsQualifier']?.[
  //           'view:hasPrivateRecordsToUpload'
  //         ] === false;

  //       if (shouldValidate) {
  //         return validateBooleanGroup(errors, fieldData, null, null, {
  //           atLeastOne: patientAcknowledgmentError,
  //         });
  //       }

  //       return errors;
  //     },
  //   ],
  // },
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
  },
};
