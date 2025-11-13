import React from 'react';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { capitalize } from 'lodash';
import {
  addressUI,
  addressSchema,
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
import { APPLICANTS_MAX } from '../constants';

import { acceptableFiles } from '../../10-10D/components/Sponsor/sponsorFileUploads';
import { isInRange } from '../../10-10D/helpers/utilities';
import { ApplicantDependentStatusPage } from '../../10-10D/pages/ApplicantDependentStatus';
import AddressSelectionPage, {
  NOT_SHARED,
} from '../components/FormPages/AddressSelectionPage';
import CustomPrefillMessage from '../components/CustomPrefillAlert';
import sectionOverview from './applicantInformation/sectionOverview';
import personalInformation from './applicantInformation/personalInformation';
import remarriageProof from './applicantInformation/remarriageProof';
import schoolEnrollmentProof from './applicantInformation/schoolEnrollmentProof';
import marriageDate from './applicantInformation/marriageDate';
import stepchildMarriageProof from './applicantInformation/stepchildMarriageProof';
import { validateApplicant } from '../helpers/validations';

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
  isItemIncomplete: validateApplicant,
  maxItems: APPLICANTS_MAX,
  text: {
    getItemName: item => applicantWording(item, false, true, false),
    cardDescription: item => (
      <ul className="no-bullets">
        <li>
          <b>Date of birth:</b>{' '}
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
          'Address is on a military base outside the United States.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      applicantAddress: addressSchema({ omit: ['street3'] }),
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
        const txt = `We’ll use this information to contact ${applicantWording(
          formData,
          false,
          false,
          true,
        )} if we have any questions about this application.`;
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
          <span className="dd-privacy-hidden">
            {nameWording(tmpFormData, true, false)}
          </span>
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
      label: 'Upload copy of birth certificate',
      attachmentId: 'Birth certificate',
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
          <span className="dd-privacy-hidden">
            {applicantWording(formData, true, false)}
          </span>{' '}
          adoption (like court ordered adoption papers).
        </>
      ),
    ),
    ...fileUploadBlurbCustom(),
    applicantAdoptionPapers: fileUploadUI({
      label: 'Upload a copy of adoption documents',
      attachmentId: 'Court ordered adoption papers',
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
      path: 'applicant-information-overview',
      title: '[noun plural]',
      ...sectionOverview,
    }),
    applicantSummary: pageBuilder.summaryPage({
      path: 'review-applicants',
      title: 'Review applicants',
      ...applicantSummaryPage,
    }),
    page13: pageBuilder.itemPage({
      path: 'applicant-name-and-date-of-birth/:index',
      title: 'Applicant name and date of birth',
      ...personalInformation,
    }),
    page14: pageBuilder.itemPage({
      path: 'applicant-social-security-number/:index',
      title: 'Identification',
      CustomPage: CustomApplicantSSNPage,
      CustomPageReview: null,
      ...applicantIdentificationPage,
    }),
    page15a: pageBuilder.itemPage({
      path: 'applicant-address/:index',
      title: 'Address selection',
      ...applicantAddressSelectionPage,
      CustomPage: props => {
        const opts = { ...props, dataKey: 'applicantAddress' };
        return AddressSelectionPage(opts);
      },
      depends: (formData, index) => page15aDepends(formData, index),
    }),
    page15: pageBuilder.itemPage({
      path: 'applicant-mailing-address/:index',
      title: 'Mailing address',
      depends: (formData, index) =>
        get('view:sharesAddressWith', formData.applicants?.[index]) ===
        NOT_SHARED,
      ...applicantMailingAddressPage,
    }),
    page16: pageBuilder.itemPage({
      path: 'applicant-contact-information/:index',
      title: 'Contact information',
      ...applicantContactInfoPage,
    }),
    page17: pageBuilder.itemPage({
      path: 'applicant-birth-sex/:index',
      title: 'Applicant sex listed at birth',
      ...applicantGenderPage,
      CustomPage: ApplicantGenderPage,
    }),
    page18: pageBuilder.itemPage({
      path: 'applicant-relationship-to-veteran/:index',
      title: item =>
        `What's ${applicantWording(item)} relationship to the Veteran`,
      ...applicantRelationshipPage,
      CustomPage: props =>
        ApplicantRelationshipPage({
          ...props,
          customWording: {
            customHint:
              'Depending on your response, you may need to submit proof of marriage or dependent status.',
          },
        }),
    }),
    page18c: pageBuilder.itemPage({
      path: 'applicant-dependent-status/:index',
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
      path: 'applicant-birth-certificate/:index',
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
      path: 'applicant-adoption-documents/:index',
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
      path: 'applicant-proof-of-marriage-or-legal-union/:index',
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
      ...stepchildMarriageProof,
    }),
    page18b1: pageBuilder.itemPage({
      path: 'applicant-dependent-status-details/:index',
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
      path: 'applicant-proof-of-school-enrollment/:index',
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
      ...schoolEnrollmentProof,
    }),
    page18f3: pageBuilder.itemPage({
      path: 'applicant-marriage-dates/:index',
      title: item => `${applicantWording(item)} marriage dates`,
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'spouse',
      ...marriageDate,
    }),
    page18f4: pageBuilder.itemPage({
      path: 'applicant-marriage-status/:index',
      title: 'Marriage status',
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'spouse' && get('sponsorIsDeceased', formData),
      ...applicantRemarriedPage,
    }),
    page18g: pageBuilder.itemPage({
      path: 'applicant-proof-of-remarriage/:index',
      title: 'Upload proof of remarriage',
      depends: (formData, index) =>
        get(
          'applicantRelationshipToSponsor.relationshipToVeteran',
          formData?.applicants?.[index],
        ) === 'spouse' &&
        get('sponsorIsDeceased', formData) &&
        get('applicantRemarried', formData?.applicants?.[index]),
      CustomPage: FileFieldCustom,
      ...remarriageProof,
    }),
  }),
);
