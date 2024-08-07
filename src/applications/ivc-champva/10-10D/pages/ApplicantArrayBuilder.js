import React from 'react';
import {
  ApplicantRelOriginPage,
  ApplicantRelOriginReviewPage,
} from './ApplicantRelOriginPage';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  titleUI,
  titleSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  fileInputUI,
  fileInputSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { nameWording } from '../../shared/utilities';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { fileUploadBlurbCustom } from '../../shared/components/fileUploads/attachments';
import FileFieldCustom from '../../shared/components/fileUploads/FileUpload';
// Wrap shared fileFieldCustom so we can pass the form-specific
// list of required uploads (for use with MissingFileOverview)
function FileFieldWrapped(props) {
  return FileFieldCustom({ ...props, requiredFiles: [] });
}

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'applicants',
  nounSingular: 'applicant',
  nounPlural: 'applicants',
  required: true,
  isItemIncomplete: item => !item?.applicantName, // include all required fields here
  maxItems: 25,
  text: {
    getItemName: item => nameWording(item, false),
    cardDescription: (item, index) => `${item?.applicantDob} (App ${index})`,
    summaryTitle: 'Applicants review',
    cancelAddButtonText: 'Cancel adding this applicant',
  },
};

const yesNoContent = {
  title: 'Do you have another applicant to add?',
  labels: {
    Y: 'Yes',
    N: 'No',
  },
  hint: '',
  labelHeaderLevel: '5',
};

export const medicalClaimUploadSchema = {
  CustomPage: FileFieldWrapped,
  CustomPageReview: null,
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
    ...fileUploadBlurbCustom(null, <p>Testing</p>),
    medicalUpload: fileUploadUI({
      label: 'Upload supporting document',
      attachmentName: true,
    }),
    // medicalUpload: {
    //   ...fileInputUI({
    //     errorMessages: { required: `Upload this file` },
    //     name: 'form-upload-med-file-input',
    //     fileUploadUrl: `${
    //       environment.API_URL
    //     }/ivc_champva/v1/forms/submit_supporting_documents`,
    //     title: 'File upload title',
    //     required: false,
    //   }),
    // },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': { type: 'object', properties: {} },
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

const appNameDobPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: `${options.nounSingular} information`,
      description: `You can add up to ${options?.maxItems} ${
        options?.nounPlural
      }.`,
      nounSingular: options.nounSingular,
    }),
    applicantName: fullNameUI(false, {
      hideOnReview: true,
    }),
    applicantDob: dateOfBirthUI({
      required: true,
      hideOnReview: true,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantName', 'applicantDob'],
    properties: {
      titleSchema,
      applicantName: fullNameSchema,
      applicantDob: dateOfBirthSchema,
    },
  },
};

const relPage = {
  path: 'test/:index',
  title: item => `${nameWording(item)} dependent status`,
  CustomPage: ApplicantRelOriginPage,
  CustomPageReview: null,
  //   customPageUsesPagePerItemData: true,
  uiSchema: {
    // ...titleUI('title here'),
    // applicantRelationshipOrigin: radioUI({
    //   title: 'some title',
    //   labels: ['blood', 'adoption', 'step'],
    //   hideOnReview: true,
    // }),
    // ...titleUI('title here'),
    // relationshipToVeteran: radioUI(['']),
  },
  schema: {
    type: 'object',
    properties: {
      applicantRelationshipOrigin: {
        type: 'object',
        properties: {
          relationshipToVeteran: radioSchema(['blood', 'adoption', 'step']),
          otherRelationshipToVeteran: { type: 'string' },
        },
      },
    },
  },
};

const summaryPage = {
  uiSchema: {
    'view:hasApplicants': arrayBuilderYesNoUI(
      options,
      yesNoContent,
      yesNoContent,
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasApplicants': arrayBuilderYesNoSchema,
    },
    required: ['view:hasApplicants'],
  },
};

// Main pages object
export const applicantsPage = arrayBuilderPages(options, pageBuilder => ({
  applicantsIntro: pageBuilder.introPage({
    path: 'applicants-intro',
    title: '[noun plural]',
    uiSchema: {
      ...titleUI(`${options.nounPlural} information`, () => (
        <p>
          Next we’ll ask you to enter information about the applicants.
          <br />
          You can add up to {options.maxItems} {options.nounPlural}.
        </p>
      )),
    },
    schema: {
      type: 'object',
      properties: {
        titleSchema,
      },
    },
  }),
  applicantsSummary: pageBuilder.summaryPage({
    title: 'Review your [noun plural]',
    path: 'applicants-review',
    ...summaryPage,
  }),
  applicantsType: pageBuilder.itemPage({
    title: `${options.nounSingular} name and dob`,
    path: 'applicantx-name-dob/:index',
    ...appNameDobPage,
  }),
  applicantsMedUpload: pageBuilder.itemPage({
    title: 'Medical claim supporting documents',
    path: 'claim-med-upload/:index',
    ...medicalClaimUploadSchema,
  }),
  applicantRelPage: pageBuilder.itemPage({ ...relPage }),
}));
