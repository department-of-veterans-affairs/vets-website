import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import React from 'react';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
  fullNameSchema,
  fullNameUI,
  ssnOrVaFileNumberSchema,
  addressSchema,
  addressUI,
  phoneSchema,
  phoneUI,
  emailSchema,
  emailUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  dateOfDeathSchema,
  dateOfDeathUI,
  yesNoSchema,
  yesNoUI,
  radioSchema,
  radioUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import SubmissionError from '../../shared/components/SubmissionError';
import CustomPrefillMessage from '../components/CustomPrefillAlert';
// import { fileUploadUi as fileUploadUI } from '../components/File/upload';

import { ssnOrVaFileNumberCustomUI } from '../components/CustomSsnPattern';

import transformForSubmit from './submitTransformer';
import prefillTransformer from './prefillTransformer';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  isInRange,
  onReviewPage,
  applicantListSchema,
  sponsorWording,
  page15aDepends,
} from '../helpers/utilities';
import {
  certifierNameValidation,
  certifierAddressValidation,
} from '../helpers/validations';
import { ADDITIONAL_FILES_HINT } from './constants';
import { applicantWording, getAgeInYears } from '../../shared/utilities';
import { sponsorNameDobConfig } from '../pages/Sponsor/sponsorInfoConfig';
import { acceptableFiles } from '../components/Sponsor/sponsorFileUploads';
import {
  applicantBirthCertConfig,
  applicantSchoolCertConfig,
  applicantSchoolCertUploadUiSchema,
  applicantHelplessChildConfig,
  applicantHelplessChildUploadUiSchema,
  applicantAdoptedConfig,
  applicantStepChildConfig,
  applicantMedicarePartAPartBCardsConfig,
  applicantMedicarePartDCardsConfig,
  appMedicareOver65IneligibleConfig,
  applicantOhiCardsConfig,
  applicantOtherInsuranceCertificationConfig,
  applicantBirthCertUploadUiSchema,
  applicantAdoptedUploadUiSchema,
  applicantStepChildUploadUiSchema,
  applicantRemarriageCertUploadUiSchema,
  applicantMedicarePartAPartBCardsUploadUiSchema,
  applicantMedicarePartDCardsUploadUiSchema,
  appMedicareOver65IneligibleUploadUiSchema,
  applicantOhiCardsUploadUiSchema,
  applicantOtherInsuranceCertificationUploadUiSchema,
} from '../components/Applicant/applicantFileUpload';
import GetFormHelp from '../../shared/components/GetFormHelp';

import {
  ApplicantMedicareStatusPage,
  ApplicantMedicareStatusReviewPage,
} from '../pages/ApplicantMedicareStatusPage';
import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';
import {
  ApplicantMedicareStatusContinuedPage,
  ApplicantMedicareStatusContinuedReviewPage,
} from '../pages/ApplicantMedicareStatusContinuedPage';
import ApplicantOhiStatusPage, {
  ApplicantOhiStatusReviewPage,
} from '../pages/ApplicantOhiStatusPage';
import SupportingDocumentsPage from '../pages/SupportingDocumentsPage';
import { MissingFileConsentPage } from '../pages/MissingFileConsentPage';
import {
  ApplicantRelOriginPage,
  ApplicantRelOriginReviewPage,
} from '../pages/ApplicantRelOriginPage';
import {
  ApplicantGenderPage,
  ApplicantGenderReviewPage,
} from '../pages/ApplicantGenderPage';
import {
  ApplicantDependentStatusPage,
  ApplicantDependentStatusReviewPage,
} from '../pages/ApplicantDependentStatus';
import {
  marriageDatesSchema,
  depends18f3,
} from '../pages/ApplicantSponsorMarriageDetailsPage';
import { ApplicantAddressCopyPage } from '../../shared/components/applicantLists/ApplicantAddressPage';
import {
  signerContactInfoPage,
  SignerContactInfoPage,
} from '../pages/SignerContactInfoPage';

