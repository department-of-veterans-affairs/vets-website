import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  fullNameSchema,
  fullNameUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
  ssnSchema,
  ssnUI,
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
  relationshipToVeteranSchema,
  relationshipToVeteranUI,
  yesNoSchema,
  yesNoUI,
  radioSchema,
  radioUI,
  titleSchema,
  inlineTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import fileUploadUI from '@department-of-veterans-affairs/platform-forms-system/definitions/file';

import transformForSubmit from './submitTransformer';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ApplicantField from '../components/Applicant/ApplicantField';
import SectionCompleteAlert from '../components/SectionCompleteAlert';
import ConfirmationPage from '../containers/ConfirmationPage';
import { fileTypes, attachmentsSchema } from './attachments';
import getNameKeyForSignature from '../helpers/signatureKeyName';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit,
  // submitUrl: '/v0/api',
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
  title: '10-10d Application for CHAMPVA benefits',
  defaultDefinitions: {},
  chapters: {
    certifierInformation: {
      title: 'Your information',
      pages: {
        page1: {
          path: 'your-information/description',
          title: 'Which of these best describes you?',
          uiSchema: {
            certifierRole: radioUI({
              title: 'Which of these best describes you?',
              required: true,
              labels: {
                sponsor: "I'm the sponsoring Veteran",
                applicant: "I'm an applicant",
                other:
                  "I'm neither the sponsoring Veteran, nor an applicant - I'm a third party",
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['certifierRole'],
            properties: {
              certifierRole: radioSchema(['sponsor', 'applicant', 'other']),
            },
          },
        },
        page2: {
          path: 'certification/name',
          title: 'Certification',
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: {
            certifierInfoTitle: inlineTitleUI('Your name'),
            certifierName: fullNameUI(),
          },
          schema: {
            type: 'object',
            required: ['certifierName'],
            properties: {
              certifierInfoTitle: titleSchema,
              certifierName: fullNameSchema,
            },
          },
        },
        page3: {
          path: 'certification/address',
          title: 'Certification',
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: {
            certifierInfoTitle: inlineTitleUI(
              'Your mailing address',
              "We'll send any important information about your application to this address",
            ),
            certifierAddress: addressUI(),
          },
          schema: {
            type: 'object',
            required: ['certifierAddress'],
            properties: {
              certifierInfoTitle: titleSchema,
              certifierAddress: addressSchema(),
            },
          },
        },
        page4: {
          path: 'certification/phone',
          title: 'Certification',
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: {
            certifierInfoTitle: inlineTitleUI('Your phone number'),
            certifierPhone: phoneUI(),
          },
          schema: {
            type: 'object',
            required: ['certifierPhone'],
            properties: {
              certifierInfoTitle: titleSchema,
              certifierPhone: phoneSchema,
            },
          },
        },
        page5: {
          path: 'certification/relationship',
          title: 'Certification',
          depends: formData => get('certifierRole', formData) === 'other',
          uiSchema: {
            certifierInfoTitle: inlineTitleUI(
              "Which of these best describes your relationship to this form's applicant(s)?",
            ),
            certifierRelationship: relationshipToVeteranUI('Applicant(s)'),
          },
          schema: {
            type: 'object',
            required: ['certifierRelationship'],
            properties: {
              certifierInfoTitle: titleSchema,
              certifierRelationship: {
                ...relationshipToVeteranSchema,
                required: [],
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
          title: 'Sponsor name and date of birth',
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Sponsor name and date of birth'),
            veteransFullName: fullNameUI(),
            sponsorDOB: dateOfBirthUI(),
          },
          schema: {
            type: 'object',
            required: ['sponsorDOB'],
            properties: {
              sponsorInfoTitle: titleSchema,
              veteransFullName: fullNameSchema,
              sponsorDOB: dateOfBirthSchema,
            },
          },
        },
        page7: {
          path: 'sponsor-information/ssn',
          title: 'Sponsor SSN and VA file number',
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Sponsor SSN or VA file number'),
            ssn: ssnOrVaFileNumberUI(),
          },
          schema: {
            type: 'object',
            required: ['ssn'],
            properties: {
              sponsorInfoTitle: titleSchema,
              ssn: ssnOrVaFileNumberSchema,
            },
          },
        },
        page8: {
          path: 'sponsor-information/status',
          title: 'Sponsor status',
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Sponsor status'),
            sponsorIsDeceased: yesNoUI({
              title: 'Is sponsor still living?',
              labels: {
                Y: 'Yes, sponsor is alive',
                N: 'No, sponsor is deceased',
              },
              yesNoReverse: true,
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
          title: 'Sponsor status',
          depends: formData => get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Sponsor status'),
            sponsorDOD: dateOfDeathUI(),
            sponsorDeathConditions: yesNoUI({
              title: 'Did sponsor pass away on active military service?',
              labels: {
                Y: 'Yes, sponsor passed away during active military service',
                N:
                  'No, sponsor did not pass away during active military service',
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['sponsorDOD'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorDOD: dateOfDeathSchema,
              sponsorDeathConditions: yesNoSchema,
            },
          },
        },
        page10: {
          path: 'sponsor-information/address',
          title: "Sponsor's address",
          depends: formData => !get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI("Sponsor's address"),
            sponsorAddress: {
              ...addressUI({
                labels: {
                  militaryCheckbox:
                    'My sponsor lives on a United States military base outside the country.',
                },
              }),
            },
          },
          schema: {
            type: 'object',
            required: ['sponsorAddress'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorAddress: addressSchema(),
            },
          },
        },
        page11: {
          path: 'sponsor-information/phone',
          title: "Sponsor's phone number",
          depends: formData => !get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI("Sponsor's phone number"),
            sponsorPhone: {
              ...phoneUI({
                title: 'Home phone number',
              }),
              'ui:required': () => true,
            },
            sponsorPhoneAlt: {
              ...phoneUI({ title: 'Mobile phone number' }),
            },
          },
          schema: {
            type: 'object',
            required: ['sponsorPhone'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorPhone: phoneSchema,
              sponsorPhoneAlt: phoneSchema,
            },
          },
        },
        page12: {
          path: 'sponsor-information/complete',
          title: 'Sponsor information complete',
          uiSchema: {
            'view:alert': {
              'ui:title': SectionCompleteAlert,
            },
            'ui:options': {
              keepInPageOnReview: false,
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:alert': {
                type: 'object',
                properties: {},
              },
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
            applicants: {
              'ui:options': {
                viewField: ApplicantField,
                keepInPageOnReview: true,
                useDlWrap: false,
              },
              'ui:errorMessages': {
                minItems: 'Must have at least one applicant listed.',
              },
              items: {
                'ui:title': ApplicantField,
                applicantName: fullNameUI(),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              applicants: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    applicantName: fullNameSchema,
                  },
                },
              },
            },
          },
        },
        page14: {
          path: 'applicant-information/:index/ssn-dob',
          arrayPath: 'applicants',
          title: item =>
            `${item?.applicantName?.first ||
              'Applicant'} - SSN and date of birth`,
          showPagePerItem: true,
          uiSchema: {
            applicants: {
              'ui:options': {
                viewField: ApplicantField,
                keepInPageOnReview: true,
              },
              'ui:errorMessages': {
                minItems: 'Must have at least one applicant listed.',
              },
              items: {
                'ui:title': ApplicantField,
                applicantSSN: ssnUI(),
                applicantDOB: dateOfBirthUI(),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              applicants: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    applicantSSN: ssnSchema,
                    applicantDOB: dateOfBirthSchema,
                  },
                },
              },
            },
          },
        },
        page15: {
          path: 'applicant-information/:index/address',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${item?.applicantName?.first || 'Applicant'} - address`,
          uiSchema: {
            'ui:title': 'Applicant Address',
            applicants: {
              items: {
                'ui:title': ApplicantField,
                applicantAddress: addressUI(),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              applicants: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    applicantAddress: addressSchema(),
                  },
                },
              },
            },
          },
        },
        page16: {
          path: 'applicant-information/:index/email-phone',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${item?.applicantName?.first || 'Applicant'} - email and phone`,
          uiSchema: {
            'ui:title': 'Applicant Email and Phone',
            applicants: {
              items: {
                'ui:title': ApplicantField,
                applicantEmailAddress: emailUI(),
                applicantPhone: phoneUI(),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              applicants: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    applicantEmailAddress: emailSchema,
                    applicantPhone: phoneSchema,
                  },
                },
              },
            },
          },
        },
        page17: {
          path: 'applicant-information/:index/gender',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${item?.applicantName?.first || 'Applicant'} - gender`,
          uiSchema: {
            'ui:title': 'Applicant Gender',
            applicants: {
              items: {
                'ui:title': ApplicantField,
                applicantGender: radioUI({
                  title: 'Gender',
                  required: true,
                  labels: { male: 'Male', female: 'Female' },
                }),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              applicants: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    applicantGender: radioSchema(['male', 'female']),
                  },
                },
              },
            },
          },
        },
        page18: {
          path: 'applicant-information/:index/additional-info',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${item?.applicantName?.first || 'Applicant'} - health insurance`,
          uiSchema: {
            'ui:title': 'Applicant Health Insurance and Relationship',
            applicants: {
              'ui:options': {
                viewField: ApplicantField,
                keepInPageOnReview: true,
              },
              items: {
                'ui:title': ApplicantField,
                applicantEnrolledInMedicare: yesNoUI({
                  title: 'Enrolled in Medicare',
                }),
                applicantMedicareCardFront: {
                  ...fileUploadUI('Medicare card (Front)', {
                    fileTypes,
                    fileUploadUrl: `${
                      environment.API_URL
                    }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
                    hideIf: (formData, index) =>
                      !formData.applicants[index].applicantEnrolledInMedicare,
                  }),
                },
                applicantMedicareCardBack: {
                  ...fileUploadUI('Medicare card (Back)', {
                    fileTypes,
                    fileUploadUrl: `${
                      environment.API_URL
                    }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
                    hideIf: (formData, index) =>
                      !formData.applicants[index].applicantEnrolledInMedicare,
                  }),
                },
                applicantEnrolledInOHI: yesNoUI({
                  title: 'Enrolled in Other Health Insurance (OHI)',
                }),
                applicantOHICardFront: {
                  ...fileUploadUI('OHI card (Front)', {
                    fileTypes,
                    fileUploadUrl: `${
                      environment.API_URL
                    }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
                    hideIf: (formData, index) =>
                      !formData.applicants[index].applicantEnrolledInOHI,
                  }),
                },
                applicantOHICardBack: {
                  ...fileUploadUI('OHI card (Back)', {
                    fileTypes,
                    fileUploadUrl: `${
                      environment.API_URL
                    }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
                    hideIf: (formData, index) =>
                      !formData.applicants[index].applicantEnrolledInOHI,
                  }),
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              applicants: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    applicantEnrolledInMedicare: yesNoSchema,
                    applicantMedicareCardFront: attachmentsSchema,
                    applicantMedicareCardBack: attachmentsSchema,
                    applicantEnrolledInOHI: yesNoSchema,
                    applicantOHICardFront: attachmentsSchema,
                    applicantOHICardBack: attachmentsSchema,
                  },
                },
              },
            },
          },
        },
        page19: {
          path: 'applicant-information/:index/relationship',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${item?.applicantName?.first ||
              'Applicant'} - relationship to sponsor`,
          uiSchema: {
            applicants: {
              items: {
                'ui:title': ApplicantField, // shows on each page of array
                applicantRelationshipToSponsor: {
                  ...relationshipToVeteranUI({
                    personTitle: 'Sponsor',
                    labelHeaderLevel: '', // no header
                  }),
                  'ui:required': () => true,
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              applicants: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    applicantRelationshipToSponsor: relationshipToVeteranSchema,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
