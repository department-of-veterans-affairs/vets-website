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
import { fileUploadUi as fileUploadUI } from '../components/File/upload';

import { customRelationshipSchema } from '../components/CustomRelationshipPattern';
import { ssnOrVaFileNumberCustomUI } from '../components/CustomSsnPattern';

import transformForSubmit from './submitTransformer';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ApplicantField from '../components/Applicant/ApplicantField';
import ConfirmationPage from '../containers/ConfirmationPage';
import getNameKeyForSignature from '../helpers/signatureKeyName';
import {
  getAgeInYears,
  isInRange,
  getParts,
  onReviewPage,
  MAX_APPLICANTS,
  applicantListSchema,
} from '../helpers/utilities';
import {
  sponsorWording,
  applicantWording,
  additionalFilesHint,
} from '../helpers/wordingCustomization';
import { sponsorNameDobConfig } from '../pages/Sponsor/sponsorInfoConfig';
import {
  thirdPartyInfoUiSchema,
  thirdPartyInfoSchema,
} from '../components/ThirdPartyInfo';
import {
  sponsorCasualtyReportConfig,
  sponsorDisabilityRatingConfig,
  sponsorDischargePapersConfig,
  blankSchema,
  acceptableFiles,
  sponsorCasualtyUploadUiSchema,
  sponsorDisabilityRatingUploadUiSchema,
  sponsorDischargePapersUploadUiSchema,
} from '../components/Sponsor/sponsorFileUploads';
import {
  applicantBirthCertConfig,
  applicantSchoolCertConfig,
  applicantHelplessChildConfig,
  applicantAdoptedConfig,
  applicantStepChildConfig,
  applicantMedicarePartAPartBCardsConfig,
  applicantMedicarePartDCardsConfig,
  appMedicareOver65IneligibleConfig,
  applicantOhiCardsConfig,
  applicant107959cConfig,
  applicantMarriageCertConfig,
  applicantSecondMarriageDivorceCertConfig,
} from '../components/Applicant/applicantFileUpload';
import { homelessInfo, noPhoneInfo } from '../components/Sponsor/sponsorAlerts';

