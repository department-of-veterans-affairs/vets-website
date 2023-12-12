// import fullSchema from 'vets-json-schema/dist/10-10D-schema.json';
import get from 'platform/utilities/data/get';

import {
  fullNameSchema,
  fullNameUI,
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberUI,
  ssnSchema,
  ssnUI,
  addressSchema,
  addressUI,
  checkboxGroupSchema,
  checkboxGroupUI,
  relationshipToVeteranSchema,
  relationshipToVeteranUI,
  phoneSchema,
  phoneUI,
  emailSchema,
  emailUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  dateOfDeathSchema,
  dateOfDeathUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  yesNoSchema,
  yesNoUI,
  radioSchema,
  radioUI,
  titleSchema,
  inlineTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FormFooter from 'platform/forms/components/FormFooter';

import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ApplicantField from '../components/applicant/ApplicantField';
import GetFormHelp from '../components/GetFormHelp';
import ConfirmationPage from '../containers/ConfirmationPage';
import transformForSubmit from './submit-transformer';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

/** @type {PageSchema} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit,
  // submitUrl: '/v0/api',
  // submit: () =>
  //  Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'champva-10-10d-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-10D',
  v3SegmentedProgressBar: true,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your CHAMPVA benefits application (10-10D) is in progress.',
    //   expired: 'Your saved CHAMPVA benefits application (10-10D) has expired. If you want to apply for CHAMPVA benefits, please start a new application.',
    //   saved: 'Your CHAMPVA benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for CHAMPVA benefits.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA benefits.',
  },
  title: 'Apply for CHAMPVA Benefits',
  subTitle: 'Form 10-10d',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  defaultDefinitions: {},
  chapters: {
    sponsorInformation: {
      title: 'Sponsor Information',
      pages: {
        page1: {
          path: 'sponsor-information/personal-information',
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
        page2: {
          path: 'sponsor-information/ssn',
          title: 'Sponsor SSN and VA file number',
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Sponsor SSN and VA file number'),
            ssn: ssnOrVaFileNumberUI(),
          },
          schema: {
            type: 'object',
            required: ['ssn'],
            properties: {
              sponsorInfoTitle: titleSchema,
              ssn: ssnOrVaFileNumberSchema,
              // TODO: update transformer to accomodate VA file num being optional
            },
          },
        },
        page3: {
          // TODO:
          // - verify that date of death is not before date of birth?
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
        // IF sponsor IS dead - date of death/how he died
        page4: {
          path: 'sponsor-information/status-continued',
          title: 'Sponsor status continued',
          depends: formData => get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Sponsor status continued'), // TODO: different keyname for inline titles?
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
            required: ['sponsorDOD', 'sponsorDeathConditions'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorDOD: dateOfDeathSchema,
              sponsorDeathConditions: yesNoSchema,
            },
          },
        },
        // IF sponsor IS dead - relationship to sponsor with deceased wording
        page5: {
          path: 'sponsor-information/status-relationship',
          title: 'Relationship to Sponsor',
          depends: formData => get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Relationship to Sponsor'),
            // TODO: is this different from the certifier and applicant? Or is this one of those?
            certifierRelationshipToSponsor: {
              // TODO: update wording on here to be past tense
              ...relationshipToVeteranUI('Sponsor'),
              'ui:required': () => true,
            },
          },
          schema: {
            type: 'object',
            properties: {
              sponsorInfoTitle: titleSchema,
              certifierRelationshipToSponsor: relationshipToVeteranSchema,
            },
          },
        },
        // IF sponsor IS dead - skip sponsor address
        page6: {
          path: 'sponsor-information/address',
          title: 'Sponsor Address',
          depends: formData => !get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI("Sponsor's address"),
            sponsorNoAddress: checkboxGroupUI({
              title: ' ',
              required: false,
              labels: {
                hasNoAddress:
                  "My sponsor does not have a permanent address/I don't know my sponsor's permanent address.",
              },
            }),
            sponsorAddress: {
              ...addressUI({
                labels: {
                  militaryCheckbox:
                    'My sponsor lives on a United States military base outside the country.',
                },
                required: {
                  country: formData => !formData.sponsorNoAddress.hasNoAddress,
                  street: formData => !formData.sponsorNoAddress.hasNoAddress,
                  city: formData => !formData.sponsorNoAddress.hasNoAddress,
                  state: formData => !formData.sponsorNoAddress.hasNoAddress,
                  postalCode: formData =>
                    !formData.sponsorNoAddress.hasNoAddress,
                },
              }),
            },
          },
          // TODO: Conditionally require address based on checkbox
          // - will need to move checkbox to a previous page.
          schema: {
            type: 'object',
            required: ['sponsorAddress'],
            properties: {
              sponsorInfoTitle: titleSchema,
              sponsorNoAddress: checkboxGroupSchema(['hasNoAddress']),
              sponsorAddress: addressSchema(),
            },
          },
        },
        page7: {
          path: 'sponsor-information/phone',
          title: "Sponsor's phone",
          depends: formData => !get('sponsorIsDeceased', formData),
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI("Sponsor's phone number"),
            sponsorNoPhone: checkboxGroupUI({
              title: ' ',
              required: false,
              labels: {
                hasNoPhone:
                  "My sponsor does not have a phone number/I don't know my sponsor's phone number",
              },
            }),
            sponsorPhone: {
              ...phoneUI({
                title: 'Home phone number',
              }),
              'ui:required': formData => !formData.sponsorNoPhone.hasNoPhone,
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
              sponsorNoPhone: checkboxGroupSchema(['hasNoPhone']),
              sponsorPhone: phoneSchema,
              sponsorPhoneAlt: phoneSchema,
            },
          },
        },
        // IF sponsor IS alive - relationship to sponsor
        page8_: {
          path: 'sponsor-information/status-relationship-current',
          title: 'Relationship to Sponsor',
          depends: formData => !get('sponsorIsDeceased', formData),
          // TODO: is this different from the certifier and applicant? Or is this one of those?
          uiSchema: {
            sponsorInfoTitle: inlineTitleUI('Relationship to Sponsor'),
            certifierRelationshipToSponsorCurrent: {
              ...relationshipToVeteranUI('Sponsor'),
              'ui:required': () => true,
            },
          },
          schema: {
            type: 'object',
            properties: {
              sponsorInfoTitle: titleSchema,
              certifierRelationshipToSponsorCurrent: relationshipToVeteranSchema,
            },
          },
        },
      },
    },
    /**
     * NOTE: After this point, the form has not been mocked up.
     * The following chapters/pages are not in any way final.
     */
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        page8: {
          path: 'applicant-information',
          arrayPath: 'applicants',
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
        page9: {
          path: 'applicant-information/:index/ssn-dob',
          arrayPath: 'applicants',
          title: 'Applicant SSN and Date of Birth', // This only shows up on the review page
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
        page10: {
          path: 'applicant-information/:index/address',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: 'Applicant Address',
          uiSchema: {
            'ui:title': 'Applicant Address',
            applicants: {
              'ui:options': {
                viewField: ApplicantField, // TODO: do we need this for each page?
                keepInPageOnReview: true,
              },
              'ui:errorMessages': {
                minItems: 'Must have at least one applicant listed.', // TODO: better msg
              },
              items: {
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
        page11: {
          path: 'applicant-information/:index/email-phone',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: 'Applicant Email and Phone',
          uiSchema: {
            'ui:title': 'Applicant Email and Phone',
            applicants: {
              'ui:options': {
                viewField: ApplicantField, // TODO: do we need this for each page?
                keepInPageOnReview: true,
              },
              'ui:errorMessages': {
                minItems: 'Must have at least one applicant listed.', // TODO: better msg
              },
              items: {
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
        page12: {
          path: 'applicant-information/:index/gender',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: 'Applicant Gender',
          uiSchema: {
            'ui:title': 'Applicant Gender',
            applicants: {
              'ui:options': {
                viewField: ApplicantField, // TODO: do we need this for each page?
                keepInPageOnReview: true,
              },
              'ui:errorMessages': {
                minItems: 'Must have at least one applicant listed.', // TODO: better msg
              },
              items: {
                applicantGender: radioUI({
                  title: 'Gender',
                  required: true,
                  labels: {
                    male: 'Male',
                    female: 'Female',
                  },
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
        page13: {
          path: 'applicant-information/:index/additional-info',
          arrayPath: 'applicants',
          showPagePerItem: true,
          title: 'Applicant Health Insurance and Relationship',
          uiSchema: {
            'ui:title': 'Applicant Health Insurance and Relationship',
            applicants: {
              'ui:options': {
                viewField: ApplicantField, // TODO: do we need this for each page?
                keepInPageOnReview: true,
              },
              'ui:errorMessages': {
                minItems: 'Must have at least one applicant listed.', // TODO: better msg
              },
              items: {
                applicantEnrolledInMedicare: radioUI({
                  title: 'Enrolled in Medicare',
                  required: true,
                  labels: {
                    yes: 'Yes',
                    no: 'No',
                  },
                }),
                applicantEnrolledInOHI: radioUI({
                  title: 'Enrolled in Other Health Insurance',
                  required: true,
                  labels: {
                    yes: 'Yes',
                    no: 'No',
                  },
                }),
                applicantRelationshipToSponsor: {
                  ...relationshipToVeteranUI('Sponsor'),
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
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    applicantEnrolledInMedicare: radioSchema(['yes', 'no']),
                    applicantEnrolledInOHI: radioSchema(['yes', 'no']),
                    applicantRelationshipToSponsor: relationshipToVeteranSchema,
                  },
                },
              },
            },
          },
        },
      },
    },
    certification: {
      title: 'Certification',
      pages: {
        page14: {
          path: 'certification',
          title: 'Certification',
          uiSchema: {
            signature: yesNoUI({ title: 'Do you accept?' }),
            certifierName: {
              ...fullNameUI(),
              'ui:options': {
                hideIf: formData => !get('signature', formData),
              },
              'ui:required': formData => formData.verifyCertifier,
            },
            dateOfCertification: {
              ...currentOrPastDateUI(),
              'ui:required': formData => formData.verifyCertifier,
            },
            verifyCertifier: {
              ...yesNoUI({
                title: 'Are you signing on behalf of applicant(s)?',
              }),
              'ui:options': {
                hideIf: formData => !get('signature', formData),
              },
              'ui:required': formData => formData.signature,
            },
            certifierRelationship: {
              ...relationshipToVeteranUI('Applicant(s)'),
              'ui:required': formData => formData.verifyCertifier,
              'ui:options': {
                hideIf: formData => !get('verifyCertifier', formData),
              },
            },
            certifierPhone: {
              ...phoneUI(),
              'ui:options': {
                hideIf: formData => !get('verifyCertifier', formData),
              },
              'ui:required': formData => formData.verifyCertifier,
            },
            certifierAddress: {
              ...addressUI(),
              'ui:options': {
                hideIf: formData => !get('verifyCertifier', formData),
              },
              'ui:required': formData => formData.verifyCertifier,
            },
          },
          schema: {
            type: 'object',
            required: ['signature', 'verifyCertifier'],
            properties: {
              signature: yesNoSchema,
              certifierName: fullNameSchema,
              dateOfCertification: currentOrPastDateSchema,
              verifyCertifier: yesNoSchema,
              certifierRelationship: relationshipToVeteranSchema,
              certifierAddress: addressSchema(),
              certifierPhone: phoneSchema,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
