import React from 'react';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  titleUI,
  descriptionUI,
  selectUI,
  selectSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';
import { nameWording, privWrapper } from '../../shared/utilities';
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
import content from '../locales/en/content.json';

const ID_NUMBER_OPTIONS = [
  content['resubmission-id-number--pdi-option'],
  content['resubmission-id-number--control-option'],
];

const additionalNotesClaims = formData => {
  const nameCap = privWrapper(
    nameWording(formData, false, true, true) || 'You',
  );
  const namePosessive =
    formData?.certifierRole === 'applicant' ? 'your' : 'their';
  const name = formData?.certifierRole === 'applicant' ? 'you' : 'they';
  return (
    <va-additional-info
      trigger="Other helpful information about submitting claims"
      class="vads-u-margin-bottom--4"
    >
      <ul>
        <li>
          {nameCap} must file {namePosessive} claim within 1 year of when {name}{' '}
          got the care. And if {name} stayed at a hospital for care, {name} must
          file {namePosessive} claim within 1 year of when {name} left the
          hospital.
        </li>
        <li>Please retain a copy of all documents submitted to CHAMPVA.</li>
      </ul>
    </va-additional-info>
  );
};

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
      resubmissionLetterUpload: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: { name: { type: 'string' } },
        },
      },
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
      resubmissionDocsUpload: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: { name: { type: 'string' } },
        },
      },
      'view:uploadAlert': blankSchema,
    },
  },
};

export const claimType = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim type`,
    ),
    claimType: radioUI({
      title: 'What was the original type of claim?',
      labels: {
        medical: 'Medical claim',
        pharmacy: 'Pharmacy claim',
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

export const medicalClaimDetails = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim details`,
      'This information will help us find your original claim.',
    ),
    providerName: textUI('Provider name'),
    beginningDateOfService: {
      ...currentOrPastDateUI({
        title: 'Beginning date of service',
      }),
    },
    endDateOfService: {
      ...currentOrPastDateUI({
        title: 'End date of service',
        hint: 'If service occurred over multiple days.',
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['providerName', 'beginningDateOfService', 'endDateOfService'],
    properties: {
      providerName: textSchema,
      beginningDateOfService: currentOrPastDateSchema,
      endDateOfService: currentOrPastDateSchema,
    },
  },
};

export const medicalUploadSupportingDocs = {
  uiSchema: {
    ...titleUI(
      'Upload supporting documents for your medical claim',
      <>
        <p>You’ll need to submit these documents:</p>
        <ul>
          <li>
            Copies of documents with missing information we requested in the
            letter we mailed you, <b> and</b>
          </li>
          <li>All documents you submitted with your claim</li>
        </ul>
        <p>
          These documents could include paperwork attached to your prescription
          or pharmacy statements.
        </p>
      </>,
    ),
    ...fileUploadBlurb,
    'view:notes': {
      'ui:description': formData => {
        return additionalNotesClaims(formData?.formContext?.fullData);
      },
    },

    medicalUpload: fileUploadUI({
      label: 'Upload supporting document',
      attachmentName: true,
    }),
    ...LLM_UPLOAD_WARNING,
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

export const pharmacyClaimDetails = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim details`,
      'This information will help us find your original claim.',
    ),
    medicationName: textUI('Medication name'),
    prescriptionFillDate: {
      ...currentOrPastDateUI({
        title: 'Prescription fill date',
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medicationName', 'prescriptionFillDate'],
    properties: {
      medicationName: textSchema,
      prescriptionFillDate: currentOrPastDateSchema,
    },
  },
};

export const pharmacyClaimUploadDocs = {
  uiSchema: {
    ...titleUI(
      'Upload supporting documents for your pharmacy claim',
      <>
        <p>You’ll need to submit these documents:</p>
        <ul>
          <li>
            Copies of documents with missing information we requested in the
            letter we mailed you, <b> and</b>
          </li>
          <li>All documents you submitted with your original claim</li>
        </ul>
        <p>
          These documents could include itemized billing statements (often
          called a superbill) from your provider or Explanation of Benefits from
          your insurance company.
        </p>
      </>,
    ),
    ...fileUploadBlurb,
    'view:notes': {
      'ui:description': formData => {
        return additionalNotesClaims(formData?.formContext?.fullData);
      },
    },
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
