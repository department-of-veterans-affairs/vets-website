import React from 'react';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { cloneDeep } from 'lodash';
import {
  addressUI,
  addressSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
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
import { applicantWording, getAgeInYears } from '../../shared/utilities';

import { ApplicantRelOriginPage } from './ApplicantRelOriginPage';
import { ApplicantGenderPage } from './ApplicantGenderPage';
import { page15aDepends } from '../helpers/utilities';
import { MAIL_OR_FAX_LATER_MSG, MAX_APPLICANTS } from '../constants';

import {
  uploadWithInfoComponent,
  acceptableFiles,
} from '../../10-10D/components/Sponsor/sponsorFileUploads';
import { isInRange } from '../../10-10D/helpers/utilities';
import { ApplicantDependentStatusPage } from '../../10-10D/pages/ApplicantDependentStatus';
import { depends18f3 } from '../../10-10D/pages/ApplicantSponsorMarriageDetailsPage';
import { ApplicantMedicareStatusPage } from '../../10-10D/pages/ApplicantMedicareStatusPage';
import { ApplicantMedicareStatusContinuedPage } from '../../10-10D/pages/ApplicantMedicareStatusContinuedPage';
import ApplicantOhiStatusPage from '../../10-10D/pages/ApplicantOhiStatusPage';

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
    getItemName: item => applicantWording(item, false, true, false),
    cardDescription: item => (
      <ul className="no-bullets">
        <li>
          <b>Date of Birth:</b> {item?.applicantName?.first}
        </li>
        <li>
          <b>Address:</b> {item?.applicantAddress?.street}{' '}
          {item?.applicantAddress?.city}, {item?.applicantAddress?.state}
        </li>
        <li>
          <b>Phone number:</b> {item?.applicantPhone}
        </li>
        <li>
          <b>Relationship to sponsor:</b>{' '}
          {item?.applicantRelationshipToSponsor?.relationshipToVeteran !==
          'other'
            ? item?.applicantRelationshipToSponsor?.relationshipToVeteran
            : item?.applicantRelationshipToSponsor?.otherRelationshipToVeteran}
        </li>
      </ul>
    ),
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
      ({ formData }) => `${applicantWording(formData)} identification`,
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
      ({ formData }) => `${applicantWording(formData)} mailing address`,
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
      ({ formData }) => `${applicantWording(formData)} contact information`,
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
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload birth certificate',
      ({ formData }) => (
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
      ),
    ),
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

const applicantAdoptedConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.adoptionCert,
  'adoption papers',
);

const applicantAdoptionUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload adoption documents',
      ({ formData }) => (
        <>
          To help us process this application faster, submit a copy of{' '}
          <b className="dd-privacy-hidden">
            {applicantWording(formData, true, false)}
          </b>{' '}
          adoption documents.
          <br />
          Submitting a copy can help us process this application faster.
          <br />
          {MAIL_OR_FAX_LATER_MSG}
        </>
      ),
    ),
    ...applicantAdoptedConfig.uiSchema,
    applicantAdoptionPapers: fileUploadUI({
      label: 'Upload a copy of adoption documents',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      ...applicantAdoptedConfig.schema,
      applicantAdoptionPapers: fileWithMetadataSchema(
        acceptableFiles.adoptionCert,
      ),
    },
  },
};

const applicantStepChildConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.stepCert,
  'marriage certificates',
);

const applicantStepChildUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload parental marriage documents',
      ({ formData }) => (
        <>
          To help us process this application faster, submit a copy of{' '}
          <b className="dd-privacy-hidden">
            {applicantWording(formData, true, false)}
          </b>{' '}
          parental marriage documents.
          <br />
          Submitting a copy can help us process this application faster.
          <br />
          {MAIL_OR_FAX_LATER_MSG}
        </>
      ),
    ),
    ...applicantStepChildConfig.uiSchema,
    applicantStepMarriageCert: fileUploadUI({
      label: 'Upload a copy of parental marriage documents',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      ...applicantStepChildConfig.schema,
      applicantStepMarriageCert: fileWithMetadataSchema(
        acceptableFiles.stepCert,
      ),
    },
  },
};

const applicantSchoolCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.schoolCert,
  'school certifications',
);

const applicantSchoolCertUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload school documents',
      ({ formData }) => (
        <>
          To help us process this application faster, submit a copy of{' '}
          <b className="dd-privacy-hidden">
            {applicantWording(formData, true, false)}
          </b>{' '}
          school documents.
          <br />
          Submitting a copy can help us process this application faster.
          <br />
          {MAIL_OR_FAX_LATER_MSG}
        </>
      ),
    ),
    ...applicantSchoolCertConfig.uiSchema,
    applicantSchoolCert: fileUploadUI({
      label: 'Upload proof of school enrollment',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      ...applicantSchoolCertConfig.schema,
      applicantSchoolCert: fileWithMetadataSchema(acceptableFiles.schoolCert),
    },
  },
};

const applicantHelplessChildConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.helplessCert,
  'VBA decision rating',
);

const applicantHelplessChildUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload helpless child documents',
      ({ formData }) => (
        <>
          To help us process this application faster, submit a copy of{' '}
          <b className="dd-privacy-hidden">
            {applicantWording(formData, true, false)}
          </b>{' '}
          helpless child documents.
          <br />
          Submitting a copy can help us process this application faster.
          <br />
          {MAIL_OR_FAX_LATER_MSG}
        </>
      ),
    ),
    ...applicantHelplessChildConfig.uiSchema,
    applicantHelplessCert: fileUploadUI({
      label: 'Upload proof of helpless child status',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      ...applicantHelplessChildConfig.schema,
      applicantHelplessCert: fileWithMetadataSchema(
        acceptableFiles.helplessCert,
      ),
    },
  },
};

const applicantDependentStatusPage = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      'ui:description': blankSchema,
      applicantDependentStatus: {
        type: 'object',
        properties: {
          status: radioSchema([
            'enrolled',
            'intendsToEnroll',
            'over18HelplessChild',
          ]),
          _unused: { type: 'string' },
        },
      },
    },
    required: ['applicantDependentStatus'],
  },
};

const applicantMarriageDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${applicantWording(formData)} date of marriage to the sponsor`,
      'If you don’t know the exact date, enter your best guess',
    ),
    dateOfMarriageToSponsor: currentOrPastDateUI(),
  },
  schema: {
    type: 'object',
    properties: {
      dateOfMarriageToSponsor: currentOrPastDateSchema,
    },
    required: ['dateOfMarriageToSponsor'],
  },
};

const applicantMarriageCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.spouseCert,
  'marriage certificates',
);

const applicantMarriageCertUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload marriage documents',
      ({ formData }) => (
        <>
          To help us process this application faster, submit a copy of{' '}
          <b className="dd-privacy-hidden">
            {applicantWording(formData, true, false)}
          </b>{' '}
          marriage documents.
          <br />
          Submitting a copy can help us process this application faster.
          <br />
          {MAIL_OR_FAX_LATER_MSG}
        </>
      ),
    ),
    ...applicantMarriageCertConfig.uiSchema,
    applicantRemarriageCert: fileUploadUI({
      label: 'Upload proof of marriage or legal union',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
      ...applicantMarriageCertConfig.schema,
      applicantRemarriageCert: fileWithMetadataSchema(
        acceptableFiles.spouseCert,
      ),
    },
  },
};

const applicantMedicareStatusPage = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      applicantMedicareStatus: {
        type: 'object',
        properties: {
          eligibility: { type: 'string' },
          _unused: { type: 'string' },
        },
      },
    },
    required: ['applicantMedicareStatus'],
  },
};

const applicantMedicarePartDStatusPage = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      applicantMedicarePartD: {
        type: 'object',
        properties: {
          enrollment: { type: 'string' },
          otherEnrollment: { type: 'string' },
        },
      },
    },
    required: ['applicantMedicarePartD'],
  },
};

const applicantOhiStatusPage = {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      applicantHasOhi: {
        type: 'object',
        properties: {
          hasOhi: { type: 'string' },
          _unused: { type: 'string' },
        },
      },
    },
    required: ['applicantHasOhi'],
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
      ...applicantBirthCertUploadPage,
    }),
    page18d: pageBuilder.itemPage({
      path: 'applicant-child-adoption-file/:index',
      title: item => `${applicantWording(item)} adoption documents`,
      depends: (formData, index) => {
        if (index === undefined) return true;
        return (
          get(
            'applicantRelationshipToSponsor.relationshipToVeteran',
            formData?.applicants?.[index],
          ) === 'child' &&
          get(
            'applicantRelationshipOrigin.relationshipToVeteran',
            formData?.applicants?.[index],
          ) === 'adoption'
        );
      },
      CustomPage: FileFieldCustom,
      ...applicantAdoptionUploadPage,
    }),
    page18e: pageBuilder.itemPage({
      path: 'applicant-child-marriage-file/:index',
      title: item => `${applicantWording(item)} parental marriage documents`,
      depends: (formData, index) => {
        if (index === undefined) return true;
        return (
          get(
            'applicantRelationshipToSponsor.relationshipToVeteran',
            formData?.applicants?.[index],
          ) === 'child' &&
          get(
            'applicantRelationshipOrigin.relationshipToVeteran',
            formData?.applicants?.[index],
          ) === 'step'
        );
      },
      CustomPage: FileFieldCustom,
      ...applicantStepChildUploadPage,
    }),
    page18b1: pageBuilder.itemPage({
      path: 'applicant-dependent-status/:index',
      title: item => `${applicantWording(item)} dependent status`,
      depends: (formData, index) => {
        if (index === undefined) return true;
        return (
          formData.applicants[index]?.applicantRelationshipToSponsor
            ?.relationshipToVeteran === 'child' &&
          isInRange(
            getAgeInYears(formData.applicants[index]?.applicantDob),
            18,
            23,
          )
        );
      },
      CustomPage: ApplicantDependentStatusPage,
      ...applicantDependentStatusPage,
    }),
    page18b: pageBuilder.itemPage({
      path: 'applicant-child-school-upload/:index',
      title: item => `${applicantWording(item)} school documents`,
      depends: (formData, index) => {
        if (index === undefined) return true;
        return (
          formData.applicants[index]?.applicantRelationshipToSponsor
            ?.relationshipToVeteran === 'child' &&
          isInRange(
            getAgeInYears(formData.applicants[index]?.applicantDob),
            18,
            23,
          ) &&
          ['enrolled', 'intendsToEnroll'].includes(
            formData.applicants[index]?.applicantDependentStatus?.status,
          )
        );
      },
      CustomPage: FileFieldCustom,
      ...applicantSchoolCertUploadPage,
    }),
    page18b2: pageBuilder.itemPage({
      path: 'applicant-dependent-upload/:index',
      title: item => `${applicantWording(item)} helpless child documents`,
      depends: (formData, index) => {
        if (index === undefined) return true;
        return (
          formData.applicants[index]?.applicantRelationshipToSponsor
            ?.relationshipToVeteran === 'child' &&
          getAgeInYears(formData.applicants[index]?.applicantDob) >= 18 &&
          formData.applicants[index]?.applicantDependentStatus?.status ===
            'over18HelplessChild'
        );
      },
      CustomPage: FileFieldCustom,
      ...applicantHelplessChildUploadPage,
    }),
    page18f3: pageBuilder.itemPage({
      path: 'applicant-marriage-date/:index',
      title: item => `${applicantWording(item)} marriage dates`,
      depends: (formData, index) => {
        if (index === undefined) return true;
        return depends18f3(formData, index);
      },
      ...applicantMarriageDatesPage,
    }),
    page18f: pageBuilder.itemPage({
      path: 'applicant-marriage-upload/:index',
      title: item => `${applicantWording(item)} marriage documents`,
      depends: (formData, index) => {
        if (index === undefined) return true;
        return (
          get(
            'applicantRelationshipToSponsor.relationshipToVeteran',
            formData?.applicants?.[index],
          ) === 'spouse' && get('sponsorIsDeceased', formData)
        );
      },
      CustomPage: FileFieldCustom,
      ...applicantMarriageCertUploadPage,
    }),
    page19: pageBuilder.itemPage({
      path: 'applicant-medicare/:index',
      title: item => `${applicantWording(item)} Medicare Part A and B status`,
      ...applicantMedicareStatusPage,
      CustomPage: ApplicantMedicareStatusPage,
    }),
    page20: pageBuilder.itemPage({
      path: 'applicant-medicare-continued/:index',
      title: item => `${applicantWording(item)} Medicare Part D status`,
      depends: (formData, index) => {
        if (index === undefined) return true;
        return (
          get(
            'applicantMedicareStatus.eligibility',
            formData?.applicants?.[index],
          ) === 'enrolled'
        );
      },
      ...applicantMedicarePartDStatusPage,
      CustomPage: ApplicantMedicareStatusContinuedPage,
    }),
    page21: pageBuilder.itemPage({
      path: 'applicant-other-insurance-status/:index',
      title: item => `${applicantWording(item)} other health insurance status`,
      ...applicantOhiStatusPage,
      CustomPage: ApplicantOhiStatusPage,
    }),
  }),
);
