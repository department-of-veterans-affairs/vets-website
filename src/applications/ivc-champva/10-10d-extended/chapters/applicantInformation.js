import React from 'react';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { cloneDeep } from 'lodash';
import {
  addressUI,
  addressSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
  ssnUI,
  ssnSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';

import { ApplicantAddressCopyPage } from '../../shared/components/applicantLists/ApplicantAddressPage';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import ApplicantRelationshipPage from '../../shared/components/applicantLists/ApplicantRelationshipPage';
import FileFieldCustom from '../../shared/components/fileUploads/FileUpload';
import { fileWithMetadataSchema } from '../../shared/components/fileUploads/attachments';
import { applicantWording } from '../../shared/utilities';

import { ApplicantRelOriginPage } from './ApplicantRelOriginPage';
import { ApplicantGenderPage } from './ApplicantGenderPage';
import { page15aDepends } from '../helpers/utilities';
import { MAIL_OR_FAX_LATER_MSG, MAX_APPLICANTS } from '../constants';

import {
  uploadWithInfoComponent,
  acceptableFiles,
} from '../../10-10D/components/Sponsor/sponsorFileUploads';

/*
// TODO: get the custom prefill stuff working with array builder
import CustomPrefillMessage from '../components/CustomPrefillAlert';
*/

/*
// TODO: re-add this custom validation + the same for normal text fields
import { applicantAddressCleanValidation } from '../../shared/validations';
*/

// import mockData from '../tests/fixtures/data/test-data.json';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

const applicantOptions = {
  arrayPath: 'applicants',
  nounSingular: 'applicant',
  nounPlural: 'applicants',
  required: true,
  isItemIncomplete: item => {
    return !item?.applicantName?.first;
  }, // TODO: include more required fields here
  maxItems: MAX_APPLICANTS,
  text: {
    getItemName: item => item?.applicantName?.first || 'Applicant',
    cardDescription: item =>
      `${item?.applicantName?.first || 'Applicant'} details`,
  },
};

const applicantIntroPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Applicant information',
      nounSingular: applicantOptions.nounSingular,
    }),
    applicantName: fullNameUI(),
    applicantDob: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      applicantName: fullNameSchema,
      applicantDob: dateOfBirthSchema,
    },
    required: ['applicantName', 'applicantDob'],
  },
};

const applicantIdentificationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${applicantWording(formData) || 'Applicant'} identification`,
    ),
    applicantSSN: ssnUI(),
  },
  schema: {
    type: 'object',
    properties: {
      applicantSSN: ssnSchema,
    },
    required: ['applicantSSN'],
  },
};

const applicantAddressSelectionPage = {
  uiSchema: {},
  schema: blankSchema,
};

const applicantMailingAddressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${applicantWording(formData) || 'Applicant'} mailing address`,
    ),
    applicantAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Address is on a United States military base outside the country.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      applicantAddress: addressSchema(),
    },
    required: ['applicantAddress'],
  },
};

const applicantContactInfoPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${applicantWording(formData) || 'Applicant'} contact information`,
      ({ formData }) =>
        `We’ll use this information to contact ${applicantWording(
          formData,
          false,
          false,
          true,
        )} if we have more questions`,
    ),
    applicantPhone: phoneUI(),
    applicantEmailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      applicantPhone: phoneSchema,
      applicantEmailAddress: emailSchema,
    },
    required: ['applicantPhone'],
  },
};

const applicantGenderPage = {
  uiSchema: {
    applicantGender: {},
  },
  schema: {
    type: 'object',
    properties: {
      applicantGender: {
        type: 'object',
        properties: {
          gender: { type: 'string' },
          _unused: { type: 'string' },
        },
      },
    },
  },
};

const applicantRelationshipPage = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      applicantRelationshipToSponsor: {
        type: 'object',
        properties: {
          relationshipToVeteran: { type: 'string' },
          otherRelationshipToVeteran: { type: 'string' },
        },
      },
    },
    required: ['applicantRelationshipToSponsor'],
  },
};

const applicantRelationshipOriginPage = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      'ui:description': blankSchema,
      applicantRelationshipOrigin: {
        type: 'object',
        properties: {
          relationshipToVeteran: radioSchema(['blood', 'adoption', 'step']),
          otherRelationshipToVeteran: { type: 'string' },
        },
      },
    },
    required: ['applicantRelationshipOrigin'],
  },
};

// TODO: switch to v3 file upload after initial page implementation
const applicantBirthCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.birthCert,
  'birth certificates',
);

const applicantBirthCertUploadPage = {
  uiSchema: {
    ...titleUI('Upload birth certificate', ({ formData }) => (
      <>
        To help us process this application faster, submit a copy of{' '}
        <b className="dd-privacy-hidden">
          {applicantWording(formData, true, false)}
        </b>{' '}
        birth certificate.
        <br />
        Submitting a copy can help us process this application faster.
        <br />
        {MAIL_OR_FAX_LATER_MSG}
      </>
    )),
    ...applicantBirthCertConfig.uiSchema,
    applicantBirthCertOrSocialSecCard: fileUploadUI({
      label: 'Upload a copy of birth certificate',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      ...applicantBirthCertConfig.schema,
      applicantBirthCertOrSocialSecCard: fileWithMetadataSchema(
        acceptableFiles.birthCert,
      ),
    },
  },
};

const applicantSummaryPage = {
  uiSchema: {
    'view:hasApplicants': arrayBuilderYesNoUI(applicantOptions),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasApplicants': arrayBuilderYesNoSchema,
    },
    required: ['view:hasApplicants'],
  },
};

export const applicantPages = arrayBuilderPages(
  applicantOptions,
  pageBuilder => ({
    applicantIntro: pageBuilder.introPage({
      path: 'applicant-intro',
      title: '[noun plural]',
      // initialData: mockData.data,
      uiSchema: {
        ...titleUI(
          'Add applicants',
          <>
            Next we’ll ask you to enter the information about each applicant.
            This includes social security number, mailing address, contact
            information and relationship to the sponsor.
            <br />
            <br />
            {/* TODO: use constant for this value */}
            You can add up to 25 applicants.
          </>,
        ),
      },
      schema: {
        type: 'object',
        properties: {
          titleSchema,
        },
      },
    }),
    applicantSummary: pageBuilder.summaryPage({
      path: 'applicant-summary',
      title: 'Review your applicants',
      uiSchema: applicantSummaryPage.uiSchema,
      schema: applicantSummaryPage.schema,
    }),
    page13: pageBuilder.itemPage({
      path: 'applicant-name-dob/:index',
      title: 'Applicant name and date of birth',
      ...applicantIntroPage,
    }),
    page14: pageBuilder.itemPage({
      path: 'applicant-identification/:index',
      title: 'Identification',
      ...applicantIdentificationPage,
    }),
    page15a: pageBuilder.itemPage({
      path: 'applicant-address-selection/:index',
      title: 'Address selection',
      ...applicantAddressSelectionPage,
      CustomPage: props => {
        return ApplicantAddressCopyPage(props);
      },
      depends: (formData, index) => page15aDepends(formData, index),
    }),
    page15: pageBuilder.itemPage({
      path: 'applicant-mailing-address/:index',
      title: 'Mailing address',
      ...applicantMailingAddressPage,
    }),
    page16: pageBuilder.itemPage({
      path: 'applicant-contact-info/:index',
      title: 'Contact information',
      ...applicantContactInfoPage,
    }),
    page17: pageBuilder.itemPage({
      path: 'applicant-gender/:index',
      title: 'Applicant sex listed at birth',
      ...applicantGenderPage,
      CustomPage: ApplicantGenderPage,
    }),
    page18: pageBuilder.itemPage({
      path: 'applicant-relationship/:index',
      title: item => `${applicantWording(item)} relationship to the sponsor`,
      ...applicantRelationshipPage,
      CustomPage: ApplicantRelationshipPage,
    }),
    page18c: pageBuilder.itemPage({
      path: 'applicant-relationship-child/:index',
      title: item => `${applicantWording(item)} dependent status`,
      depends: (formData, index) => {
        if (index === undefined) return true;
        return (
          get(
            'applicantRelationshipToSponsor.relationshipToVeteran',
            formData?.applicants?.[index],
          ) === 'child'
        );
      },
      ...applicantRelationshipOriginPage,
      CustomPage: ApplicantRelOriginPage,
    }),
    page18a: pageBuilder.itemPage({
      path: 'applicant-relationship-child-upload/:index',
      title: item => `${applicantWording(item)} birth certificate`,
      depends: (formData, index) => {
        if (index === undefined) return true;
        return (
          get(
            'applicantRelationshipToSponsor.relationshipToVeteran',
            formData?.applicants?.[index],
          ) === 'child'
        );
      },
      CustomPage: FileFieldCustom,
      CustomPageReview: null,
      customPageUsesPagePerItemData: true,
      ...applicantBirthCertUploadPage,
    }),
  }),
);
