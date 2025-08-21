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
  withEditTitle,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  radioSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';

import { ApplicantAddressCopyPage } from '../../shared/components/applicantLists/ApplicantAddressPage';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import ApplicantRelationshipPage from '../../shared/components/applicantLists/ApplicantRelationshipPage';
import FileFieldCustom from '../../shared/components/fileUploads/FileUpload';
import {
  fileUploadBlurbCustom,
  fileWithMetadataSchema,
} from '../../shared/components/fileUploads/attachments';
import {
  applicantWording,
  getAgeInYears,
  fmtDate,
} from '../../shared/utilities';

import { ApplicantRelOriginPage } from './ApplicantRelOriginPage';
import { ApplicantGenderPage } from './ApplicantGenderPage';
import { page15aDepends } from '../helpers/utilities';
import { MAIL_OR_FAX_LATER_MSG, MAX_APPLICANTS } from '../constants';

import {
  // TODO: convert to standard file upload.
  uploadWithInfoComponent,
  acceptableFiles,
} from '../../10-10D/components/Sponsor/sponsorFileUploads';
import { isInRange } from '../../10-10D/helpers/utilities';
import { ApplicantDependentStatusPage } from '../../10-10D/pages/ApplicantDependentStatus';
import { ApplicantMedicareStatusPage } from '../../10-10D/pages/ApplicantMedicareStatusPage';
import { ApplicantMedicareStatusContinuedPage } from '../../10-10D/pages/ApplicantMedicareStatusContinuedPage';
import ApplicantOhiStatusPage from '../../10-10D/pages/ApplicantOhiStatusPage';

import CustomPrefillMessage from '../components/CustomPrefillAlert';

/*
// TODO: re-add this custom validation + the same for normal text fields
import { applicantAddressCleanValidation } from '../../shared/validations';
*/

// import mockData from '../tests/fixtures/data/test-data.json';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

/**
 * Wraps array builder function withEditTitle and calls the result
 * after passing in a custom title string. Result will be the string
 * + a prefix of "edit" if we're on an array builder edit page.
 * @param {string} title Title string to display on page
 * @returns
 */
function editTitleWrapper(title) {
  // Array builder helper `withEditTitle` returns a function, which we
  // always want to call, so just do that:
  return withEditTitle(title)(title);
}

const applicantOptions = {
  arrayPath: 'applicants',
  nounSingular: 'applicant',
  nounPlural: 'applicants',
  required: true,
  isItemIncomplete: item => {
    return !(
      item.applicantName?.first &&
      item.applicantDob &&
      item.applicantSSN &&
      item.applicantGender &&
      item.applicantPhone &&
      item.applicantAddress &&
      item.applicantRelationshipToSponsor &&
      item.applicantMedicareStatus &&
      item.applicantHasOhi
    );
  }, // TODO: include more required fields here
  maxItems: MAX_APPLICANTS,
  text: {
    getItemName: item => applicantWording(item, false, true, false),
    cardDescription: item => (
      <ul className="no-bullets">
        <li>
          <b>Date of Birth:</b>{' '}
          {item?.applicantDob ? fmtDate(item?.applicantDob) : ''}
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
    // Using standard titleUI so we can update the content based on certifierRole
    ...titleUI(
      () => editTitleWrapper('Applicant information'),
      ({ formData, formContext }) => {
        // Prefill message conditionally displays based on `certifierRole`
        return formContext.pagePerItemIndex === '0' ? (
          <>
            <p>
              Enter your information and the information for any other
              applicants you want to enroll in CHAMPVA benefits.
            </p>
            {CustomPrefillMessage(formData, 'applicant')}
          </>
        ) : (
          <p>Enter the information for the applicant you’re applying for.</p>
        );
      },
    ),
    applicantName: fullNameUI(),
    applicantDob: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
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
    ...titleUI(
      ({ formData }) => {
        const txt = `${applicantWording(formData)} mailing address`;
        return editTitleWrapper(txt);
      },
      ({ formData, formContext }) => {
        const txt =
          'We’ll send any important information about this application to this address.';
        // Prefill message conditionally displays based on `certifierRole`
        return formContext.pagePerItemIndex === '0' ? (
          <>
            {txt}
            <br />
            <br />
            {CustomPrefillMessage(formData, 'applicant')}
          </>
        ) : (
          txt
        );
      },
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
      titleSchema,
      applicantAddress: addressSchema(),
    },
    required: ['applicantAddress'],
  },
};

const applicantContactInfoPage = {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        editTitleWrapper(`${applicantWording(formData)} contact information`),
      ({ formData, formContext }) => {
        const txt = `We will use this information to contact ${applicantWording(
          formData,
          false,
          false,
          true,
        )} if we have more questions`;
        // Prefill message conditionally displays based on `certifierRole`
        return formContext.pagePerItemIndex === '0' ? (
          <>
            {txt}
            <br />
            <br />
            {CustomPrefillMessage(formData, 'applicant')}
          </>
        ) : (
          <>{txt}</>
        );
      },
    ),
    applicantPhone: phoneUI(),
    applicantEmailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      titleSchema,
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
    required: ['applicantBirthCertOrSocialSecCard'],
    properties: {
      titleSchema,
      ...applicantBirthCertConfig.schema,
      applicantBirthCertOrSocialSecCard: fileWithMetadataSchema(
        acceptableFiles.birthCert,
      ),
    },
  },
};

const applicantAdoptionUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload adoption documents',
      ({ formData }) => (
        <>
          You’ll need to submit a document showing proof of{' '}
          <b className="dd-privacy-hidden">
            {applicantWording(formData, true, false)}
          </b>{' '}
          adoption (like court ordered adoption papers).
        </>
      ),
    ),
    ...fileUploadBlurbCustom(),
    applicantAdoptionPapers: fileUploadUI({
      label: 'Upload a copy of adoption documents',
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantAdoptionPapers'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      applicantAdoptionPapers: fileWithMetadataSchema(
        acceptableFiles.adoptionCert,
      ),
    },
  },
};

const applicantStepChildUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload proof of parent’s marriage or legal union',
      ({ formData }) => (
        <>
          You’ll need to submit a document showing proof of the marriage or
          legal union between{' '}
          <b className="dd-privacy-hidden">
            {applicantWording(formData, true, false)}
          </b>{' '}
          sponsor and{' '}
          <b className="dd-privacy-hidden">
            {applicantWording(formData, true, false)}
          </b>{' '}
          parent.
          <br />
          <br />
          Upload a copy of one of these documents:
          <ul>
            <li>
              Marriage certificate, <b>or</b>
            </li>
            <li>
              A document showing proof of a civil union, <b>or</b>
            </li>
            <li>Common-law marriage affidavit</li>
          </ul>
        </>
      ),
    ),
    ...fileUploadBlurbCustom(),
    applicantStepMarriageCert: fileUploadUI({
      label: 'Upload proof of marriage or legal union',
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantStepMarriageCert'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      applicantStepMarriageCert: {
        type: 'array',
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

const applicantSchoolCertUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload proof of school enrollment',
      ({ formData }) => {
        const posessiveName = (
          <b className="dd-privacy-hidden">
            {applicantWording(formData, true, false)}
          </b>
        );
        const nonPosessiveName = (
          <b className="dd-privacy-hidden">
            {applicantWording(formData, false, false)}
          </b>
        );
        return (
          <>
            You’ll need to submit a copy of a document showing proof of{' '}
            {posessiveName} school enrollment. If {nonPosessiveName} is planning
            to enroll, you’ll need to upload a document showing information
            about {posessiveName} plan to enroll.
            <br />
            <br />
            Fill out a School Enrollment Certification Form.
            <br />
            <va-link
              href="https://www.va.gov/COMMUNITYCARE/docs/pubfiles/forms/School-Enrollment.pdf"
              text="Get school enrollment certification form to download"
            />
            <br />
            <br />
            Or you can submit an enrollment letter on the school’s letterhead.
            <br />
            Here’s what the letter should include:
            <ul>
              <li>{posessiveName} first and last name</li>
              <li>
                The last 4 digits of {posessiveName} Social Security number
              </li>
              <li>
                The start and end dates for each semester or enrollment term
              </li>
              <li>
                Signature and title of a school official (like a director or
                principal)
              </li>
            </ul>
            If {nonPosessiveName} is not enrolled, upload a copy of{' '}
            {posessiveName} acceptance letter from the school.
          </>
        );
      },
    ),
    ...fileUploadBlurbCustom(),
    applicantSchoolCert: fileUploadUI({
      label: 'Upload proof of school enrollment',
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantSchoolCert'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      applicantSchoolCert: fileWithMetadataSchema(acceptableFiles.schoolCert),
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
      'If you don’t know the exact date, enter your best guess. We won’t need the marriage certificate unless we can’t find a record of the marriage in our system.',
    ),
    dateOfMarriageToSponsor: currentOrPastDateUI('Date of marriage'),
  },
  schema: {
    type: 'object',
    properties: {
      dateOfMarriageToSponsor: currentOrPastDateSchema,
    },
    required: ['dateOfMarriageToSponsor'],
  },
};

const applicantRemarriedPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `${applicantWording(formData)} marriage status`,
    ),
    applicantRemarried: {
      ...yesNoUI({
        updateUiSchema: formData => {
          return {
            'ui:title': `Has ${applicantWording(formData, false)} remarried?`,
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantRemarried'],
    properties: {
      titleSchema,
      applicantRemarried: yesNoSchema,
    },
  },
};

const applicantReMarriageCertUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload proof of remarriage',
      ({ formData }) => (
        <>
          If {applicantWording(formData, false)} remarried after the death of
          the sponsor, you can help us process your application faster by
          submitting documents showing proof of that remarriage.
          <br />
          <br />
          Upload a copy of one of these documents:
          <ul>
            <li>
              Marriage certificate, <b>or</b>
            </li>
            <li>
              A document showing proof of a civil union, <b>or</b>
            </li>
            <li>Common-law marriage affidavit</li>
          </ul>
          <b>If the remarriage has ended,</b> upload a copy of one of these
          documents:
          <ul>
            <li>
              Divorce decree, <b>or</b>
            </li>
            <li>
              Annulment decree, <b>or</b>
            </li>
            <li>Death certificate</li>
          </ul>
        </>
      ),
    ),
    ...fileUploadBlurbCustom(
      <li key="final-bullet">You can upload more than one file here.</li>,
    ),
    applicantRemarriageCert: fileUploadUI({
      label: 'Upload proof of remarriage',
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantRemarriageCert'],
    properties: {
      titleSchema,
      'view:fileUploadBlurb': blankSchema,
      applicantRemarriageCert: {
        type: 'array',
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
      CustomPage: props =>
        ApplicantRelationshipPage({
          ...props,
          customWording: {
            customHint:
              'Depending on your response, you may need to submit proof of marriage or dependent status with this application.',
          },
        }),
    }),
    page18c: pageBuilder.itemPage({
      path: 'applicant-relationship-child/:index',
      title: item => `${applicantWording(item)} dependent status`,
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'child',
      ...applicantRelationshipOriginPage,
      CustomPage: ApplicantRelOriginPage,
    }),
    page18a: pageBuilder.itemPage({
      path: 'applicant-relationship-child-upload/:index',
      title: item => `${applicantWording(item)} birth certificate`,
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'child' &&
        (get(
          'applicantRelationshipOrigin.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'adoption' ||
          get(
            'applicantRelationshipOrigin.relationshipToVeteran',
            formData?.applicants?.[index],
          ) === 'step'),
      CustomPage: FileFieldCustom,
      ...applicantBirthCertUploadPage,
    }),
    page18d: pageBuilder.itemPage({
      path: 'applicant-child-adoption-file/:index',
      title: item => `${applicantWording(item)} adoption documents`,
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'child' &&
        get(
          'applicantRelationshipOrigin.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'adoption',
      CustomPage: FileFieldCustom,
      ...applicantAdoptionUploadPage,
    }),
    page18e: pageBuilder.itemPage({
      path: 'applicant-child-marriage-file/:index',
      title: 'Upload proof of parent’s marriage or legal union',
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'child' &&
        get(
          'applicantRelationshipOrigin.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'step',
      CustomPage: FileFieldCustom,
      ...applicantStepChildUploadPage,
    }),
    page18b1: pageBuilder.itemPage({
      path: 'applicant-dependent-status/:index',
      title: item => `${applicantWording(item)} dependent status`,
      depends: (formData, index) =>
        formData.applicants[index]?.applicantRelationshipToSponsor
          ?.relationshipToVeteran === 'child' &&
        isInRange(
          getAgeInYears(formData.applicants[index]?.applicantDob),
          18,
          23,
        ),
      CustomPage: ApplicantDependentStatusPage,
      ...applicantDependentStatusPage,
    }),
    page18b: pageBuilder.itemPage({
      path: 'applicant-child-school-upload/:index',
      title: item => `${applicantWording(item)} school documents`,
      depends: (formData, index) =>
        formData.applicants[index]?.applicantRelationshipToSponsor
          ?.relationshipToVeteran === 'child' &&
        isInRange(
          getAgeInYears(formData.applicants[index]?.applicantDob),
          18,
          23,
        ) &&
        ['enrolled', 'intendsToEnroll'].includes(
          formData.applicants[index]?.applicantDependentStatus?.status,
        ),
      CustomPage: FileFieldCustom,
      ...applicantSchoolCertUploadPage,
    }),
    page18f3: pageBuilder.itemPage({
      path: 'applicant-marriage-date/:index',
      title: item => `${applicantWording(item)} marriage dates`,
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'spouse',
      ...applicantMarriageDatesPage,
    }),
    page18f4: pageBuilder.itemPage({
      path: 'applicant-remarried/:index',
      title: 'Marriage status',
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'spouse' && get('sponsorIsDeceased', formData),
      ...applicantRemarriedPage,
    }),
    page18g: pageBuilder.itemPage({
      path: 'applicant-remarriage-upload/:index',
      title: 'Upload proof of remarriage',
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'spouse' &&
        get('sponsorIsDeceased', formData) &&
        get('applicantRemarried', formData?.applicants?.[index]),
      CustomPage: FileFieldCustom,
      ...applicantReMarriageCertUploadPage,
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
      depends: (formData, index) =>
        get(
          'applicantMedicareStatus.eligibility',
          formData?.applicants?.[index],
        ) === 'enrolled',
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
