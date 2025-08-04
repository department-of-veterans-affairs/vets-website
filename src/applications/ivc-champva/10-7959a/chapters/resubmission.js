import React from 'react';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  titleUI,
  titleSchema,
  selectUI,
  selectSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { fileUploadBlurb } from '../../shared/components/fileUploads/attachments';
import { nameWording, privWrapper } from '../../shared/utilities';
import { CHAMPVA_PHONE_NUMBER } from '../../shared/constants';
import { validFieldCharsOnly } from '../../shared/validations';
import { LLM_UPLOAD_WARNING } from '../components/llmUploadWarning';

export const claimIdentifyingNumberOptions = [
  'PDI number',
  'Claim control number',
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

export const claimIdentifyingNumber = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        `${
          formData?.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
        } claim identification number`,
      `We'll use the Program Document Identifier (PDI) or claim control number to identify the original claim that was submitted. These can be found on the letter you received from CHAMPVA requesting further action on your claim.`,
    ),
    pdiOrClaimNumber: selectUI({
      title: 'Is this a PDI or claim control number?',
    }),
    identifyingNumber: {
      ...textUI('PDI number or claim identification number'),
    },
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(errors, null, formData, 'identifyingNumber'),
    ],
    'view:adtlInfo': {
      'ui:description': (
        <div>
          <va-additional-info trigger="Where to find the PDI number">
            <p>
              The PDI number is located at the bottom of the letter we mailed
              you. It begins with the letters "VA" and includes an 8-digit code
              (example: VA12345678).
            </p>
            <br />
            <p>
              If you can’t find the PDI number, call us at{' '}
              <va-telephone contact={CHAMPVA_PHONE_NUMBER} />{' '}
              <va-telephone contact="711" tty="true" />
              {'. '}
              We’re here Monday through Friday, 8:05a.m. to 7:30 p.m. ET.
            </p>
          </va-additional-info>
          <va-additional-info trigger="Where to find the claim control number">
            <p>
              The claim control number is located on the CHAMPVA Explanation of
              Benefits we mailed you. It begins with a letter followed by an
              11-digit code (example: M00001234567).
            </p>
            <br />
            <p>
              If you can’t find the claim control number, call us at{' '}
              <va-telephone contact={CHAMPVA_PHONE_NUMBER} />
              <va-telephone contact="711" tty="true" />
              {'. '}
              We’re here Monday through Friday, 8:05a.m. to 7:30 p.m. ET.
            </p>
          </va-additional-info>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['pdiOrClaimNumber', 'identifyingNumber'],
    properties: {
      titleSchema,
      pdiOrClaimNumber: selectSchema(claimIdentifyingNumberOptions),
      identifyingNumber: textSchema,
      'view:adtlInfo': {
        type: 'object',
        properties: {},
      },
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
      titleSchema,
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
      titleSchema,
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
      titleSchema,
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
    },
  },
};
