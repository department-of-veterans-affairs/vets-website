import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import React from 'react';
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
// import { fileUploadUi as fileUploadUI } from '../components/File/upload';

import { customRelationshipSchema } from '../components/CustomRelationshipPattern';
import { ssnOrVaFileNumberCustomUI } from '../components/CustomSsnPattern';

import transformForSubmit from './submitTransformer';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';
import ConfirmationPage from '../containers/ConfirmationPage';
import getNameKeyForSignature from '../helpers/signatureKeyName';
import {
  getAgeInYears,
  isInRange,
  onReviewPage,
  MAX_APPLICANTS,
  applicantListSchema,
} from '../helpers/utilities';
import { applicantWording } from '../../shared/utilities';
import {
  sponsorWording,
  additionalFilesHint,
} from '../helpers/wordingCustomization';
import { sponsorNameDobConfig } from '../pages/Sponsor/sponsorInfoConfig';
import {
  thirdPartyInfoUiSchema,
  thirdPartyInfoSchema,
} from '../components/ThirdPartyInfo';
import { acceptableFiles } from '../components/Sponsor/sponsorFileUploads';
import {
  // marriageDocumentList,
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
  applicantMarriageCertConfig,
  applicantSecondMarriageDivorceCertConfig,
  applicantBirthCertUploadUiSchema,
  applicantAdoptedUploadUiSchema,
  applicantStepChildUploadUiSchema,
  applicantMarriageCertUploadUiSchema,
  applicantSecondMarriageCertUploadUiSchema,
  applicantSecondMarriageDivorceCertUploadUiSchema,
  applicantMedicarePartAPartBCardsUploadUiSchema,
  applicantMedicarePartDCardsUploadUiSchema,
  appMedicareOver65IneligibleUploadUiSchema,
  applicantOhiCardsUploadUiSchema,
  applicantOtherInsuranceCertificationUploadUiSchema,
} from '../components/Applicant/applicantFileUpload';
import { homelessInfo, noPhoneInfo } from '../components/Sponsor/sponsorAlerts';
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
  ApplicantSponsorMarriageDetailsPage,
  ApplicantSponsorMarriageDetailsReviewPage,
  marriageDatesSchema,
  remarriageDetailsSchema,
  depends18f2,
  depends18f3,
  depends18f4,
  depends18f5,
  depends18f6,
} from '../pages/ApplicantSponsorMarriageDetailsPage';
import { ApplicantAddressCopyPage } from '../../shared/components/applicantLists/ApplicantAddressPage';

import { hasReq } from '../../shared/components/fileUploads/MissingFileOverview';
import { fileWithMetadataSchema } from '../../shared/components/fileUploads/attachments';

