import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  privateRecordsChoiceHelp,
  patientAcknowledgmentTitle,
  patientAcknowledgmentText,
  patientAcknowledgmentError,
  recordsConfirmAlertBanner,
} from '../content/privateMedicalRecords';
import { standardTitle } from '../content/form0781';
import { isCompletingModern4142, needs4142AlertShown } from '../utils';

const isNotUploadingPrivateRecords = data =>
  data?.['view:hasPrivateRecordsToUpload'] === false;

export const uiSchema = {
  'view:recordsConfirmAlertBanner': {
    'ui:description': recordsConfirmAlertBanner,
    'ui:options': {
      hideIf: formData => !needs4142AlertShown(formData),
    },
  },
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
  'view:patientAcknowledgement': {
    'ui:title': patientAcknowledgmentTitle,
    'ui:options': {
      expandUnder: 'view:uploadPrivateRecordsQualifier',
      expandUnderCondition: isNotUploadingPrivateRecords,
      showFieldLabel: true,
      hideIf: formData => isCompletingModern4142(formData),
      preserveHiddenData: true,
    },
    'ui:required': formData => !isCompletingModern4142(formData),
    'ui:validations': [
      (errors, fieldData, formData) => {
        const shouldValidate =
          formData?.['view:uploadPrivateRecordsQualifier']?.[
            'view:hasPrivateRecordsToUpload'
          ] === false && !isCompletingModern4142(formData);

        if (shouldValidate) {
          return validateBooleanGroup(errors, fieldData, null, null, {
            atLeastOne: patientAcknowledgmentError,
          });
        }

        return errors;
      },
    ],
    'view:acknowledgement': {
      'ui:title': 'I acknowledge and authorize this release of information',
      'ui:options': {
        useDlWrap: true,
        preserveHiddenData: true,
      },
    },
  },
  'view:patientAcknowledgmentHelp': {
    'ui:description': patientAcknowledgmentText,
    'ui:options': {
      expandUnder: 'view:uploadPrivateRecordsQualifier',
      expandUnderCondition: isNotUploadingPrivateRecords,
      forceDivWrapper: true,
      hideIf: formData => isCompletingModern4142(formData),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:recordsConfirmAlertBanner': {
      type: 'object',
      properties: {},
    },
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
          default: false,
        },
      },
    },
    'view:patientAcknowledgmentHelp': {
      type: 'object',
      properties: {},
    },
  },
};
