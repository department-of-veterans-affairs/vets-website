import {
  titleUI,
  descriptionUI,
  titleSchema,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';
import { nameWording, privWrapper } from '../../shared/utilities';
import { FileFieldCustomSimple } from '../../shared/components/fileUploads/FileUpload';
import { blankSchema } from './sponsorInformation';
import { LLM_UPLOAD_WARNING } from '../components/llmUploadWarning';
import { LLM_RESPONSE } from '../components/llmUploadResponse';
import SubmittingClaimsAddtlInfo from '../components/FormDescriptions/SubmittingClaimsAddtlInfo';
import MedicalEobDescription from '../components/FormDescriptions/MedicalEobDescription';
import PharmacyClaimsDescription from '../components/FormDescriptions/PharmacyClaimsDescription';
import MedicalClaimsDescription from '../components/FormDescriptions/MedicalClaimsDescription';

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
      titleSchema,
      claimType: radioSchema(['medical', 'pharmacy']),
    },
  },
};

export const claimWorkSchema = {
  uiSchema: {
    ...titleUI('Claim relationship to work'),
    claimIsWorkRelated: yesNoUI({
      type: 'radio',
      title: 'Is this a claim for a work-related injury or condition?',
      updateUiSchema: formData => {
        return {
          'ui:options': {
            classNames: ['dd-privacy-hidden'],
            hint: `Depending on your answer, we may contact ${nameWording(
              formData,
              true,
              false,
              true,
            )} workers’ compensation insurance provider to determine if they paid any amount for this care.`,
          },
        };
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimIsWorkRelated'],
    properties: {
      titleSchema,
      claimIsWorkRelated: yesNoSchema,
    },
  },
};

export const claimAutoSchema = {
  uiSchema: {
    ...titleUI('Claim relationship to a car accident'),
    claimIsAutoRelated: yesNoUI({
      type: 'radio',
      title:
        'Is this a claim for an injury or condition caused by car accident?',
      updateUiSchema: formData => {
        return {
          'ui:options': {
            classNames: ['dd-privacy-hidden'],
            hint: `Depending on your answer, we may contact ${nameWording(
              formData,
              true,
              false,
              true,
            )} car insurance provider to determine if they paid any amount for this care.`,
          },
        };
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimIsAutoRelated'],
    properties: {
      titleSchema,
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
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      'view:notes': blankSchema,
      // schema for LLM message
      'view:fileClaim': blankSchema,
      medicalUpload: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
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
        return privWrapper(
          `Upload explanation of benefits for this claim from ${
            formData?.policies?.[isPrimary ? 0 : 1]?.name
          }`,
        );
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
        titleSchema,
        'view:fileUploadBlurb': blankSchema,
        'view:notes': blankSchema,
        // schema for LLM message
        'view:fileClaim': blankSchema,
        [keyName]: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
            },
          },
        },
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
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      'view:notes': blankSchema,
      // schema for LLM message
      'view:fileClaim': blankSchema,
      pharmacyUpload: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
      'view:uploadAlert': blankSchema,
    },
  },
};
