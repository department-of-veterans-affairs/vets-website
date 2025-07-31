import React from 'react';
import {
  titleUI,
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

const additionalMedicalClaimInfo = () => {
  return (
    <va-additional-info
      trigger="More information about the codes that should be included"
      class="vads-u-margin-bottom--4"
    >
      <ul>
        <li>
          <b>DX codes</b>, or diagnosis codes, are used to identify a specific
          diagnosis. They are typically a letter followed by a series of 3-7
          numbers, usually including a decimal point (example: A12.345)
        </li>
        <li>
          <b>CPT codes</b> are used to identify a medical service or procedure.
          They are usually a 5-digit code (example: 12345)
        </li>
        <li>
          <b>HCPCS codes</b> are used to identify products, supplies, and
          services. They are usually one alphabet letter followed by 4 digits
          (example: A1234)
        </li>
      </ul>
    </va-additional-info>
  );
};

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
    ...titleUI('Upload supporting documents', ({ formData }) => (
      <>
        <va-alert status="warning">
          <p className="vads-u-margin-y--0">
            You’ll need to submit a copy of an <b>itemized billing statement</b>
            , often called a superbill, for this claim. Ask{' '}
            {privWrapper(nameWording(formData, true, false, true))} provider for
            an itemized bill as the patient copy is often missing critical
            information required by CHAMPVA to process claims.
          </p>
        </va-alert>
        <p>
          <b>
            The statement must include all of this information to process your
            claim:
          </b>
        </p>
        <ul>
          <li>
            <b>{privWrapper(nameWording(formData, true, true, true))}:</b>
            <ul style={{ listStyleType: 'disc' }}>
              <li>Full name</li>
              <li>Date of birth</li>
            </ul>
          </li>
          <li>
            <b>
              {privWrapper(nameWording(formData, true, true, true))} provider’s:
            </b>
            <ul style={{ listStyleType: 'disc' }}>
              <li>Full name</li>
              <li>Medical title</li>
              <li>Address where services were rendered</li>
              <li>10-digit National Provider Identifier (NPI)</li>
              <li>
                9-digit tax identification number (TIN or Tax ID; example
                12-1234567)
              </li>
            </ul>
          </li>
          <li>
            <b>A list of charges</b> for{' '}
            {privWrapper(nameWording(formData, true, false, true))} care
          </li>
          <li>
            <b>The date of service</b> when{' '}
            {privWrapper(nameWording(formData, false, false, true))} got the
            care
          </li>
          <li>
            <b>Diagnosis (DX) codes</b> for the care
          </li>
          <li>
            <b>A list of procedure codes</b> for the care:
            <ul style={{ listStyleType: 'disc' }}>
              <li>Current Procedural Terminology (CPT) codes or</li>
              <li>Healthcare Common Procedure Coding System (HCPCS) codes</li>
            </ul>
          </li>
        </ul>
        {additionalMedicalClaimInfo()}
        <p>
          <b>Note:</b>
          &nbsp; CHAMPVA will not be able to process your claim if your
          statement does not include all of the listed information. You may need
          to ask your provider for a statement that has all of the information
          listed here.
          {/* <va-link text="Learn more about itemized bills" href="#TODO" /> */}
          <br />
          <br />
          You can also submit any other documents you think may be relevant to
          this claim.
        </p>
      </>
    )),
    ...fileUploadBlurb,
    'view:notes': {
      'ui:description': formData => {
        return additionalNotesClaims(formData?.formContext?.fullData);
      },
    },
    ...LLM_UPLOAD_WARNING,
    medicalUpload: fileUploadUI({
      label: 'Upload supporting document',
      attachmentName: true,
      attachmentId: 'medical invoice', // hard-set for LLM verification
    }),
  },
  schema: {
    type: 'object',
    required: ['medicalUpload'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      'view:notes': blankSchema,
      // schema for LLM message
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

export const eobUploadSchema = isPrimary => {
  const keyName = isPrimary ? 'primaryEob' : 'secondaryEob';
  return {
    CustomPage: FileFieldCustomSimple,
    CustomPageReview: null,
    uiSchema: {
      ...titleUI(
        ({ formData }) => {
          // If `isPrimary`, show first health insurance co. name. Else, show 2nd.
          return privWrapper(
            `Upload explanation of benefits for this claim from ${
              formData?.policies?.[isPrimary ? 0 : 1]?.name
            }`,
          );
        },
        ({ formData }) => {
          const name = nameWording(formData, true, false, true);
          const yourOrTheir = name.toLowerCase() === 'your' ? name : 'their';
          return (
            <>
              You’ll need to submit a copy of the explanation of benefits from{' '}
              {privWrapper(name)} insurance provider. This is not the same as
              the summary of benefits for the health insurance policy. The
              explanation of benefits lists what {yourOrTheir} other health
              insurance already paid for this specific claim.
              <br />
              <p>
                <b>
                  The explanation of benefits must include all of this
                  information:
                </b>
              </p>
              <ul>
                <li>
                  <b>Date of service</b> that matches the date of care.
                </li>
                <li>
                  <b>The health care provider’s:</b>
                  <ul style={{ listStyleType: 'disc' }}>
                    <li>Name.</li>
                    <li>
                      10-digit NPI (National Provider Identifier) code if not
                      shown on itemized billing statement.
                    </li>
                  </ul>
                </li>
                <li>
                  <b>The services</b> the insurance provider paid for. This may
                  be a 5-digit CPT (Current Procedural Terminology) or HCPCS
                  (Healthcare Common Procedure Coding System) code or a
                  description of the service or medical procedure.
                </li>
                <li>
                  <b>The amount paid</b> by the insurance provider.
                </li>
              </ul>
              <p>
                <b>Note:</b>
                &nbsp; An explanation of benefits is usually sent by mail or
                email. Contact {privWrapper(name)} insurance provider if you
                have more questions about where to find this document.
                <br />
                <br />
                You can also submit any other documents you think may be
                relevant to this claim.
              </p>
            </>
          );
        },
      ),
      ...fileUploadBlurb,
      'view:notes': {
        'ui:description': formData => {
          return additionalNotesClaims(formData?.formContext?.fullData);
        },
      },
      ...LLM_UPLOAD_WARNING,
      [keyName]: fileUploadUI({
        label: 'Upload explanation of benefits',
        attachmentName: true,
        attachmentId: 'EOB', // hard-set for LLM verification
      }),
    },
    schema: {
      type: 'object',
      required: [keyName],
      properties: {
        titleSchema,
        'view:fileUploadBlurb': blankSchema,
        'view:notes': blankSchema,
        // schema for LLM message
        'view:fileClaim': {
          type: 'object',
          properties: {},
        },
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
      },
    },
  };
};

export const pharmacyClaimUploadSchema = {
  CustomPage: FileFieldCustomSimple,
  CustomPageReview: null,
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
          <li>
            <b>The pharmacy’s:</b>
            <ul style={{ listStyleType: 'disc' }}>
              <li>Name</li>
              <li>Address</li>
              <li>Phone number</li>
            </ul>
          </li>
          <li>
            <b>The medication’s:</b>
            <ul style={{ listStyleType: 'disc' }}>
              <li>Name</li>
              <li>Dosage</li>
              <li>Strength</li>
              <li>Quantity</li>
            </ul>
          </li>
          <li>
            <b>Cost</b> of the medication.
          </li>
          <li>
            <b>Copay amount.</b>
          </li>
          <li>
            <b>National Drug Code (NDC)</b> for each medication. This is an
            11-digit number that’s different from the Rx number.
          </li>
          <li>
            <b>Date</b> the pharmacy filled the prescription.
          </li>
          <li>
            <b>Name of the provider</b> who wrote the prescription.
          </li>
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
