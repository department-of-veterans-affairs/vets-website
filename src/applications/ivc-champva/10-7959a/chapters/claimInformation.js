import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  titleUI,
  titleSchema,
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
  // fileInputUI,
  fileInputMultipleUI,
  fileInputSchema,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadBlurbCustom } from '../../shared/components/fileUploads/attachments';
import { nameWording } from '../../shared/utilities';
import { blankSchema } from './sponsorInformation';

const additionalNotesClaims = (
  <va-additional-info
    trigger="Other helpful information about submitting claims"
    class="vads-u-margin-bottom--4"
  >
    <ul>
      <li>
        You must file your claim within 1 year of when you got the care. And if
        you stayed at a hospital for care, you must file your claim within 1
        year of when you left the hospital.
      </li>
      <li>Please retain a copy of all documents submitted to CHAMPVA.</li>
    </ul>
  </va-additional-info>
);

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
      title: 'Is this a claim for a work-related injury or condition?',
      updateUiSchema: formData => {
        return {
          'ui:options': {
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
      title:
        'Is this a claim for an injury or condition caused by car accident?',
      updateUiSchema: formData => {
        return {
          'ui:options': {
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
  uiSchema: {
    ...titleUI('Upload supporting documents', ({ formData }) => (
      <>
        You’ll need to submit a copy of an itemized billing statement for this
        claim.
        <br />
        <p>
          <b>Documentation must include all of this information:</b>
        </p>
        <ul>
          <li>
            {nameWording(formData, true, true, true)} full name, date of birth,
            and Social Security Number.
          </li>
          <li>
            {nameWording(formData, true, true, true)} provider’s full name,
            medical title, office address, billing address, and tax
            identification number.
          </li>
          <li>
            A list of diagnosis and procedure codes for the care. This includes
            DX, CPT, or HCPS codes.
          </li>
          <li>
            A list of charges for {nameWording(formData, true, false, true)}{' '}
            care, and the dates when {nameWording(formData, false, false, true)}{' '}
            got the care.
          </li>
        </ul>
        <p>
          <b>Note:</b>
          &nbsp; You may need to ask your provider for a statement that has all
          of the information listed here. The statement must include all of this
          information in order for us to process this claim.
          <br />
          <br />
          You can also submit any other documents you think may be relevant to
          this claim.
        </p>
      </>
    )),
    ...fileUploadBlurbCustom(null, additionalNotesClaims),
    medicalUpload: {
      ...fileInputMultipleUI({
        errorMessages: { required: 'This document is required.' },
        name: 'medical-claim-upload',
        fileUploadUrl: `${
          environment.API_URL
        }/ivc_champva/v1/forms/submit_supporting_documents`,
        title: 'Upload supporting documents',
        formNumber: '10-7959A',
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medicalUpload'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      medicalUpload: fileInputMultipleSchema,
    },
  },
};

export const eobUploadSchema = isPrimary => {
  const keyName = isPrimary ? 'primaryEob' : 'secondaryEob';
  return {
    uiSchema: {
      ...titleUI(
        ({ formData }) => {
          // If `isPrimary`, show first health insurance co. name. Else, show 2nd.
          return `Upload explanation of benefits from ${
            formData?.policies?.[isPrimary ? 0 : 1]?.name
          }`;
        },
        ({ formData }) => {
          const name = nameWording(formData, true, false, true);
          const yourOrTheir = name.toLowerCase() === 'your' ? name : 'their';
          return (
            <>
              You’ll need to submit a copy of the explanation of benefits from{' '}
              {name} insurance provider. This document lists what {yourOrTheir}{' '}
              other health insurance already paid for {yourOrTheir} care.
              <br />
              <p>
                <b>
                  The explanation of benefits must include all of this
                  information:
                </b>
              </p>
              <ul>
                <li>Date of service that matches the date of care.</li>
                <li>The health care provider’s name.</li>
                <li>What the insurance provider paid for and the amount.</li>
                <li>NPI codes. This is usually a 10-digit number.</li>
                <li>CPT codes. This is usually a 5-digit code.</li>
              </ul>
              <p>
                <b>Note:</b>
                &nbsp; An explanation of benefits is usually sent by mail or
                email. Contact {name} insurance provider if you have more
                questions about where to find this document.
                <br />
                <br />
                You can also submit any other documents you think may be
                relevant to this claim.
              </p>
            </>
          );
        },
      ),
      ...fileUploadBlurbCustom(undefined, additionalNotesClaims),
      [keyName]: {
        ...fileInputMultipleUI({
          errorMessages: { required: 'This document is required.' },
          name: `${keyName}-eob-upload`,
          fileUploadUrl: `${
            environment.API_URL
          }/ivc_champva/v1/forms/submit_supporting_documents`,
          title: 'Upload explanation of benefits',
          formNumber: '10-7959A',
          required: () => true,
        }),
      },
    },
    schema: {
      type: 'object',
      required: [keyName],
      properties: {
        titleSchema,
        'view:fileUploadBlurb': blankSchema,
        [keyName]: fileInputSchema,
      },
    },
  };
};

export const pharmacyClaimUploadSchema = {
  // CustomPage: FileFieldWrapped,
  // CustomPageReview: null,
  uiSchema: {
    ...titleUI(
      'Upload supporting document for prescription claim',
      <>
        You’ll need to submit a copy of a document from the pharmacy with
        information about the prescription medication.
        <br />
        <p>
          <b>Here’s what the document must include:</b>
        </p>
        <ul>
          <li>Name, address, and phone number of the pharmacy.</li>
          <li>Name, dosage, strength, and quantity of the medication.</li>
          <li>Cost of the medication and the copay amount.</li>
          <li>
            National Drug Code (NDC) for each medication. This is an 11-digit
            number that’s different froom the Rx number.
          </li>
          <li>Date the pharmacy filled the prescription.</li>
          <li>Name of the provider who wrote the prescription.</li>
        </ul>
        <p>
          <b>Note:</b>
          &nbsp; The papers attached to the medication usually include this
          information. Or you can ask the pharmacy to print a document with this
          information.
          <br />
          <br />
          You can also submit any other documents you think may be relevant to
          this claim.
        </p>
      </>,
    ),
    ...fileUploadBlurbCustom(null, additionalNotesClaims),
    pharmacyUpload: {
      ...fileInputMultipleUI({
        errorMessages: { required: 'This document is required.' },
        name: 'pharmacy-upload',
        fileUploadUrl: `${
          environment.API_URL
        }/ivc_champva/v1/forms/submit_supporting_documents`,
        title: 'Upload supporting document',
        formNumber: '10-7959A',
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['pharmacyUpload'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      pharmacyUpload: fileInputSchema,
    },
  },
};