import {
  ApplicantMedicareStatusPage,
  ApplicantMedicareStatusReviewPage,
} from '../pages/ApplicantMedicareStatusPage';
import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
} from '../pages/ApplicantRelationshipPage';
import ApplicantMedicareStatusContinuedPage, {
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
import { ApplicantAddressCopyPage } from '../pages/ApplicantAddressPage';

import { hasReq } from '../components/File/MissingFileOverview';
import { fileWithMetadataSchema } from './attachments';

// import mockData from '../tests/fixtures/data/test-data.json';
import FileFieldCustom from '../components/File/FileUpload';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit,
  showReviewErrors: !environment.isProduction(),
  // submitUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms`,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
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
          path: 'your-information/description',
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
          path: 'certification/name',
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
          path: 'certification/address',
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
          path: 'certification/phone',
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
          path: 'certification/relationship',
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
          path: 'sponsor-information/name-dob',
          title: formData =>
            `${sponsorWording(formData)} name and date of birth`,
          uiSchema: sponsorNameDobConfig.uiSchema,
          schema: sponsorNameDobConfig.schema,
        },
        page7: {
          path: 'sponsor-information/ssn',
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
          path: 'sponsor-information/status',
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
          path: 'sponsor-information/status-date',
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
        page9a: {
          path: 'sponsor-information/status-documents',
          title: 'Sponsor casualty report',
          depends: formData =>
            get('sponsorIsDeceased', formData) &&
            get('sponsorDeathConditions', formData),
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          uiSchema: {
            ...titleUI(
              'Required supporting file upload',
              ({ formData }) =>
                `Upload a file showing the casualty report for ${
                  formData.veteransFullName.first
                } ${formData.veteransFullName.last}`,
            ),
            ...sponsorCasualtyReportConfig.uiSchema,
            sponsorCasualtyReport: fileUploadUI(
              "Upload Sponsor's casualty report",
            ),
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              ...sponsorCasualtyReportConfig.schema,
              sponsorCasualtyReport: fileWithMetadataSchema(
                acceptableFiles.casualtyCert,
              ),
            },
          },
        },
        page10b1: {
          path: 'sponsor-information/address',
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
          path: 'sponsor-information/phone',
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
        page12: {
          path: 'sponsor-information/disability',
          title: 'Sponsor disability rating',
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          uiSchema: {
            ...titleUI(
              'Optional supporting file upload',
              ({ formData }) =>
                `Upload a file showing the disability rating for ${
                  formData.veteransFullName.first
                } ${formData.veteransFullName.last}`,
            ),
            ...sponsorDisabilityRatingConfig.uiSchema,
            sponsorDisabilityRating: fileUploadUI(
              "Upload Sponsor's disability rating",
            ),
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              ...sponsorDisabilityRatingConfig.schema,
              sponsorDisabilityRating: fileWithMetadataSchema(
                acceptableFiles.disabilityCert,
              ),
            },
          },
        },
        page12a: {
          path: 'sponsor-information/discharge-papers',
          title: 'Sponsor discharge papers',
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          uiSchema: {
            ...titleUI(
              'Optional supporting file upload',
              ({ formData }) =>
                `Upload a file showing the discharge papers for ${
                  formData.veteransFullName.first
                } ${formData.veteransFullName.last}`,
            ),
            ...sponsorDischargePapersConfig.uiSchema,
            sponsorDischargePapers: fileUploadUI(
              "Upload Sponsor's discharge papers",
            ),
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              ...sponsorDischargePapersConfig.schema,
              sponsorDischargePapers: fileWithMetadataSchema(
                acceptableFiles.dischargeCert,
              ),
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
            ...titleUI('Applicant name and date of birth', ({ formData }) => (
              <>
                {`Enter ${
                  formData.certifierRole === 'applicant'
                    ? 'your information and the information for any other'
                    : 'the information for any'
                } applicants you want to enroll in CHAMPVA benefits.`}
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
                useDlWrap: false,
                itemName: 'Applicant',
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
          path: 'applicant-information/:index/start',
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
                'ui:options': {
                  updateSchema: formData => {
                    return {
                      title: context =>
                        titleUI(
                          `${applicantWording(formData, context)} information`,
                          `Next we'll ask more questions about ${applicantWording(
                            formData,
                            context,
                            false,
                            false,
                          )}. This includes social security number, mailing address, 
                          contact information, relationship to sponsor, and health 
                          insurance information.`,
                        )['ui:title'],
                    };
                  },
                },
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            'view:description': blankSchema,
          }),
        },
        page14: {
          path: 'applicant-information/:index/ssn',
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
                applicantSSN: ssnOrVaFileNumberCustomUI(),
                // Dynamic title (uses "your" if certifierRole is applicant and
                // this is applicant[0])
                'ui:options': {
                  updateSchema: formData => {
                    return {
                      title: context =>
                        titleUI(
                          `${applicantWording(
                            formData,
                            context,
                          )} identification information`,
                        )['ui:title'], // grab styled title rather than plain text
                    };
                  },
                },
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            applicantSSN: ssnOrVaFileNumberSchema,
          }),
        },
        page15a: {
          path: 'applicant-information/:index/pre-address',
          arrayPath: 'applicants',
          showPagePerItem: true,
          keepInPageOnReview: false,
          title: item => `${applicantWording(item)} mailing address`,
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
          path: 'applicant-information/:index/address',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${applicantWording(item)} mailing address (continued)`,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
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
                'ui:options': {
                  updateSchema: formData => {
                    return {
                      title: context =>
                        titleUI(
                          `${applicantWording(
                            formData,
                            context,
                          )} mailing address`,
                        )['ui:title'], // grab styled title rather than plain text
                    };
                  },
                },
              },
            },
          },
          schema: applicantListSchema([], {
            'view:description': blankSchema,
            ...homelessInfo.schema,
            applicantAddress: addressSchema(),
          }),
        },
        page16: {
          path: 'applicant-information/:index/email-phone',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} contact information`,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                'ui:options': {
                  updateSchema: formData => {
                    return {
                      title: context =>
                        titleUI(
                          `${applicantWording(
                            formData,
                            context,
                          )} contact information`,
                        )['ui:title'],
                    };
                  },
                },
                ...noPhoneInfo.uiSchema,
                applicantEmailAddress: emailUI(),
                applicantPhone: phoneUI(),
              },
            },
          },
          schema: applicantListSchema([], {
            ...noPhoneInfo.schema,
            applicantEmailAddress: emailSchema,
            applicantPhone: phoneSchema,
          }),
        },
        page17: {
          path: 'applicant-information/:index/gender',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} gender`,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                'ui:options': {
                  updateSchema: formData => {
                    return {
                      title: context =>
                        titleUI(
                          `${applicantWording(formData, context)} gender`,
                        )['ui:title'],
                    };
                  },
                },
                applicantGender: radioUI({
                  title: 'Gender',
                  required: () => true,
                  labels: { male: 'Male', female: 'Female' },
                }),
              },
            },
          },
          schema: applicantListSchema([], {
            applicantGender: radioSchema(['male', 'female']),
          }),
        },
        page18: {
          path: 'applicant-information/:index/relationship',
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
          path: 'applicant-information/:index/child-info',
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
          path: 'applicant-information/:index/child-documents',
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
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Optional supporting file upload',
                  ({ formData }) =>
                    `Upload a birth certificate for ${
                      formData?.applicantName?.first
                    } ${formData?.applicantName?.last}`,
                ),
                ...applicantBirthCertConfig.uiSchema,
                applicantBirthCertOrSocialSecCard: fileUploadUI(
                  "Upload the applicant's birth certificate",
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantBirthCertConfig.schema,
            applicantBirthCertOrSocialSecCard: fileWithMetadataSchema(
              acceptableFiles.birthCert,
            ),
          }),
        },
        page18b1: {
          path: 'applicant-information/:index/school-age',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} dependent status`,
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
                  'enrolledOrIntendsToEnroll',
                  'over18HelplessChild',
                ]),
                otherStatus: { type: 'string' },
              },
            },
          }),
        },
        page18b: {
          path: 'applicant-information/:index/school-documents',
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
              formData.applicants[index]?.applicantDependentStatus?.status ===
                'enrolledOrIntendsToEnroll'
            );
          },
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Required supporting file upload',
                  ({ formData }) =>
                    `Upload a school certification for ${
                      formData?.applicantName?.first
                    } ${formData?.applicantName?.last}`,
                ),
                ...applicantSchoolCertConfig.uiSchema,
                applicantSchoolCert: fileUploadUI(
                  "Upload the applicant's school certification",
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantSchoolCertConfig.schema,
            applicantSchoolCert: fileWithMetadataSchema(
              acceptableFiles.schoolCert,
            ),
          }),
        },
        page18b2: {
          path: 'applicant-information/:index/helpless-child',
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
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Optional supporting file upload',
                  ({ formData }) =>
                    `Upload a VBA decision rating certificate of award for ${
                      formData?.applicantName?.first
                    } ${formData?.applicantName?.last}`,
                ),
                ...applicantHelplessChildConfig.uiSchema,
                applicantHelplessCert: fileUploadUI(
                  'Upload VBA decision rating for the applicant',
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantHelplessChildConfig.schema,
            applicantHelplessCert: fileWithMetadataSchema(
              acceptableFiles.helplessCert,
            ),
          }),
        },
        page18d: {
          path: 'applicant-information/:index/adoption-documents',
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
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Required supporting file upload',
                  ({ formData }) =>
                    `Upload adoption papers for ${
                      formData?.applicantName?.first
                    } ${formData?.applicantName?.last}`,
                ),
                ...applicantAdoptedConfig.uiSchema,
                applicantAdoptionPapers: fileUploadUI(
                  "Upload the applicant's adoption papers",
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantAdoptedConfig.schema,
            applicantAdoptionPapers: fileWithMetadataSchema(
              acceptableFiles.adoptionCert,
            ),
          }),
        },
        page18e: {
          path: 'applicant-information/:index/via-marriage-documents',
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
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Required supporting file upload',
                  ({ formData }) =>
                    `Upload a marriage certificate between ${
                      formData?.applicantName?.first
                    } ${
                      formData?.applicantName?.last
                    }'s parent and the sponsor.`,
                ),
                ...applicantStepChildConfig.uiSchema,
                applicantStepMarriageCert: fileUploadUI(
                  "Upload marriage certificate between applicant's parent and the sponsor",
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantStepChildConfig.schema,
            applicantStepMarriageCert: fileWithMetadataSchema(
              acceptableFiles.stepCert,
            ),
          }),
        },
        page18f1: {
          path: 'applicant-information/:index/marriage-details',
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
          path: 'applicant-information/:index/remarriage-viable',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} remarriage status`,
          depends: (formData, index) => depends18f2(formData, index),
          uiSchema: remarriageDetailsSchema.uiSchema,
          schema: remarriageDetailsSchema.schema,
        },
        // Marriage dates (sponsor living or dead) when applicant did not remarry
        page18f3: {
          path: 'applicant-information/:index/marriage-dates',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} marriage dates`,
          depends: (formData, index) => depends18f3(formData, index),
          uiSchema: marriageDatesSchema.uiSchema,
          schema: marriageDatesSchema.noRemarriageSchema,
        },
        // Applicant remarried after sponsor died
        page18f4: {
          path: 'applicant-information/:index/remarried-dates',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} marriage dates`,
          depends: (formData, index) => depends18f4(formData, index),
          uiSchema: marriageDatesSchema.uiSchema,
          schema: marriageDatesSchema.remarriageSchema,
        },
        // Applicant remarried after sponsor died but separated from 2nd spouse
        page18f5: {
          path: 'applicant-information/:index/remarried-separated-dates',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} marriage dates`,
          depends: (formData, index) => depends18f5(formData, index),
          uiSchema: marriageDatesSchema.uiSchema,
          schema: marriageDatesSchema.remarriageSeparatedSchema,
        },
        // Applicant separated from sponsor before sponsor's death
        page18f6: {
          path: 'applicant-information/:index/married-separated-dates',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} marriage dates`,
          depends: (formData, index) => depends18f6(formData, index),
          uiSchema: marriageDatesSchema.uiSchema,
          schema: marriageDatesSchema.separatedSchema,
        },
        page18f: {
          path: 'applicant-information/:index/spouse',
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
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Optional supporting file upload',
                  ({ formData }) =>
                    `Upload a marriage certificate showing the marriage between the sponsor and ${
                      formData?.applicantName?.first
                    } ${formData?.applicantName?.last}`,
                ),
                ...applicantMarriageCertConfig.uiSchema,
                applicantMarriageCert: fileUploadUI(
                  "Upload the applicant's marriage certificate",
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantMarriageCertConfig.schema,
            applicantMarriageCert: fileWithMetadataSchema(
              acceptableFiles.spouseCert,
            ),
          }),
        },
        page18f7: {
          path: 'applicant-information/:index/second-marriage',
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
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Optional supporting file upload',
                  ({ formData }) =>
                    `Upload a marriage certificate showing the marriage between ${
                      formData?.applicantName?.first
                    } ${formData?.applicantName?.last} and their new spouse`,
                ),
                ...applicantMarriageCertConfig.uiSchema,
                applicantSecondMarriageCert: fileUploadUI(
                  "Upload the applicant's second marriage certificate",
                ),
              },
            },
          },
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
          path: 'applicant-information/:index/second-marriage-dissolved',
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
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Optional supporting file upload',
                  ({ formData }) =>
                    `Upload the legal document that ended ${
                      formData?.applicantName?.first
                    } ${formData?.applicantName?.last}'s second marriage`,
                ),
                ...applicantSecondMarriageDivorceCertConfig.uiSchema,
                applicantSecondMarriageDivorceCert: fileUploadUI(
                  "Upload the applicant's second marriage dissolution document",
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantSecondMarriageDivorceCertConfig.schema,
            applicantSecondMarriageDivorceCert: fileWithMetadataSchema(
              acceptableFiles.spouseCert,
            ),
          }),
        },
        page19: {
          path: 'applicant-information/:index/medicare-status',
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
          path: 'applicant-information/:index/medicare-status-continued',
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
            applicantMedicarePart: { type: 'string' },
          }),
          uiSchema: {
            applicants: {
              items: {},
            },
          },
        },
        page20a: {
          path: 'applicant-information/:index/medicare-ab-upload',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} medicare card (parts A/B)`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get(
                'applicantMedicareStatus.eligibility',
                formData?.applicants?.[index],
              ) === 'enrolled' &&
              ['partA', 'partB'].some(part =>
                get(
                  'applicantMedicarePart',
                  formData?.applicants?.[index],
                )?.includes(part),
              )
            );
          },
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Required supporting file upload',
                  ({ formData }) =>
                    `Upload ${formData?.applicantName?.first} ${
                      formData?.applicantName?.last
                    }'s copy of Medicare ${getParts(
                      formData?.applicantMedicarePart,
                    )} card(s).`,
                ),
                ...applicantMedicarePartAPartBCardsConfig.uiSchema,
                applicantMedicarePartAPartBCard: fileUploadUI(
                  "Upload the applicant's copy of Medicare Parts A or B card(s)",
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantMedicarePartAPartBCardsConfig.schema,
            applicantMedicarePartAPartBCard: fileWithMetadataSchema(
              acceptableFiles.medicareABCert,
            ),
          }),
        },
        page20b: {
          path: 'applicant-information/:index/medicare-d-upload',
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
                'applicantMedicarePart',
                formData?.applicants?.[index],
              )?.includes('partD')
            );
          },
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Required supporting file upload',
                  ({ formData }) =>
                    `Upload ${formData?.applicantName?.first} ${
                      formData?.applicantName?.last
                    }'s copy of Medicare Part D card.`,
                ),
                ...applicantMedicarePartDCardsConfig.uiSchema,
                applicantMedicarePartDCard: fileUploadUI(
                  "Upload the applicant's copy of Medicare Part D",
                ),
              },
            },
          },
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
          path: 'applicant-information/:index/over-65-ineligible',
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
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Required supporting file upload',
                  ({ formData }) =>
                    `Upload the letter from the Social Security Administration that confirms ${
                      formData?.applicantName?.first
                    } ${
                      formData?.applicantName?.last
                    } doesn’t qualify for Medicare benefits under anyone’s Social Security number`,
                ),
                ...appMedicareOver65IneligibleConfig.uiSchema,
                applicantMedicareIneligibleProof: fileUploadUI(
                  'Upload the applicant’s letter from the Social Security Administration.',
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...appMedicareOver65IneligibleConfig.schema,
            applicantMedicareIneligibleProof: fileWithMetadataSchema(
              acceptableFiles.ssIneligible,
            ),
          }),
        },
        page21: {
          path: 'applicant-information/:index/ohi',
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
          path: 'applicant-information/:index/ohi-upload',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} other health insurance`,
          depends: (formData, index) => {
            if (index === undefined) return true;
            return (
              get('applicantHasOhi', formData?.applicants?.[index]) === 'yes'
            );
          },
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Required supporting file upload',
                  ({ formData }) =>
                    `Upload the front and back of ${applicantWording(
                      formData,
                      undefined,
                      true,
                    )} health insurance card(s). If you have more than one type of health insurance (other than Medicare), please upload the front and back of all cards`,
                ),
                ...applicantOhiCardsConfig.uiSchema,
                applicantOhiCard: fileUploadUI(
                  "Upload front and back of the applicant's health insurance card",
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...applicantOhiCardsConfig.schema,
            applicantOhiCard: fileWithMetadataSchema(
              acceptableFiles.healthInsCert,
            ),
          }),
        },
        page22: {
          path: 'applicant-information/:index/10-7959c-upload',
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
          CustomPage: FileFieldCustom,
          CustomPageReview: null,
          customPageUsesPagePerItemData: true,
          uiSchema: {
            applicants: {
              'ui:options': { viewField: ApplicantField },
              items: {
                ...titleUI(
                  'Required supporting file upload',
                  ({ formData }) =>
                    `Upload ${applicantWording(formData)} VA form 10-7959c.`,
                ),
                ...applicant107959cConfig.uiSchema,
                applicant107959c: fileUploadUI(
                  "Upload the applicant's VA form 10-7959c",
                ),
              },
            },
          },
          schema: applicantListSchema([], {
            titleSchema,
            ...applicant107959cConfig.schema,
            applicant107959c: fileWithMetadataSchema(
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
          path: 'consent-to-mail',
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
