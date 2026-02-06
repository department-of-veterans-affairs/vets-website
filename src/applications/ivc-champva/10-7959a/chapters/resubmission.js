import {
  titleUI,
  descriptionUI,
  selectUI,
  selectSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { validFieldCharsOnly } from '../../shared/validations';
import { personalizeTitleByRole } from '../utils/helpers';
import { LLM_UPLOAD_WARNING } from '../components/llmUploadWarning';
import { LLM_RESPONSE } from '../components/llmUploadResponse';
import {
  ResubmissionDocsDescription,
  ResubmissionLetterDescription,
  ResubmissionUploadDescription,
  ResubmissionDocsUploadDescription,
} from '../components/FormDescriptions/ResubmissionDescriptions';
import ClaimIdentificationInfo from '../components/FormDescriptions/ClaimIdentificationInfo';
import { blankSchema, fileUploadSchema } from '../definitions';
import content from '../locales/en/content.json';

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
    identifyingNumber: textUI(content['resubmission-id-number--input-label']),
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
    ...descriptionUI(ResubmissionUploadDescription),
    ...LLM_UPLOAD_WARNING,
    resubmissionLetterUpload: fileUploadUI({
      label: content['resubmission-letter-upload--input-label'],
      attachmentName: true,
      attachmentId: 'EOB', // hard-set for LLM verification
    }),
    ...LLM_RESPONSE,
  },
  schema: {
    type: 'object',
    required: ['resubmissionLetterUpload'],
    properties: {
      'view:fileClaim': blankSchema,
      resubmissionLetterUpload: fileUploadSchema,
      'view:uploadAlert': blankSchema,
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
    ...LLM_UPLOAD_WARNING,
    resubmissionDocsUpload: fileUploadUI({
      label: content['resubmission-docs-upload--input-label'],
      attachmentName: true,
      attachmentId: 'MEDDOC',
    }),
    ...LLM_RESPONSE,
  },
  schema: {
    type: 'object',
    required: ['resubmissionDocsUpload'],
    properties: {
      'view:fileClaim': blankSchema,
      resubmissionDocsUpload: fileUploadSchema,
      'view:uploadAlert': blankSchema,
    },
  },
};
