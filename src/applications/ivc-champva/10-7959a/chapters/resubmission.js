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

export const claimIdentifyingNumberOptions = ['PDI number', 'Control number'];

const additionalInfoDescription = (
  <div className="vads-u-margin-top--4">
    <p>
      <strong>For PDI numbers</strong> you don’t need to include the date in the
      beginning of the PDI number. Enter the 2 letters and the all of the
      numbers following it.
    </p>
    <p>
      <strong>For control numbers</strong> include all of the numbers listed
      under “Control Number” on the CHAMPVA Explanation of benefits.
    </p>

    <va-additional-info
      trigger="Where to find the PDI number"
      class="vads-u-margin-y--3"
    >
      <span>
        <p className="vads-u-margin-top--0">
          The PDI number is located at the bottom of the letter we mailed you.
          It begins with a date, followed by 2 letters (VA, PG, FX and CM) and a
          series of numbers (example: 02/26/2025-VA1753294097390-001).
        </p>
        <p className="vads-u-margin-bottom--0">
          If you can’t find the PDI number, call us at{' '}
          <va-telephone contact={CHAMPVA_PHONE_NUMBER} />{' '}
          <va-telephone contact="711" tty />
          {'. '}
          We’re here Monday through Friday, 8:05a.m. to 7:30 p.m.{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
          .
        </p>
      </span>
    </va-additional-info>
    <va-additional-info
      trigger="Where to find the control number"
      class="vads-u-margin-y--3"
    >
      <span>
        <p className="vads-u-margin-top--0">
          The control number is located on the CHAMPVA Explanation of Benefits
          we mailed you. It is a 12-digit code or may begin with a the letter
          “M” followed by an 11-digit code (example: M00001234567).
        </p>
        <p className="vads-u-margin-bottom--0">
          If you can’t find the control number, call us at{' '}
          <va-telephone contact={CHAMPVA_PHONE_NUMBER} />
          <va-telephone contact="711" tty />
          {'. '}
          We’re here Monday through Friday, 8:05a.m. to 7:30 p.m.{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
          .
        </p>
      </span>
    </va-additional-info>
  </div>
);

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
      `We’ll use the Program Document Identifier (PDI) or control number to identify the original claim that was submitted. These can be found on the letter you received from CHAMPVA requesting further action on your claim.`,
    ),
    pdiOrClaimNumber: selectUI({
      title: 'Is this a PDI number or control number?',
    }),
    identifyingNumber: {
      ...textUI('Claim identification number'),
    },
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(errors, null, formData, 'identifyingNumber'),
    ],
    'view:adtlInfo': {
      'ui:description': additionalInfoDescription,
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
    'view:fileClaim': {
      'ui:description': (
        <>
          <a
            href="https://www.va.gov/resources/how-to-file-a-champva-claim/"
            rel="noopener noreferrer"
          >
            Learn more about supporting medical claim documents (opens in a new
            tab)
          </a>
          <br />
          <br />
          <va-alert status="info">
            To help reduce errors that might result in a claim denial, we’ll
            scan your uploads to verify they meet document requirements. This
            may cause a 1-2 minute delay during the upload process. Please don’t
            refresh your screen.
          </va-alert>
        </>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['medicalUpload'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      'view:notes': blankSchema,
      'view:fileClaim': {
        type: 'object',
        properties: {},
      },
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
    pharmacyUpload: fileUploadUI({
      label: 'Upload supporting document',
      attachmentName: true,
      attachmentId: 'pharmacy invoice', // hard-set for LLM verification
    }),
    'view:fileClaim': {
      'ui:description': (
        <>
          <a
            href="https://www.va.gov/resources/how-to-file-a-champva-claim/"
            rel="noopener noreferrer"
          >
            Learn more about supporting pharmacy claim documents (opens in a new
            tab)
          </a>
          <br />
          <br />
          <va-alert status="info">
            To help reduce errors that might result in a claim denial, we’ll
            scan your uploads to verify they meet document requirements. This
            may cause a 1-2 minute delay during the upload process. Please don’t
            refresh your screen.
          </va-alert>
        </>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['pharmacyUpload'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      'view:notes': blankSchema,
      'view:fileClaim': {
        type: 'object',
        properties: {},
      },
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
