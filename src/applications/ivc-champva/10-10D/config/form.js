import {
  fullNameSchema,
  fullNameUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
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
  yesNoSchema,
  yesNoUI,
  radioSchema,
  radioUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from '@department-of-veterans-affairs/platform-forms-system/get';

import { relationshipToVeteranUI } from '../components/customRelationshipPattern';
import transformForSubmit from './submitTransformer';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ApplicantField from '../components/Applicant/ApplicantField';
import ConfirmationPage from '../containers/ConfirmationPage';
import getNameKeyForSignature from '../helpers/signatureKeyName';
import {
  sponsorWording,
  applicantWording,
  firstPersonLanguage,
  thirdPersonLanguage,
} from '../helpers/wordingCustomization';
import {
  thirdPartyInfoUiSchema,
  thirdPartyInfoSchema,
} from '../components/ThirdPartyInfo';

import {
  medicareStatusThirdPersonUiSchema,
  medicareStatusFirstPersonUiSchema,
  medicarePartChecboxGroupThirdPersonUiSchema,
  medicarePartChecboxGroupFirstPersonUiSchema,
  medicarePartCheckboxGroupSchema,
  medicareStatusSchema,
} from '../pages/applicantMedicareStatus';

import {
  ohiStatusThirdPersonUiSchema,
  ohiStatusFirstPersonUiSchema,
  ohiStatusSchema,
} from '../pages/applicantOHIStatus';

import {
  relationshipToSponsorFirstPersonUiSchema,
  relationshipToSponsorFirstPersonPastTenseUiSchema,
  relationshipToSponsorThirdPersonUiSchema,
  relationshipToSponsorThirdPersonPastTenseUiSchema,
  relationshipToSponsorSchema,
} from '../pages/applicantRelationshipToSponsor';

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
  title: 'Apply for CHAMPVA benefits',
  subTitle: 'Form 10-10d',
  defaultDefinitions: {},
  chapters: {
    certifierInformation: {
      title: 'Signer information',
      pages: {
        page1: {
          path: 'your-information/description',
          title: 'Which of these best describes you?',
          uiSchema: {
            ...titleUI(
              'Your relationship to this form',
              'We use this information to contact the signer of this form and verify other details.',
            ),
            certifierRole: radioUI({
              title: 'Which of these best describes you?',
              required: true,
              labels: {
                applicant: "I'm an applicant applying for CHAMPVA benefits",
                sponsor:
                  "I'm a Veteran applying for my spouse, dependents, or caretaker",
                other:
                  "I'm a third party representative, power of attorney or VSO (Veterans Service Officer)",
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
            certifierInfoTitle: titleUI('Your name'),
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
            certifierInfoTitle: titleUI(
              'Your mailing address',
              'We’ll send any updates about your signer certification to this address',
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
            certifierInfoTitle: titleUI('Your contact information'),
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
            ...titleUI(
              "What's your relationship to the Applicant(s)?",
              'Depending on your response, additional documentation may be required to determine eligibility',
            ),
            certifierRelationship: relationshipToVeteranUI({
              personTitle: 'Applicant(s)',
              labelHeaderLevel: 0,
            }),
          },
          schema: {
            type: 'object',
            required: ['certifierRelationship'],
            properties: {
              titleSchema,
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
          title: formData =>
            `${sponsorWording(formData)} name and date of birth`,
          uiSchema: {
            ...titleUI(
              ({ formData }) =>
                `${sponsorWording(formData)} name and date of birth`,
              ({ formData }) =>
                formData?.certifierRole === 'sponsor'
                  ? 'Please provide your information. We use this information to identify eligibility.'
                  : `Please provide the information for the Veteran that you're connected to (called your "Sponsor"). We use this information to identify eligibility.`,
            ),
            veteransFullName: fullNameUI(),
            sponsorDOB: dateOfBirthUI(),
          },
          schema: {
            type: 'object',
            required: ['sponsorDOB'],
            properties: {
              titleSchema,
              veteransFullName: fullNameSchema,
              sponsorDOB: dateOfBirthSchema,
            },
          },
        },
        page7: {
          path: 'sponsor-information/ssn',
          title: formData =>
            `${sponsorWording(formData)} identification information`,
          uiSchema: {
            ...titleUI(
              ({ formData }) =>
                `${sponsorWording(formData)} identification information`,
              'You must enter either a Social Security number or VA File number',
            ),
            ssn: ssnOrVaFileNumberUI(),
          },
          schema: {
            type: 'object',
            required: ['ssn'],
            properties: {
              titleSchema,
              // TODO: remove description from above va file number
              ssn: ssnOrVaFileNumberSchema,
            },
          },
        },
        page8: {
          path: 'sponsor-information/status',
          title: 'Sponsor status',
          depends: formData => get('certifierRole', formData) !== 'sponsor',
          uiSchema: {
            sponsorInfoTitle: titleUI('Sponsor status'),
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
          title: 'Sponsor status (continued)',
          depends: formData => get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: titleUI('Sponsor status (continued)'),
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
        // If person filling out the form is the sponsor:
        page10a: {
          path: 'sponsor-information/your-address',
          title: 'Your mailing address',
          depends: formData => get('certifierRole', formData) === 'sponsor',
          uiSchema: {
            ...titleUI('Your mailing address'),
            sponsorHasAddress: radioUI({
              title: 'Do you have a current mailing address?',
              hint:
                "If we have a way to contact you, we'll be able to process this request faster. But we don't require a mailing address for this request.",
              required: true,
              labels: {
                yes: 'Yes, I know my current mailing address',
                no: "No, I don't have a current mailing address",
                unknown: "I don't know if I have a current mailing address",
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['sponsorHasAddress'],
            properties: {
              titleSchema,
              sponsorHasAddress: radioSchema(['yes', 'no', 'unknown']),
            },
          },
        },
        page10a1: {
          path: 'sponsor-information/your-address-continued',
          title: 'Your mailing address (continued)',
          depends: formData =>
            get('sponsorHasAddress', formData) === 'yes' &&
            get('certifierRole', formData) === 'sponsor',
          uiSchema: {
            ...titleUI(
              'Your mailing address (continued)',
              "We'll send any important information about your application to this address.",
            ),
            sponsorAddress: {
              ...addressUI({
                labels: {
                  militaryCheckbox:
                    'I live on a United States military base outside the country.',
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
        // If person filling out the form is NOT the sponsor:
        page10b: {
          path: 'sponsor-information/address',
          title: "Sponsor's mailing address",
          depends: formData =>
            !get('sponsorIsDeceased', formData) &&
            get('certifierRole', formData) !== 'sponsor',
          uiSchema: {
            ...titleUI("Sponsor's mailing address"),
            sponsorHasAddress: radioUI({
              title: 'Does the Sponsor have a current mailing address?',
              hint:
                "If we have a way to contact the Sponsor, we'll be able to process this request faster. But we don't require a mailing address for this request.",
              required: true,
              labels: {
                yes: "Yes, I know the Sponsor's current mailing address",
                no: "No, the Sponsor doesn't have a current mailing address",
                unknown:
                  "I don't know if the Sponsor has a current mailing address",
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['sponsorHasAddress'],
            properties: {
              titleSchema,
              sponsorHasAddress: radioSchema(['yes', 'no', 'unknown']),
            },
          },
        },
        page10b1: {
          path: 'sponsor-information/address-continued',
          title: "Sponsor's mailing address (continued)",
          depends: formData =>
            !get('sponsorIsDeceased', formData) &&
            get('sponsorHasAddress', formData) === 'yes' &&
            get('certifierRole', formData) !== 'sponsor',
          uiSchema: {
            ...titleUI(
              "Sponsor's mailing address (continued)",
              "We'll send any important information about your application to this address.",
            ),
            sponsorAddress: {
              ...addressUI({
                labels: {
                  militaryCheckbox:
                    'My Sponsor lives on a United States military base outside the country.',
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
        // If person filling out the form is the sponsor:
        page11a: {
          path: 'sponsor-information/your-phone',
          title: 'Your contact information',
          depends: formData =>
            !get('sponsorIsDeceased', formData) &&
            get('certifierRole', formData) === 'sponsor',
          uiSchema: {
            ...titleUI('Your contact information'),
            sponsorHasPhone: radioUI({
              title: 'Do you have a current phone number?',
              hint:
                "If we have a way to contact you, we'll be able to process this request faster. But we don't require a mailing address for this request.",
              required: true,
              labels: {
                yes: 'Yes, I know my current phone number',
                no: "No, I don't have a current phone number",
                unknown: "I don't know if I have a current phone number",
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['sponsorHasPhone'],
            properties: {
              titleSchema,
              sponsorHasPhone: radioSchema(['yes', 'no', 'unknown']),
            },
          },
        },
        // If person filling out the form is NOT the sponsor:
        page11b: {
          path: 'sponsor-information/phone',
          title: "Sponsor's contact information",
          depends: formData =>
            !get('sponsorIsDeceased', formData) &&
            get('certifierRole', formData) !== 'sponsor',
          uiSchema: {
            ...titleUI("Sponsor's contact information"),
            sponsorHasPhone: radioUI({
              title: 'Does the Sponsor have a current phone number?',
              hint:
                "If we have a way to contact the Sponsor, we'll be able to process this request faster. But we don't require a mailing address for this request.",
              required: true,
              labels: {
                yes: "Yes, I know the Sponsor's current phone number",
                no: "No, the Sponsor doesn't have a current phone number",
                unknown:
                  "I don't know if the Sponsor has a current phone number",
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['sponsorHasPhone'],
            properties: {
              titleSchema,
              sponsorHasPhone: radioSchema(['yes', 'no', 'unknown']),
            },
          },
        },
        page11: {
          path: 'sponsor-information/phone-continued',
          title: formData =>
            `${sponsorWording(formData)} contact information (continued)`,
          depends: formData =>
            get('sponsorHasPhone', formData) === 'yes' &&
            !get('sponsorIsDeceased', formData),
          uiSchema: {
            ...titleUI(
              ({ formData }) =>
                `${sponsorWording(formData)} contact information (continued)`,
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
          path: 'applicant-information',
          arrayPath: 'applicants',
          title: 'Applicants',
          uiSchema: {
            ...titleUI(
              'Applicant name and date of birth',
              'Please tell us the names of the applicants that you want to enroll in CHAMPVA. You can only add up to 3 applicants at a time. If you have more than 3 applicants then you will need to submit a separate form for each applicant.',
            ),
            applicants: {
              'ui:options': {
                viewField: ApplicantField,
                keepInPageOnReview: true,
                useDlWrap: false,
              },
              'ui:errorMessages': {
                minItems: 'Must have at least one applicant listed.',
                maxItems: 'A maximum of three applicants may be added.',
              },
              items: {
                applicantName: fullNameUI(),
                applicantDOB: dateOfBirthUI({ required: true }),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              applicants: {
                type: 'array',
                minItems: 1,
                maxItems: 3,
                items: {
                  type: 'object',
                  required: ['applicantDOB'],
                  properties: {
                    titleSchema,
                    applicantName: fullNameSchema,
                    applicantDOB: dateOfBirthSchema,
                  },
                },
              },
            },
          },
        },
        page14: {
          path: 'applicant-information/:index/ssn-dob',
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
                  'You must enter either a VA file number or Social Security number',
                ),
                applicantSSN: ssnOrVaFileNumberUI(),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              applicants: {
                type: 'array',
                minItems: 1,
                maxItems: 3,
                items: {
                  type: 'object',
                  properties: {
                    titleSchema,
                    applicantSSN: ssnOrVaFileNumberSchema,
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
          title: item => `${applicantWording(item)} mailing address`,
          uiSchema: {
            applicants: {
              items: {
                ...titleUI(
                  ({ formData }) =>
                    `${applicantWording(formData)} mailing address`,
                  'We’ll send any important information about your application to this address.',
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
          schema: {
            type: 'object',
            properties: {
              applicants: {
                type: 'array',
                minItems: 1,
                maxItems: 3,
                items: {
                  type: 'object',
                  properties: {
                    titleSchema,
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
          title: item => `${applicantWording(item)} contact information`,
          uiSchema: {
            applicants: {
              items: {
                ...titleUI(
                  ({ formData }) =>
                    `${applicantWording(formData)} contact information`,
                ),
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
                maxItems: 3,
                items: {
                  type: 'object',
                  properties: {
                    titleSchema,
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
          title: item => `${applicantWording(item)} gender`,
          uiSchema: {
            'ui:title': 'Applicant Gender',
            applicants: {
              items: {
                ...titleUI(
                  ({ formData }) => `${applicantWording(formData)} gender`,
                ),
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
                maxItems: 3,
                items: {
                  type: 'object',
                  properties: {
                    titleSchema,
                    applicantGender: radioSchema(['male', 'female']),
                  },
                },
              },
            },
          },
        },
        // Using "depends" to route us to the relationship page with
        // the correct wording based on several conditions including
        // whether or not we're an applicant/sponsor/certifier and the
        // status of the sponsor (deceased/alive):
        page18: {
          path: 'applicant-information/:index/relationship',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} relationship to sponsor`,
          depends: (formData, index) =>
            firstPersonLanguage(formData, index) &&
            !get('sponsorIsDeceased', formData),
          uiSchema: relationshipToSponsorFirstPersonUiSchema,
          schema: relationshipToSponsorSchema,
        },
        page18b: {
          path: 'applicant-information/:index/relationship-b',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} relationship to sponsor`,
          depends: (formData, index) =>
            firstPersonLanguage(formData, index) &&
            get('sponsorIsDeceased', formData),
          uiSchema: relationshipToSponsorFirstPersonPastTenseUiSchema,
          schema: relationshipToSponsorSchema,
        },
        page18c: {
          path: 'applicant-information/:index/relationship-c',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} relationship to sponsor`,
          depends: (formData, index) =>
            thirdPersonLanguage(formData, index) &&
            !get('sponsorIsDeceased', formData), // Sponsor is alive
          uiSchema: relationshipToSponsorThirdPersonUiSchema,
          schema: relationshipToSponsorSchema,
        },
        page18d: {
          path: 'applicant-information/:index/relationship-d',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} relationship to sponsor`,
          depends: (formData, index) =>
            thirdPersonLanguage(formData, index) &&
            get('sponsorIsDeceased', formData), // Sponsor is deceased
          uiSchema: relationshipToSponsorThirdPersonPastTenseUiSchema,
          schema: relationshipToSponsorSchema,
        },
        page19: {
          path: 'applicant-information/:index/medicare-status',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item => `${applicantWording(item)} Medicare status`,
          depends: (formData, index) => thirdPersonLanguage(formData, index),
          uiSchema: medicareStatusThirdPersonUiSchema,
          schema: medicareStatusSchema,
        },
        page19a: {
          path: 'applicant-information/:index/medicare-status-a',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => firstPersonLanguage(formData, index),
          title: item => `${applicantWording(item)} Medicare status`,
          uiSchema: medicareStatusFirstPersonUiSchema,
          schema: medicareStatusSchema,
        },
        page20: {
          path: 'applicant-information/:index/medicare-status-continued',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) =>
            get(
              'applicantMedicareStatus',
              // On first pass, index is always undefined but then populates on next cycle
              formData?.applicants?.[`${index || 0}`],
            ) === 'enrolled' && thirdPersonLanguage(formData, index),
          title: item =>
            `${applicantWording(item)} Medicare status (continued)`,
          uiSchema: medicarePartChecboxGroupThirdPersonUiSchema,
          schema: medicarePartCheckboxGroupSchema,
        },
        page20a: {
          path: 'applicant-information/:index/medicare-status-continued-a',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) =>
            get(
              'applicantMedicareStatus',
              formData?.applicants?.[`${index || 0}`],
            ) === 'enrolled' && firstPersonLanguage(formData, index),
          title: item =>
            `${applicantWording(item)} Medicare status (continued)`,
          uiSchema: medicarePartChecboxGroupFirstPersonUiSchema,
          schema: medicarePartCheckboxGroupSchema,
        },
        page21: {
          path: 'applicant-information/:index/ohi',
          arrayPath: 'applicants',
          showPagePerItem: true,
          depends: (formData, index) => firstPersonLanguage(formData, index),
          title: item =>
            `${applicantWording(item)} other health insurance status`,
          uiSchema: ohiStatusFirstPersonUiSchema,
          schema: ohiStatusSchema,
        },
        page21a: {
          path: 'applicant-information/:index/ohi-a',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: item =>
            `${applicantWording(item)} other health insurance status`,
          depends: (formData, index) => thirdPersonLanguage(formData, index),
          uiSchema: ohiStatusThirdPersonUiSchema,
          schema: ohiStatusSchema,
        },
      },
    },
  },
};

export default formConfig;