import { hasReq } from '../../shared/components/fileUploads/MissingFileOverview';
import { fileWithMetadataSchema } from '../../shared/components/fileUploads/attachments';

// import mockData from '../tests/e2e/fixtures/data/test-data.json';
import FileFieldWrapped from '../components/FileUploadWrapper';

// Control whether we show the file overview page by calling `hasReq` to
// determine if any required files have not been uploaded
function showFileOverviewPage(formData) {
  try {
    return (
      hasReq(formData.applicants, true, true) || hasReq(formData, true, true)
    );
  } catch {
    return false;
  }
}

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit,
  showReviewErrors: true, // May want to hide in prod later, but for now keeping in due to complexity of this form
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  footerContent: GetFormHelp,
  // submit: () =>
  // Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-10D-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: _formData => 'certifierName',
    },
  },
  submissionError: SubmissionError,
  formId: '10-10D',
  dev: {
    showNavLinks: false,
    collapsibleNavLinks: true,
  },
  downtime: {
    dependencies: [externalServices.pega],
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your CHAMPVA benefits application (10-10D) is in progress.',
      expired:
        'Your saved CHAMPVA benefits application (10-10D) has expired. If you want to apply for CHAMPVA benefits, please start a new application.',
      saved: 'Your CHAMPVA benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for CHAMPVA benefits.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA benefits.',
  },
  title: 'Apply for CHAMPVA benefits',
  subTitle: 'Application for CHAMPVA benefits (VA Form 10-10d)',
  defaultDefinitions: {},
  chapters: {
    certifierInformation: {
      title: 'Signer information',
      pages: {
        page1: {
          // initialData: mockData.data,
          path: 'signer-type',
          title: 'Which of these best describes you?',
          uiSchema: {
            ...titleUI('Your information'),
            certifierRole: radioUI({
              title: 'Which of these best describes you?',
              required: () => true,
              labels: {
                applicant: 'I’m applying for benefits for myself',
                sponsor:
                  'I’m a Veteran applying for benefits for my spouse or dependents',
                other:
                  'I’m a representative applying for benefits on behalf of someone else',
              },
              // Changing this data on review messes up the ad hoc prefill
              // mapping of certifier -> applicant|sponsor:
              hideOnReview: true,
            }),
          },
          schema: {
            type: 'object',
            required: ['certifierRole'],
            properties: {
              titleSchema,
              certifierRole: radioSchema(['applicant', 'sponsor', 'other']),
            },
          },
        },
        page2: {
          // initialData: mockData.data,
          path: 'signer-info',
          title: 'Certification',
          uiSchema: {
            ...titleUI('Your name'),
            certifierName: fullNameUI(),
            'ui:validations': [certifierNameValidation],
          },
          schema: {
            type: 'object',
            required: ['certifierName'],
            properties: {
              titleSchema,
              certifierName: fullNameSchema,
            },
          },
        },
        page3: {
          path: 'signer-mailing-address',
          title: 'Certification',
          uiSchema: {
            ...titleUI(
              'Your mailing address',
              'We’ll send any important information about this application to your address',
            ),
            certifierAddress: addressUI(),
            'ui:validations': [certifierAddressValidation],
          },
          schema: {
            type: 'object',
            required: ['certifierAddress'],
            properties: {
              titleSchema,
              certifierAddress: addressSchema(),
            },
          },
        },
        page4: {
          path: 'signer-contact-info',
          title: 'Certification',
          CustomPage: SignerContactInfoPage,
          CustomPageReview: null,
          ...signerContactInfoPage,
        },
        page5: {
          path: 'signer-relationship',
          title: 'Certification',
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: {
            ...titleUI('Your relationship to the applicant'),
            certifierRelationship: {
              relationshipToVeteran: checkboxGroupUI({
                title: 'Which of these best describes you?',
                hint:
                  'If you’re applying on behalf of multiple applicants, you can select all applicable options',
                required: () => true,
                labels: {
                  spouse: 'I’m an applicant’s spouse',
                  child: 'I’m an applicant’s child',
                  parent: 'I’m an applicant’s parent',
                  thirdParty:
                    'I’m a third-party representative who isn’t a family member',
                  other: 'My relationship is not listed',
                },
              }),
              otherRelationshipToVeteran: {
                'ui:title':
                  'Since your relationship with the applicant was not listed, please describe it here',
                'ui:webComponentField': VaTextInputField,
                'ui:options': {
                  expandUnder: 'relationshipToVeteran',
                  expandUnderCondition: 'other',
                  expandedContentFocus: true,
                },
                'ui:errorMessages': {
                  required: 'Please enter your relationship to the applicant',
                },
              },
              'ui:options': {
                updateSchema: (formData, formSchema) => {
                  const fs = formSchema;
                  // If 'other', open the text field to specify:
                  if (
                    get(
                      'certifierRelationship.relationshipToVeteran.other',
                      formData,
                    )
                  )
                    fs.properties.otherRelationshipToVeteran[
                      'ui:collapsed'
                    ] = false;
                  if (
                    fs.properties.otherRelationshipToVeteran['ui:collapsed']
                  ) {
                    return {
                      ...fs,
                      required: ['relationshipToVeteran'],
                    };
                  }
                  return {
                    ...fs,
                    required: [
                      'relationshipToVeteran',
                      'otherRelationshipToVeteran',
                    ],
                  };
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['certifierRelationship'],
            properties: {
              titleSchema,
              certifierRelationship: {
                type: 'object',
                properties: {
                  relationshipToVeteran: checkboxGroupSchema([
                    'spouse',
                    'child',
                    'parent',
                    'thirdParty',
                    'other',
                  ]),
                  otherRelationshipToVeteran: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    sponsorInformation: {
      title: 'Sponsor information',
      pages: {
        page6: {
          path: 'sponsor-info',
          title: formData =>
            `${sponsorWording(formData)} name and date of birth`,
          uiSchema: sponsorNameDobConfig.uiSchema,
          schema: sponsorNameDobConfig.schema,
        },
        page7: {
          path: 'sponsor-identification-info',
          title: formData =>
            `${sponsorWording(formData)} identification information`,
          uiSchema: {
            ...titleUI(
              ({ formData }) =>
                `${sponsorWording(formData)} identification information`,
            ),
            ssn: ssnOrVaFileNumberCustomUI(),
          },
          schema: {
            type: 'object',
            required: ['ssn'],
            properties: {
              titleSchema,
              ssn: ssnOrVaFileNumberSchema,
            },
          },
        },
        page8: {
          path: 'sponsor-status',
          title: 'Sponsor status',
          depends: formData => get('certifierRole', formData) !== 'sponsor',
          uiSchema: {
            sponsorInfoTitle: titleUI(
              'Sponsor status',
              'Now we’ll ask you questions about the death of the sponsor (if they died). Fill this out to the best of your knowledge.',
            ),
            sponsorIsDeceased: yesNoUI({
              title: 'Has the sponsor died?',
              labels: {
                yes: 'Yes',
                no: 'No',
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['sponsorIsDeceased'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorIsDeceased: yesNoSchema,
            },
          },
        },
        page9: {
          path: 'sponsor-status-date',
          title: 'Sponsor status details',
          depends: formData =>
            get('certifierRole', formData) !== 'sponsor' &&
            get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: titleUI('Sponsor status details'),
            sponsorDOD: dateOfDeathUI('When did the sponsor die?'),
            sponsorDeathConditions: yesNoUI({
              title: 'Did sponsor die during active military service?',
              hint: ADDITIONAL_FILES_HINT,
              labels: {
                yes: 'Yes, sponsor passed away during active military service',
                no:
                  'No, sponsor did not pass away during active military service',
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['sponsorDOD', 'sponsorDeathConditions'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorDOD: dateOfDeathSchema,
              sponsorDeathConditions: yesNoSchema,
            },
          },
        },
        page10b1: {
          path: 'sponsor-mailing-address',
          title: formData => `${sponsorWording(formData)} mailing address`,
          depends: formData => !get('sponsorIsDeceased', formData),
          uiSchema: {
            ...titleUI(
              ({ formData }) => `${sponsorWording(formData)} mailing address`,
              ({ formData }) => (
                // Prefill message conditionally displays based on `certifierRole`
                <>
                  <p>
                    We’ll send any important information about this application
                    to this address.
                  </p>
                  {CustomPrefillMessage(formData, 'sponsor')}
                </>
              ),
            ),
            sponsorAddress: {
              ...addressUI({
                labels: {
                  militaryCheckbox:
                    'Address is on a U.S. military base outside of the United States.',
                },
              }),
            },
          },
          schema: {
            type: 'object',
            required: ['sponsorAddress'],
            properties: {
              titleSchema,
              sponsorAddress: addressSchema(),
            },
          },
        },
        page11: {
          path: 'sponsor-contact-info',
          title: formData => `${sponsorWording(formData)} contact information`,
          depends: formData => !get('sponsorIsDeceased', formData),
          uiSchema: {
            ...titleUI(
              ({ formData }) =>
                `${sponsorWording(formData)} contact information`,
              ({ formData }) => {
                const base = sponsorWording(formData);
                const first = base === 'Your' ? 'you' : 'the sponsor';
                const second = base === 'Your' ? 'your' : 'their';
                return `Having this information helps us contact ${first} faster if we have questions about ${second} information.`;
              },
            ),
            sponsorPhone: {
              ...phoneUI({
                title: 'Phone number',
              }),
              'ui:required': () => true,
            },
          },
          schema: {
            type: 'object',
            required: ['sponsorPhone'],
            properties: {
              titleSchema,
              sponsorPhone: phoneSchema,
            },
          },
        },
      },
    },
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        page13: {
          title: 'Applicant information',
          path: 'applicant-info',
          uiSchema: {
            ...titleUI('Applicant name and date of birth', ({ formData }) => (
              // Prefill message conditionally displays based on `certifierRole`
              <>
                <p>
                  Enter the information for any applicants you want to enroll in
                  CHAMPVA benefits.
                </p>
                {CustomPrefillMessage(formData, 'applicant')}
              </>
            )),
            applicants: {
              'ui:options': {
                viewField: ApplicantField,
                keepInPageOnReview: true,
                useDlWrap: true,
                itemName: 'Applicant',
                customTitle: ' ', // prevent <dl> around the schemaform-field-container
                confirmRemove: true,
              },
              items: {
                applicantName: fullNameUI(),
                applicantDob: dateOfBirthUI({ required: () => true }),
              },
            },
          },
          schema: applicantListSchema(['applicantDob'], {
            titleSchema,
            applicantName: fullNameSchema,
            applicantDob: dateOfBirthSchema,
          }),
        },
        page13a: {
          path: 'applicant-info-intro/:index',
          arrayPath: 'applicants',
          title: item => `${applicantWording(item)} information`,
          showPagePerItem: true,
          depends: () => !onReviewPage(),
          uiSchema: {
            applicants: {
              'ui:options': {
                viewField: ApplicantField,
              },
              items: {
                ...titleUI(
                  ({ formData }) => `${applicantWording(formData)} information`,
                  ({
                    formData,
                  }) => `Next we'll ask more questions about ${applicantWording(
                    formData,
                    undefined,
                    false,
                  )}. This includes social security number, mailing address, 
                          contact information, relationship to sponsor, and health 
                          insurance information.`,
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            'view:description': blankSchema,
          }),
        },
        page14: {
          path: 'applicant-identification-info/:index',
          arrayPath: 'applicants',
          title: item => `${applicantWording(item)} identification information`,
          showPagePerItem: true,
          uiSchema: {
            applicants: {
              'ui:options': {
                viewField: ApplicantField,
                keepInPageOnReview: true,
              },
              'ui:errorMessages': {
                minItems: 'Must have at least one applicant listed.',
                maxItems: 'A maximum of three applicants may be added.',
              },
              items: {
                ...titleUI(
                  ({ formData }) =>
                    `${applicantWording(formData)} identification information`,
                ),
                applicantSSN: ssnOrVaFileNumberCustomUI(),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            applicantSSN: ssnOrVaFileNumberSchema,
          }),
        },
        page15a: {
          path: 'applicant-mailing-same/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          keepInPageOnReview: false,
          title: item => `${applicantWording(item)} address selection`,
          depends: (formData, index) => page15aDepends(formData, index),
          CustomPage: ApplicantAddressCopyPage,
          CustomPageReview: null,
          uiSchema: {
            applicants: {
              items: {},
              'ui:options': {
                viewField: ApplicantField,
              },
            },
          },
          schema: applicantListSchema([], {}),
        },
        page15: {
          path: 'applicant-mailing-address/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} mailing address`,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  ({ formData }) =>
                    `${applicantWording(formData)} mailing address`,
                  ({ formData, formContext }) => {
                    const txt =
                      'We’ll send any important information about your application to this address';
                    // Prefill message conditionally displays based on `certifierRole`
                    return formContext.pagePerItemIndex === '0' ? (
                      <>
                        <p>{txt}</p>
                        {CustomPrefillMessage(formData, 'applicant')}
                      </>
                    ) : (
                      <p>{txt}</p>
                    );
                  },
                ),
                applicantAddress: {
                  ...addressUI({
                    labels: {
                      militaryCheckbox:
                        'Address is on a United States military base outside the country.',
                    },
                  }),
                },
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            applicantAddress: addressSchema(),
          }),
        },
        page16: {
          path: 'applicant-contact-info/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} contact information`,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  ({ formData }) =>
                    `${applicantWording(formData)} mailing address`,
                  ({ formData, formContext }) => {
                    const txt = `We'll use this information to contact ${applicantWording(
                      formData,
                      false,
                      false,
                      true,
                    )} if we need to follow up about this application.`;
                    // Prefill message conditionally displays based on `certifierRole`
                    return formContext.pagePerItemIndex === '0' ? (
                      <>
                        <p>{txt}</p>
                        {CustomPrefillMessage(formData, 'applicant')}
                      </>
                    ) : (
                      <p>{txt}</p>
                    );
                  },
                ),
                applicantPhone: phoneUI(),
                applicantEmailAddress: emailUI(),
              },
            },
          },
          schema: applicantListSchema(['applicantPhone'], {
            titleSchema,
            applicantPhone: phoneSchema,
            applicantEmailAddress: emailSchema,
          }),
        },
        page17: {
          path: 'applicant-gender/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} sex listed at birth`,
          CustomPage: ApplicantGenderPage,
          CustomPageReview: ApplicantGenderReviewPage,
          uiSchema: {
            applicants: {
              items: {},
              'ui:options': {
                viewField: ApplicantField,
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            applicantGender: {
              type: 'object',
              properties: {
                gender: { type: 'string' },
                _unused: { type: 'string' },
              },
            },
          }),
        },
        page18: {
          path: 'applicant-relationship/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} relationship to sponsor`,
          CustomPage: ApplicantRelationshipPage,
          CustomPageReview: ApplicantRelationshipReviewPage,
          schema: applicantListSchema([], {
            applicantRelationshipToSponsor: {
              type: 'object',
              properties: {
                relationshipToVeteran: { type: 'string' },
                otherRelationshipToVeteran: { type: 'string' },
              },
            },
          }),
          uiSchema: {
            applicants: {
              items: {},
            },
          },
        },
        page18c: {
          path: 'applicant-relationship-child/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
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
          CustomPage: ApplicantRelOriginPage,
          CustomPageReview: ApplicantRelOriginReviewPage,
          uiSchema: {
            applicants: {
              items: {},
              'ui:options': {
                viewField: ApplicantField,
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            'ui:description': blankSchema,
            applicantRelationshipOrigin: {
              type: 'object',
              properties: {
                relationshipToVeteran: radioSchema([
                  'blood',
                  'adoption',
                  'step',
                ]),
                otherRelationshipToVeteran: { type: 'string' },
              },
            },
          }),
        },
        page18a: {
          path: 'applicant-relationship-child-upload/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} birth certificate`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              formData.applicants[index]?.applicantRelationshipToSponsor
                ?.relationshipToVeteran === 'child'
            );
          },
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantBirthCertUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantBirthCertConfig.schema,
            applicantBirthCertOrSocialSecCard: fileWithMetadataSchema(
              acceptableFiles.birthCert,
            ),
          }),
        },
        page18d: {
          path: 'applicant-child-adoption-file/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
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
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantAdoptedUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantAdoptedConfig.schema,
            applicantAdoptionPapers: fileWithMetadataSchema(
              acceptableFiles.adoptionCert,
            ),
          }),
        },
        page18e: {
          path: 'applicant-child-marriage-file/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${applicantWording(item)} parental marriage documents`,
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
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantStepChildUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantStepChildConfig.schema,
            applicantStepMarriageCert: fileWithMetadataSchema(
              acceptableFiles.stepCert,
            ),
          }),
        },
        page18b1: {
          path: 'applicant-dependent-status/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} status`,
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
          CustomPageReview: ApplicantDependentStatusReviewPage,
          uiSchema: {
            applicants: {
              items: {},
              'ui:options': {
                viewField: ApplicantField,
              },
            },
          },
          schema: applicantListSchema([], {
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
          }),
        },
        page18b: {
          path: 'applicant-child-school-upload/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
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
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantSchoolCertUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantSchoolCertConfig.schema,
            applicantSchoolCert: fileWithMetadataSchema(
              acceptableFiles.schoolCert,
            ),
          }),
        },
        page18b2: {
          path: 'applicant-dependent-upload/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
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
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantHelplessChildUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantHelplessChildConfig.schema,
            applicantHelplessCert: fileWithMetadataSchema(
              acceptableFiles.helplessCert,
            ),
          }),
        },
        // Marriage dates (sponsor living or dead) when applicant did not remarry
        page18f3: {
          path: 'applicant-marriage-date/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} marriage dates`,
          depends: (formData, index) => depends18f3(formData, index),
          uiSchema: marriageDatesSchema.noRemarriageUiSchema,
          schema: marriageDatesSchema.noRemarriageSchema,
        },
        page18f: {
          path: 'applicant-marriage-upload/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
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
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantRemarriageCertUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            'view:fileUploadBlurb': blankSchema,
            applicantRemarriageCert: fileWithMetadataSchema(
              acceptableFiles.spouseCert,
            ),
          }),
        },
        page19: {
          path: 'applicant-medicare/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${applicantWording(item)} Medicare Part A and B status`,
          CustomPage: ApplicantMedicareStatusPage,
          CustomPageReview: ApplicantMedicareStatusReviewPage,
          schema: applicantListSchema([], {
            applicantMedicareStatus: {
              type: 'object',
              properties: {
                eligibility: { type: 'string' },
                _unused: { type: 'string' },
              },
            },
          }),
          uiSchema: {
            applicants: {
              items: {},
            },
          },
        },
        page20: {
          path: 'applicant-medicare-continued/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
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
          CustomPage: ApplicantMedicareStatusContinuedPage,
          CustomPageReview: ApplicantMedicareStatusContinuedReviewPage,
          schema: applicantListSchema([], {
            applicantMedicarePartD: {
              type: 'object',
              properties: {
                enrollment: { type: 'string' },
                otherEnrollment: { type: 'string' },
              },
            },
          }),
          uiSchema: {
            applicants: {
              items: {},
            },
          },
        },
        page20a: {
          path: 'applicant-medicare-upload/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare Part A and B card`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get(
                'applicantMedicareStatus.eligibility',
                formData?.applicants?.[index],
              ) === 'enrolled'
            );
          },
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantMedicarePartAPartBCardsUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantMedicarePartAPartBCardsConfig.schema,
            applicantMedicarePartAPartBCard: fileWithMetadataSchema(
              acceptableFiles.medicareABCert,
              2,
            ),
          }),
        },
        page20b: {
          path: 'applicant-medicare-d-upload/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare Part D card`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get(
                'applicantMedicareStatus.eligibility',
                formData?.applicants?.[index],
              ) === 'enrolled' &&
              get(
                'applicantMedicarePartD.enrollment',
                formData?.applicants?.[index],
              ) === 'enrolled'
            );
          },
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantMedicarePartDCardsUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantMedicarePartDCardsConfig.schema,
            applicantMedicarePartDCard: fileWithMetadataSchema(
              acceptableFiles.medicareDCert,
              2,
            ),
          }),
        },
        // If the user is ineligible for Medicare and over 65 years,
        // require them to upload proof of ineligibility
        page20c: {
          path: 'applicant-medicare-ineligible/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${applicantWording(item)} over 65 and ineligible for Medicare`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get(
                'applicantMedicareStatus.eligibility',
                formData?.applicants?.[index],
              ) === 'ineligible' &&
              getAgeInYears(formData.applicants[index]?.applicantDob) >= 65
            );
          },
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: appMedicareOver65IneligibleUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...appMedicareOver65IneligibleConfig.schema,
            applicantMedicareIneligibleProof: fileWithMetadataSchema(
              acceptableFiles.ssIneligible,
            ),
          }),
        },
        page21: {
          path: 'applicant-other-insurance-status/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} other health insurance`,
          CustomPage: ApplicantOhiStatusPage,
          CustomPageReview: ApplicantOhiStatusReviewPage,
          schema: applicantListSchema([], {
            applicantHasOhi: {
              type: 'object',
              properties: {
                hasOhi: { type: 'string' },
                _unused: { type: 'string' },
              },
            },
          }),
          uiSchema: {
            applicants: {
              items: {},
            },
          },
        },
        page21a: {
          path: 'applicant-other-insurance-upload/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} other health insurance`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get('applicantHasOhi.hasOhi', formData?.applicants?.[index]) ===
              'yes'
            );
          },
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantOhiCardsUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantOhiCardsConfig.schema,
            applicantOhiCard: fileWithMetadataSchema(
              acceptableFiles.healthInsCert,
              2,
            ),
          }),
        },
        page22: {
          path: 'applicant-other-insurance-10-7959c-file/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} 10-7959c upload`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get('applicantHasOhi.hasOhi', formData?.applicants?.[index]) ===
                'yes' ||
              get(
                'applicantMedicareStatus.eligibility',
                formData?.applicants?.[index],
              ) === 'enrolled'
            );
          },
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantOtherInsuranceCertificationUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantOtherInsuranceCertificationConfig.schema,
            applicantOtherInsuranceCertification: fileWithMetadataSchema(
              acceptableFiles.va7959cCert,
            ),
          }),
        },
      },
    },
    uploadFiles: {
      title: 'Upload files',
      keepInPageOnReview: false,
      pages: {
        page23: {
          path: 'supporting-files',
          title: 'Upload your supporting files',
          depends: formData => showFileOverviewPage(formData),
          CustomPage: SupportingDocumentsPage,
          CustomPageReview: null,
          uiSchema: {
            'ui:options': {
              keepInPageOnReview: false,
            },
          },
          schema: blankSchema,
        },
        page24: {
          path: 'consent-mail',
          title: 'Upload your supporting files',
          depends: formData => showFileOverviewPage(formData),
          CustomPage: MissingFileConsentPage,
          CustomPageReview: null,
          uiSchema: {
            'ui:options': {
              keepInPageOnReview: false,
            },
          },
          schema: blankSchema,
        },
      },
    },
  },
};

export default formConfig;
