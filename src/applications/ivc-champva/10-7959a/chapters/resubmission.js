import {
  descriptionUI,
  selectSchema,
  selectUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validFieldCharsOnly } from '../../shared/validations';
import ClaimIdentificationInfo from '../components/FormDescriptions/ClaimIdentificationInfo';
import FileUploadDescription from '../components/FormDescriptions/FileUploadDescription';
import {
  ResubmissionDocsDescription,
  ResubmissionDocsUploadDescription,
  ResubmissionLetterDescription,
} from '../components/FormDescriptions/ResubmissionDescriptions';
import {
  attachmentRequiredSchema,
  attachmentUI,
  blankSchema,
  llmResponseAlertSchema,
  llmResponseAlertUI,
  llmUploadAlertSchema,
  llmUploadAlertUI,
} from '../definitions';
import content from '../locales/en/content.json';
import { personalizeTitleByRole } from '../utils/helpers';

export const ID_NUMBER_OPTIONS = [
  content['resubmission-id-number--pdi-option'],
  content['resubmission-id-number--control-option'],
];

export const claimIdentificationNumber = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        personalizeTitleByRole(
          formData,
          content['resubmission-id-number--page-title'],
        ),
      content['resubmission-id-number--page-desc'],
    ),
    pdiOrClaimNumber: selectUI(content['resubmission-id-number--select-label']),
    identifyingNumber: textUI({
      title: content['resubmission-id-number--input-label'],
      hint: content['resubmission-id-number--input-hint'],
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(errors, null, formData, 'identifyingNumber'),
    ],
    'view:addtlInfo': { ...descriptionUI(ClaimIdentificationInfo) },
  },
  schema: {
    type: 'object',
    required: ['pdiOrClaimNumber', 'identifyingNumber'],
    properties: {
      pdiOrClaimNumber: selectSchema(ID_NUMBER_OPTIONS),
      identifyingNumber: textSchema,
      'view:addtlInfo': blankSchema,
    },
  },
};

export const resubmissionLetterUpload = {
  uiSchema: {
    ...titleUI(
      content['resubmission-letter-upload--page-title'],
      ResubmissionLetterDescription,
    ),
    ...descriptionUI(FileUploadDescription),
    ...llmUploadAlertUI,
    resubmissionLetterUpload: attachmentUI({
      label: content['resubmission-letter-upload--input-label'],
      attachmentId: 'EOB',
    }),
    ...llmResponseAlertUI,
  },
  schema: {
    type: 'object',
    required: ['resubmissionLetterUpload'],
    properties: {
      ...llmUploadAlertSchema,
      resubmissionLetterUpload: attachmentRequiredSchema,
      ...llmResponseAlertSchema,
    },
  },
};

export const resubmissionDocsUpload = {
  uiSchema: {
    ...titleUI(
      content['resubmission-docs-upload--page-title'],
      ResubmissionDocsDescription,
    ),
    ...descriptionUI(ResubmissionDocsUploadDescription),
    ...llmUploadAlertUI,
    resubmissionDocsUpload: attachmentUI({
      label: content['resubmission-docs-upload--input-label'],
      attachmentId: 'MEDDOC',
    }),
    ...llmResponseAlertUI,
  },
  schema: {
    type: 'object',
    required: ['resubmissionDocsUpload'],
    properties: {
      ...llmUploadAlertSchema,
      resubmissionDocsUpload: attachmentRequiredSchema,
      ...llmResponseAlertSchema,
    },
  },
};