// import mockData from '../tests/fixtures/data/test-data.json';
import FileFieldWrapped from '../components/FileUploadWrapper';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit,
  showReviewErrors: !environment.isProduction(),
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
      fullNamePath: formData => getNameKeyForSignature(formData),
    },
  },
  formId: '10-10D',
  dev: {
    showNavLinks: false,
    collapsibleNavLinks: true,
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
  savedFormMessages: {
    notFound: 'Please start over to apply for CHAMPVA benefits.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA benefits.',
  },
  title: 'Apply for CHAMPVA benefits',
  subTitle: 'Form 10-10d',
  defaultDefinitions: {},
  chapters: {
    certifierInformation: {
      title: 'Signer information',
      pages: {
        page1: {
          // initialData: mockData.data,
          path: 'signer',
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
            }),
            ...thirdPartyInfoUiSchema,
          },
          schema: {
            type: 'object',
            required: ['certifierRole'],
            properties: {
              titleSchema,
              certifierRole: radioSchema(['applicant', 'sponsor', 'other']),
              ...thirdPartyInfoSchema,
            },
          },
        },
        page2: {
          path: 'signer-information',
          title: 'Certification',
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: {
            ...titleUI('Your name'),
            certifierName: fullNameUI(),
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
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: {
            ...titleUI(
              'Your mailing address',
              'We’ll send any important information about this application to your address',
            ),
            // ...homelessInfo.uiSchema,
            certifierAddress: addressUI(),
          },
          schema: {
            type: 'object',
            required: ['certifierAddress'],
            properties: {
              titleSchema,
              // ...homelessInfo.schema,
              certifierAddress: addressSchema(),
            },
          },
        },
        page4: {
          path: 'signer-contact-information',
          title: 'Certification',
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: {
            ...titleUI(
              'Your contact information',
              'We use this information to contact you if we have more questions.',
            ),
            ...noPhoneInfo.uiSchema,
            certifierPhone: phoneUI(),
          },
          schema: {
            type: 'object',
            required: ['certifierPhone'],
            properties: {
              titleSchema,
              ...noPhoneInfo.schema,
              certifierPhone: phoneSchema,
            },
          },
        },
        page5: {
          path: 'signer-relationship',
          title: 'Certification',
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: {
            ...titleUI(
              'Your relationship to the applicant',
              `You can add up to ${MAX_APPLICANTS} applicants on a single application. If you need to add more than ${MAX_APPLICANTS}, you’ll need to fill out another form for them.`,
            ),
            certifierRelationship: {
              relationshipToVeteran: checkboxGroupUI({
                title: 'Which of these best describes you?',
                hint: 'Select all that apply',
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
                  if (
                    formData.certifierRelationship.relationshipToVeteran.other
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
          path: 'sponsor-information',
          title: formData =>
            `${sponsorWording(formData)} name and date of birth`,
          uiSchema: sponsorNameDobConfig.uiSchema,
          schema: sponsorNameDobConfig.schema,
        },
        page7: {
          path: 'sponsor-identification-information',
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
          title: 'Sponsor status (continued)',
          depends: formData =>
            get('certifierRole', formData) !== 'sponsor' &&
            get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: titleUI('Sponsor status (continued)'),
            sponsorDOD: dateOfDeathUI('When did the sponsor die?'),
            sponsorDeathConditions: yesNoUI({
              title: 'Did sponsor die during active military service?',
              hint: additionalFilesHint,
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
              'We’ll send any important information about this application to this address.',
            ),
            ...homelessInfo.uiSchema,
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
              ...homelessInfo.schema,
              sponsorAddress: addressSchema(),
            },
          },
        },
        page11: {
          path: 'sponsor-contact-information',
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
            ...noPhoneInfo.uiSchema,
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
              ...noPhoneInfo.schema,
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
          path: 'applicant-information',
          arrayPath: 'applicants',
          title: 'Applicants',
          uiSchema: {
            ...titleUI('Applicant name and date of birth', () => (
              <>
                Enter the information for any applicants you want to enroll in
                CHAMPVA benefits.
                <br />
                <br />
                {`You can add up to ${MAX_APPLICANTS} applicants in a single application. If you 
              need to add more than ${MAX_APPLICANTS} applicants, you'll need to submit a 
              separate application for them.`}
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
              'ui:errorMessages': {
                minItems: 'Must have at least one applicant listed.',
                maxItems: `You can add up to ${MAX_APPLICANTS} in a single application. If you need to add more than ${MAX_APPLICANTS} applicants, you need to submit a separate application for them.`,
              },
              items: {
                applicantName: fullNameUI(),
                applicantDOB: dateOfBirthUI({ required: true }),
              },
            },
          },
          schema: applicantListSchema(['applicantDOB'], {
            titleSchema,
            applicantName: fullNameSchema,
            applicantDOB: dateOfBirthSchema,
          }),
        },
        page13a: {
          path: 'applicant-information-intro/:index',
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
          path: 'applicant-identification-information/:index',
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
          title: item => `${applicantWording(item)} mailing address`,
          depends: (formData, index) => index && index > 0,
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
          title: item =>
            `${applicantWording(item)} mailing address (continued)`,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  ({ formData }) =>
                    `${applicantWording(formData)} mailing address`,
                ),
                'view:description': {
                  'ui:description':
                    'We’ll send any important information about your application to this address.',
                },
                ...homelessInfo.uiSchema,
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
            'view:description': blankSchema,
            ...homelessInfo.schema,
            applicantAddress: addressSchema(),
          }),
        },
        page16: {
          path: 'applicant-contact-information/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} contact information`,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  ({ formData }) =>
                    `${applicantWording(formData)} contact information`,
                  'This information helps us contact you faster if we need to follow up with you about your application',
                ),
                ...noPhoneInfo.uiSchema,
                applicantPhone: phoneUI(),
                applicantEmailAddress: emailUI(),
              },
            },
          },
          schema: applicantListSchema(['applicantPhone'], {
            titleSchema,
            ...noPhoneInfo.schema,
            applicantPhone: phoneSchema,
            applicantEmailAddress: emailSchema,
          }),
        },
        page17: {
          path: 'applicant-gender/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} gender`,
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
          path: 'applicant-sponsor-relationship/:index',
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
          path: 'applicant-child-relationship/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${applicantWording(item)} relationship to sponsor (continued)`,
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
            applicantRelationshipOrigin: customRelationshipSchema([
              'blood',
              'adoption',
              'step',
            ]),
          }),
        },
        page18a: {
          path: 'applicant-child-file/:index',
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
          path: 'applicant-child-age/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} status`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              formData.applicants[index]?.applicantRelationshipToSponsor
                ?.relationshipToVeteran === 'child' &&
              isInRange(
                getAgeInYears(formData.applicants[index]?.applicantDOB),
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
                otherStatus: { type: 'string' },
              },
            },
          }),
        },
        page18b: {
          path: 'applicant-child-school-file/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} school documents`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              formData.applicants[index]?.applicantRelationshipToSponsor
                ?.relationshipToVeteran === 'child' &&
              isInRange(
                getAgeInYears(formData.applicants[index]?.applicantDOB),
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
          path: 'applicant-child-helpless/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} helpless child documents`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              formData.applicants[index]?.applicantRelationshipToSponsor
                ?.relationshipToVeteran === 'child' &&
              getAgeInYears(formData.applicants[index]?.applicantDOB) >= 18 &&
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
        page18f1: {
          path: 'applicant-marriage/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} marriage documents`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              ['spouse', 'spouseSeparated'].includes(
                get(
                  'applicantRelationshipToSponsor.relationshipToVeteran',
                  formData?.applicants?.[index],
                ),
              ) && get('sponsorIsDeceased', formData)
            );
          },
          CustomPage: ApplicantSponsorMarriageDetailsPage,
          CustomPageReview: ApplicantSponsorMarriageDetailsReviewPage,
          schema: applicantListSchema([], {
            applicantSponsorMarriageDetails: {
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
        // If applicant has second marriage, is it ongoing?
        page18f2: {
          path: 'applicant-remarriage/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} remarriage status`,
          depends: (formData, index) => depends18f2(formData, index),
          uiSchema: remarriageDetailsSchema.uiSchema,
          schema: remarriageDetailsSchema.schema,
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
        // Applicant remarried after sponsor died
        page18f4: {
          path: 'applicant-remarriage-date/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} marriage dates`,
          depends: (formData, index) => depends18f4(formData, index),
          uiSchema: marriageDatesSchema.remarriageUiSchema,
          schema: marriageDatesSchema.remarriageSchema,
        },
        // Applicant remarried after sponsor died but separated from 2nd spouse
        page18f5: {
          path: 'applicant-remarriage-separation-date/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} marriage dates`,
          depends: (formData, index) => depends18f5(formData, index),
          uiSchema: marriageDatesSchema.remarriageSeparatedUiSchema,
          schema: marriageDatesSchema.remarriageSeparatedSchema,
        },
        // Applicant separated from sponsor before sponsor's death
        page18f6: {
          path: 'applicant-information/:index/married-separated-dates',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} marriage dates`,
          depends: (formData, index) => depends18f6(formData, index),
          uiSchema: marriageDatesSchema.separatedUiSchema,
          schema: marriageDatesSchema.separatedSchema,
        },
        page18f: {
          path: 'applicant-marriage-file/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} marriage documents`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get(
                'applicantRelationshipToSponsor.relationshipToVeteran',
                formData?.applicants?.[index],
              ) === 'spouse' &&
              ((get('sponsorIsDeceased', formData) &&
                [
                  'marriedTillDeathNoRemarriage',
                  'marriedTillDeathRemarriedAfter55',
                ].includes(
                  get(
                    'applicantSponsorMarriageDetails.relationshipToVeteran',
                    formData?.applicants?.[index],
                  ),
                )) ||
                !get('sponsorIsDeceased', formData))
            );
          },
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantMarriageCertUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantMarriageCertConfig.schema,
            applicantMarriageCert: fileWithMetadataSchema(
              acceptableFiles.spouseCert,
            ),
          }),
        },
        page18f7: {
          path: 'applicant-remarriage-file/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} second marriage documents`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get(
                'applicantRelationshipToSponsor.relationshipToVeteran',
                formData?.applicants?.[index],
              ) === 'spouse' &&
              get(
                'applicantSponsorMarriageDetails.relationshipToVeteran',
                formData?.applicants?.[index],
              ) === 'marriedTillDeathRemarriedAfter55'
            );
          },
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantSecondMarriageCertUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantMarriageCertConfig.schema,
            applicantSecondMarriageCert: fileWithMetadataSchema(
              acceptableFiles.spouseCert,
            ),
          }),
        },
        // If applicant remarried after 55 but the second marriage is not viable,
        // upload a certificate proving the marriage dissolved
        page18f8: {
          path: 'applicant-remarriage-separation-file/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${applicantWording(item)} second marriage dissolution documents`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get(
                'applicantRelationshipToSponsor.relationshipToVeteran',
                formData?.applicants?.[index],
              ) === 'spouse' &&
              get(
                'applicantSponsorMarriageDetails.relationshipToVeteran',
                formData?.applicants?.[index],
              ) === 'marriedTillDeathRemarriedAfter55' &&
              !get('remarriageIsViable', formData?.applicants?.[index])
            );
          },
          CustomPage: FileFieldWrapped,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: applicantSecondMarriageDivorceCertUploadUiSchema,
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantSecondMarriageDivorceCertConfig.schema,
            applicantSecondMarriageDivorceCert: fileWithMetadataSchema(
              acceptableFiles.spouseCert,
            ),
          }),
        },
        page19: {
          path: 'applicant-medicare/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare status`,
          CustomPage: ApplicantMedicareStatusPage,
          CustomPageReview: ApplicantMedicareStatusReviewPage,
          schema: applicantListSchema([], {
            applicantMedicareStatus: {
              type: 'object',
              properties: {
                eligibility: { type: 'string' },
                otherIneligible: { type: 'string' },
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
          title: item =>
            `${applicantWording(item)} Medicare status (continued)`,
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
          path: 'applicant-medicare-ab-file/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} medicare card (parts A/B)`,
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
            ),
          }),
        },
        page20b: {
          path: 'applicant-medicare-d-file/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} medicare card (part D)`,
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
              ) !== 'enrolled' &&
              getAgeInYears(formData.applicants[index]?.applicantDOB) >= 65
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
            applicantHasOhi: { type: 'string' },
          }),
          uiSchema: {
            applicants: {
              items: {},
            },
          },
        },
        page21a: {
          path: 'applicant-other-insurance-file/:index',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} other health insurance`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get('applicantHasOhi', formData?.applicants?.[index]) === 'yes'
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
              get('applicantHasOhi', formData?.applicants?.[index]) === 'yes' ||
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
          depends: formData => {
            try {
              return (
                hasReq(formData.applicants, true) ||
                hasReq(formData.applicants, false) ||
                hasReq(formData, true) ||
                hasReq(formData, false)
              );
            } catch {
              return false;
            }
          },
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
