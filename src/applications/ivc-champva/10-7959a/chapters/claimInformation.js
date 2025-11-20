import {
  titleUI,
  descriptionUI,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';
import { FileFieldCustomSimple } from '../../shared/components/fileUploads/FileUpload';
import { LLM_UPLOAD_WARNING } from '../components/llmUploadWarning';
import { LLM_RESPONSE } from '../components/llmUploadResponse';
import SubmittingClaimsAddtlInfo from '../components/FormDescriptions/SubmittingClaimsAddtlInfo';
import MedicalEobDescription from '../components/FormDescriptions/MedicalEobDescription';
import PharmacyClaimsDescription from '../components/FormDescriptions/PharmacyClaimsDescription';
import MedicalClaimsDescription from '../components/FormDescriptions/MedicalClaimsDescription';
import { blankSchema, fileUploadSchema } from '../definitions';
import content from '../locales/en/content.json';

const addtlInfoNotes = {
  'view:notes': { ...descriptionUI(SubmittingClaimsAddtlInfo) },
};

export const claimTypeSchema = {
  uiSchema: {
    ...titleUI('Claim type'),
    claimType: radioUI({
      title: 'What type of claim are you submitting?',
      labels: {
        medical: 'I’m submitting a claim for medical care from a provider',
        pharmacy: 'I’m submitting a claim for prescription medications',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimType'],
    properties: {
      claimType: radioSchema(['medical', 'pharmacy']),
    },
  },
};

export const claimWorkSchema = {
  uiSchema: {
    ...titleUI(content['claim--work-title']),
    claimIsWorkRelated: yesNoUI({
      title: content['claim--work-label'],
      hint: content['claim--work-hint'],
    }),
  },
  schema: {
    type: 'object',
    required: ['claimIsWorkRelated'],
    properties: {
      claimIsWorkRelated: yesNoSchema,
    },
  },
};

export const claimAutoSchema = {
  uiSchema: {
    ...titleUI(content['claim--auto-title']),
    claimIsAutoRelated: yesNoUI({
      title: content['claim--auto-label'],
      hint: content['claim--auto-hint'],
    }),
  },
  schema: {
    type: 'object',
    required: ['claimIsAutoRelated'],
    properties: {
      claimIsAutoRelated: yesNoSchema,
    },
  },
};

export const medicalClaimUploadSchema = {
  CustomPage: FileFieldCustomSimple,
  CustomPageReview: null,
  uiSchema: {
    ...titleUI('Upload supporting documents'),
    ...descriptionUI(MedicalClaimsDescription),
    ...fileUploadBlurb,
    ...addtlInfoNotes,
    ...LLM_UPLOAD_WARNING,
    medicalUpload: fileUploadUI({
      label: 'Upload itemized billing statement',
      attachmentName: true,
      attachmentId: 'medical invoice', // hard-set for LLM verification
    }),
    ...LLM_RESPONSE,
  },
  schema: {
    type: 'object',
    required: ['medicalUpload'],
    properties: {
      'view:fileUploadBlurb': blankSchema,
      'view:notes': blankSchema,
      // schema for LLM message
      'view:fileClaim': blankSchema,
      medicalUpload: fileUploadSchema,
      'view:uploadAlert': blankSchema,
    },
  },
};

export const eobUploadSchema = isPrimary => {
  const keyName = isPrimary ? 'primaryEob' : 'secondaryEob';
  return {
    CustomPage: FileFieldCustomSimple,
    CustomPageReview: null,
    uiSchema: {
      ...titleUI(({ formData }) => {
        // If `isPrimary`, show first health insurance co. name. Else, show 2nd.
        return `Upload explanation of benefits for this claim from ${
          formData?.policies?.[isPrimary ? 0 : 1]?.name
        }`;
      }),
      ...descriptionUI(MedicalEobDescription),
      ...fileUploadBlurb,
      ...addtlInfoNotes,
      ...LLM_UPLOAD_WARNING,
      [keyName]: fileUploadUI({
        label: 'Upload explanation of benefits',
        attachmentName: true,
        attachmentId: 'EOB', // hard-set for LLM verification
      }),
      ...LLM_RESPONSE,
    },
    schema: {
      type: 'object',
      required: [keyName],
      properties: {
        'view:fileUploadBlurb': blankSchema,
        'view:notes': blankSchema,
        // schema for LLM message
        'view:fileClaim': blankSchema,
        [keyName]: fileUploadSchema,
        'view:uploadAlert': blankSchema,
      },
    },
  };
};

export const pharmacyClaimUploadSchema = {
  CustomPage: FileFieldCustomSimple,
  CustomPageReview: null,
  uiSchema: {
    ...titleUI('Upload supporting document for prescription medication claim'),
    ...descriptionUI(PharmacyClaimsDescription),
    ...fileUploadBlurb,
    ...addtlInfoNotes,
    ...LLM_UPLOAD_WARNING,
    pharmacyUpload: fileUploadUI({
      label: 'Upload supporting document',
      attachmentName: true,
      attachmentId: 'pharmacy invoice', // hard-set for LLM verification
    }),
    ...LLM_RESPONSE,
  },
  schema: {
    type: 'object',
    required: ['pharmacyUpload'],
    properties: {
      'view:fileUploadBlurb': blankSchema,
      'view:notes': blankSchema,
      // schema for LLM message
      'view:fileClaim': blankSchema,
      pharmacyUpload: fileUploadSchema,
      'view:uploadAlert': blankSchema,
    },
  },
};
