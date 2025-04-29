import React from 'react';
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
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import { ApplicantAddressCopyPage } from '../../shared/components/applicantLists/ApplicantAddressPage';
import { page15aDepends } from '../helpers/utilities';

import { applicantWording } from '../../shared/utilities';

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
  maxItems: 25, // TODO: use constant for this limit
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
  }),
);
