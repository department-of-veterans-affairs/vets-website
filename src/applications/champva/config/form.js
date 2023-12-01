// import fullSchema from 'vets-json-schema/dist/10-10D-schema.json';
import get from 'platform/utilities/data/get';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  ssnSchema,
  ssnUI,
  vaFileNumberSchema,
  vaFileNumberUI,
  addressSchema,
  addressUI,
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
} from 'platform/forms-system/src/js/web-component-patterns';

import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ApplicantField from '../components/applicant/ApplicantField';
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
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
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
  title: 'Application for CHAMPVA Benefits',
  defaultDefinitions: {},
  chapters: {
    sponsorName: {
      title: 'Sponsor Name',
      pages: {
        page1: {
          path: 'sponsor-name',
          title: 'Sponsor Name',
          uiSchema: {
            veteransFullName: fullNameNoSuffixUI(),
          },
          schema: {
            type: 'object',
            properties: {
              veteransFullName: fullNameNoSuffixSchema,
            },
          },
        },
      },
    },
    sponsorSSN: {
      title: 'Sponsor SSN',
      pages: {
        page2: {
          path: 'sponsor-ssn',
          title: 'Sponsor Social Security Number',
          uiSchema: {
            ssn: ssnUI(),
          },
          schema: {
            type: 'object',
            required: ['ssn'],
            properties: {
              ssn: ssnSchema,
            },
          },
        },
      },
    },
    sponsorVaFileNumber: {
      title: 'Sponsor VA File Number',
      pages: {
        page3: {
          path: 'va-file-number',
          title: 'VA File Number',
          uiSchema: {
            vaFileNumber: vaFileNumberUI(),
          },
          schema: {
            type: 'object',
            required: ['vaFileNumber'],
            properties: {
              vaFileNumber: vaFileNumberSchema,
            },
          },
        },
      },
    },
    sponsorAddress: {
      title: 'Sponsor Address',
      pages: {
        page4: {
          path: 'sponsor-address',
          title: 'Sponsor Address',
          uiSchema: {
            sponsorAddress: addressUI({
              labels: {
                militaryCheckbox:
                  'Sponsor lives on a U.S. military base outside the U.S.',
              },
            }),
          },
          schema: {
            type: 'object',
            properties: {
              sponsorAddress: addressSchema(),
            },
          },
        },
      },
    },
    // sponsorPhone: {
    //   title: 'Sponsor Phone',
    //   pages: {
    //     page5: {
    //       path: 'sponsor-phone-number',
    //       title: 'Sponsor Phone Number',
    //       uiSchema: {
    //         sponsorPhone: phoneUI(),
    //       },
    //       schema: {
    //         type: 'object',
    //         required: ['sponsorPhone'],
    //         properties: {
    //           sponsorPhone: phoneSchema,
    //         },
    //       },
    //     },
    //   },
    // },
    sponsorDateOfBirthAndDeath: {
      title: 'Sponsor Date of Birth',
      pages: {
        page6: {
          // TODO:
          // - verify that date of death is not before date of birth
          path: 'sponsor-dob',
          title: 'Sponsor Dates',
          schema: {
            type: 'object',
            required: ['sponsorDOB', 'sponsorIsDeceased'],
            properties: {
              sponsorDOB: dateOfBirthSchema,
              sponsorIsDeceased: yesNoSchema,
              sponsorDOD: dateOfDeathSchema,
              sponsorDeathConditions: yesNoSchema,
            },
          },
          uiSchema: {
            sponsorDOB: dateOfBirthUI(),
            sponsorIsDeceased: yesNoUI({
              title: 'Is the Veteran deceased?',
            }),
            sponsorDOD: {
              ...dateOfDeathUI(),
              'ui:options': {
                hideIf: formData => !get('sponsorIsDeceased', formData),
              },
              'ui:required': formData => formData.sponsorIsDeceased,
            },
            sponsorDeathConditions: {
              ...yesNoUI({
                title: 'Did the Veteran die while on active military service?',
              }),
              'ui:options': {
                hideIf: formData => !get('sponsorIsDeceased', formData),
              },
              'ui:required': formData => formData.sponsorIsDeceased,
            },
          },
        },
      },
    },
    sponsorDateOfMarriage: {
      title: 'Sponsor Date of Marriage',
      pages: {
        page7: {
          path: 'sponsor-dom',
          title: 'Sponsor Date of Marriage',
          schema: {
            type: 'object',
            properties: {
              sponsorDOM: currentOrPastDateSchema,
            },
          },
          uiSchema: {
            sponsorDOM: currentOrPastDateUI(),
          },
        },
      },
    },
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        page8: {
          path: 'applicant-information',
          arrayPath: 'applicants',
          uiSchema: {
            'ui:title': 'Applicant Information?',
            applicants: {
              'ui:options': {
                viewField: ApplicantField,
                keepInPageOnReview: true,
                useDlWrap: false,
              },
              'ui:errorMessages': {
                minItems: 'Must have at least one applicant listed.',
              },
              items: fullNameNoSuffixUI(),
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
                    applicantName: fullNameNoSuffixSchema,
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
          title: 'Applicant Health Insureance and Relationship',
          uiSchema: {
            'ui:title': 'Applicant Health Insureance and Relationship',
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
                  'ui:title': 'Relationship to Sponsor (i.e., spouse, child)',
                  'ui:webComponentField': VaTextInputField,
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
                    applicantRelationshipToSponsor: { type: 'string' },
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
              ...fullNameNoSuffixUI(),
              'ui:options': {
                hideIf: formData => !get('signature', formData),
              },
              'ui:required': formData => formData.verifyCertifier,
            },
            dateOfCertification: currentOrPastDateUI(),
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
              certifierName: fullNameNoSuffixSchema,
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
