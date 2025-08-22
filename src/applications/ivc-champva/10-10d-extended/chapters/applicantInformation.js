import React from 'react';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { cloneDeep, capitalize } from 'lodash';
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
import { CustomApplicantSSNPage } from '../../shared/components/CustomApplicantSSNPage';
import { validateApplicantSsnIsUnique } from '../../shared/validations';

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
  nameWording,
  getAgeInYears,
  fmtDate,
} from '../../shared/utilities';

import { ApplicantRelOriginPage } from './ApplicantRelOriginPage';
import { ApplicantGenderPage } from './ApplicantGenderPage';
import { page15aDepends } from '../helpers/utilities';
import { MAX_APPLICANTS } from '../constants';

import {
  // TODO: convert to standard file upload.
  acceptableFiles,
} from '../../10-10D/components/Sponsor/sponsorFileUploads';
import { isInRange } from '../../10-10D/helpers/utilities';
import { ApplicantDependentStatusPage } from '../../10-10D/pages/ApplicantDependentStatus';

import CustomPrefillMessage from '../components/CustomPrefillAlert';

import { validateMarriageAfterDob } from '../helpers/validations';
/*
// TODO: re-add this custom validation + the same for normal text fields
import { applicantAddressCleanValidation } from '../../shared/validations';
*/

// import mockData from '../tests/e2e/fixtures/data/maximal-test.json';

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
  return withEditTitle(title, false)(title);
}

export const applicantOptions = {
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
      item.applicantRelationshipToSponsor
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
          <b>Relationship to Veteran:</b>{' '}
          {capitalize(
            item?.applicantRelationshipToSponsor?.relationshipToVeteran !==
            'other'
              ? item?.applicantRelationshipToSponsor?.relationshipToVeteran
              : item?.applicantRelationshipToSponsor
                  ?.otherRelationshipToVeteran,
          )}
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
              Enter this information for each applicant you’re applying for.
            </p>
            {CustomPrefillMessage(formData, 'applicant')}
          </>
        ) : (
          <p>Enter this information for each applicant you’re applying for.</p>
        );
      },
    ),
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
      '',
      false,
    ),
    applicantSSN: ssnUI(),
    'ui:validations': [validateApplicantSsnIsUnique],
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

const applicantBirthCertUploadPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Upload birth certificate',
      ({ formData, formContext }) => {
        const index = +formContext?.pagePerItemIndex; // NaN if not present
        // since we don't have the standard access to full form data here,
        // make use of the previously added `view:certifierRole` property.
        const tmpFormData = {
          ...formData,
          /*
          If idx is 0, we want to take certifier role into account. Otherwise not
          because we consistently assume that if the certifier is an applicant
          then they will be the first applicant. All other cases we should use 
          third person addressing.
          */
          certifierRole: index === 0 ? formData?.['view:certifierRole'] : '',
        };
        const posessiveName = (
          <b className="dd-privacy-hidden">
            {nameWording(tmpFormData, true, false)}
          </b>
        );

        return (
          <p>
            You’ll need to submit a copy of {posessiveName} birth certificate.
          </p>
        );
      },
    ),
    ...fileUploadBlurbCustom(),
    applicantBirthCertOrSocialSecCard: fileUploadUI({
      label: 'Upload a copy of birth certificate',
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantBirthCertOrSocialSecCard'],
    properties: {
      'view:fileUploadBlurb': blankSchema,
      applicantBirthCertOrSocialSecCard: {
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
          Veteran and{' '}
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
      ({ formData, formContext }) => {
        const index = +formContext?.pagePerItemIndex; // NaN if not present
        // since we don't have the standard access to full form data here,
        // make use of the previously added `view:certifierRole` property.
        const tmpFormData = {
          ...formData,
          certifierRole: formData?.['view:certifierRole'],
        };
        // Calls the appropriate name getter depending on current list item index.
        // First applicant is assumed to be the certifier if certifierRole === 'applicant'.
        const getNameFn = posessive =>
          index === 0
            ? nameWording(tmpFormData, posessive, false)
            : // formData doesn't need certifier role for applicantWording
              applicantWording(formData, posessive, false);

        const posessiveName = (
          <b className="dd-privacy-hidden">{getNameFn(true)}</b>
        );
        const nonPosessiveName = (
          <b className="dd-privacy-hidden">{getNameFn(false)}</b>
        );
        const nameBeingVerb =
          tmpFormData?.certifierRole === 'applicant' ? (
            'you’re'
          ) : (
            <>
              <b className="dd-privacy-hidden">{nonPosessiveName}</b> is
            </>
          );
        return (
          <>
            <p>
              <b>If {nameBeingVerb} already enrolled in school</b>
            </p>
            <p>You’ll need to submit a letter on the school’s letterhead.</p>
            <p>
              Ask the school to write us a letter on school letterhead that
              includes all of these pieces of information:
            </p>
            <ul>
              <li>{posessiveName} first and last name</li>
              <li>
                The last 4 digits of {posessiveName} Social Security number
              </li>
              <li>
                The start and end dates for each semester or enrollment term
              </li>
              <li>Enrollment status (full-time or part-time)</li>
              <li>Expected graduation date</li>
              <li>
                Signature and title of a school official (like a director or
                principal)
              </li>
            </ul>
            <p>
              <b>If {nameBeingVerb} planning to enroll</b>
            </p>
            <p>
              Submit a copy of {posessiveName} acceptance letter from the
              school.
            </p>
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
        `${applicantWording(formData)} date of marriage to the Veteran`,
      'If you don’t know the exact date, enter your best guess. We won’t need the marriage certificate unless we can’t find a record of the marriage in our system when the form is processed.',
      false,
    ),
    dateOfMarriageToSponsor: currentOrPastDateUI('Date of marriage'),
    'ui:validations': [validateMarriageAfterDob],
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
      '',
      false,
    ),
    applicantRemarried: {
      ...yesNoUI({
        title: 'Has this applicant remarried?',
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
          the Veteran, you can help us process your application faster by
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
      path: 'applicant-information/overview',
      title: '[noun plural]',
      // initialData: mockData.data,
      uiSchema: {
        ...titleUI(
          'Add applicants',
          <>
            Next we’ll ask you for information about the applicant. The
            applicant is the person who needs the CHAMPVA benefit.
            <br />
            We’ll ask for the applicant’s Social Security number, mailing
            address, contact information, and relationship to the Veteran.
            <br />
            <br />
            {/* TODO: use constant for this value */}
            You can add up to 25 applicants.
          </>,
        ),
      },
      schema: {
        type: 'object',
        properties: {},
      },
    }),
    applicantSummary: pageBuilder.summaryPage({
      path: 'applicant-information/summary',
      title: 'Review your applicants',
      uiSchema: applicantSummaryPage.uiSchema,
      schema: applicantSummaryPage.schema,
    }),
    page13: pageBuilder.itemPage({
      path: 'applicant-information/:index/name-and-date-of-birth',
      title: 'Applicant name and date of birth',
      ...applicantIntroPage,
    }),
    page14: pageBuilder.itemPage({
      path: 'applicant-information/:index/social-security-number',
      title: 'Identification',
      CustomPage: CustomApplicantSSNPage,
      CustomPageReview: null,
      ...applicantIdentificationPage,
    }),
    page15a: pageBuilder.itemPage({
      path: 'applicant-information/:index/address',
      title: 'Address selection',
      ...applicantAddressSelectionPage,
      CustomPage: ApplicantAddressCopyPage,
      depends: (formData, index) => page15aDepends(formData, index),
    }),
    page15: pageBuilder.itemPage({
      path: 'applicant-information/:index/mailing-address',
      title: 'Mailing address',
      ...applicantMailingAddressPage,
    }),
    page16: pageBuilder.itemPage({
      path: 'applicant-information/:index/contact-information',
      title: 'Contact information',
      ...applicantContactInfoPage,
    }),
    page17: pageBuilder.itemPage({
      path: 'applicant-information/:index/birth-sex',
      title: 'Applicant sex listed at birth',
      ...applicantGenderPage,
      CustomPage: ApplicantGenderPage,
    }),
    page18: pageBuilder.itemPage({
      path: 'applicant-information/:index/relationship-to-veteran',
      title: item =>
        `What's ${applicantWording(item)} relationship to the Veteran`,
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
      path: 'applicant-information/:index/dependent-status',
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
      path: 'applicant-information/:index/birth-certificate',
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
      path: 'applicant-information/:index/adoption-documents',
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
      path: 'applicant-information/:index/proof-of-marriage-or-legal-union',
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
      path: 'applicant-information/:index/dependent-status-details',
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
      path: 'applicant-information/:index/proof-of-school-enrollment',
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
      path: 'applicant-information/:index/marriage-date',
      title: item => `${applicantWording(item)} marriage dates`,
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'spouse',
      ...applicantMarriageDatesPage,
    }),
    page18f4: pageBuilder.itemPage({
      path: 'applicant-information/:index/marriage-status',
      title: 'Marriage status',
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'spouse' && get('sponsorIsDeceased', formData),
      ...applicantRemarriedPage,
    }),
    page18g: pageBuilder.itemPage({
      path: 'applicant-information/:index/proof-of-remarriage',
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
  }),
);
