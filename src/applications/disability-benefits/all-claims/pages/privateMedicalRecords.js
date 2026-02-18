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
  authorizationNotes,
  privateRecordsChoiceHelpTitle,
} from '../content/privateMedicalRecords';
import { standardTitle } from '../content/form0781';
import { isCompletingModern4142 } from '../utils';

const isNotUploadingPrivateRecords = data =>
  data?.['view:hasPrivateRecordsToUpload'] === false;

export const uiSchema = {
  'ui:title': standardTitle('Options for providing non-VA treatment records'),
  'view:recordsConfirmAlertBanner': {
    'ui:description': recordsConfirmAlertBanner,
  },
  'view:uploadPrivateRecordsQualifier': {
    'view:hasPrivateRecordsToUpload': yesNoUI({
      title: 'Do you want to upload your private medical records?',
      labels: {
        Y: 'Yes, I’ll upload my non-VA treatment records',
        N: 'No, get my non-VA treatment records from my providers',
      },
    }),
    'view:AuthorizationNotes': {
      'ui:description': authorizationNotes,
    },
    'view:privateRecordsChoiceHelp': {
      'ui:title': privateRecordsChoiceHelpTitle,
      'ui:description': privateRecordsChoiceHelp,
    },
  },

  'view:patientAcknowledgement': {
    'ui:title': patientAcknowledgmentTitle,
    'ui:options': {
      expandUnder: 'view:uploadPrivateRecordsQualifier',
      expandUnderCondition: isNotUploadingPrivateRecords,
      showFieldLabel: true,
      preserveHiddenData: true,
      hideIf: formData => isCompletingModern4142(formData),
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
        'view:AuthorizationNotes': {
          type: 'object',
          properties: {},
        },
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
