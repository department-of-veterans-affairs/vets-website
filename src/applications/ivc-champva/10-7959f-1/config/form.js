import { cloneDeep, merge } from 'lodash';
import environment from 'platform/utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import {
  ssnOrVaFileNumberNoHintSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  addressUI,
  addressSchema,
  emailUI,
  emailSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { expandPhoneNumberToInternational } from './migrations';
import transformForSubmit from './submitTransformer';
import manifest from '../manifest.json';
import SubmissionError from '../../shared/components/SubmissionError';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../../shared/components/GetFormHelp';
import {
  ssnOrVaFileNumberCustomUI,
  CustomSSNReviewPage,
} from '../helpers/CustomSSN';
import {
  validAddressCharsOnly,
  validObjectCharsOnly,
} from '../../shared/validations';

// import mockdata from '../tests/e2e/fixtures/data/test-data.json';

const veteranFullNameUI = cloneDeep(fullNameUI());
veteranFullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit,
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  footerContent: GetFormHelp,
  trackingPrefix: '10-7959f-1-FMP-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  customText: {
    reviewPageTitle: 'Review and sign',
    submitButtonText: 'Submit',
  },
  downtime: {
    dependencies: [externalServices.pega, externalServices.form107959f1],
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'veteranFullName',
    },
  },
  submissionError: SubmissionError,
  formId: '10-7959F-1',
  saveInProgress: {
    messages: {
      inProgress: 'Your FMP registration (10-7959F-1) is in progress.',
      expired:
        'Your saved FMP benefits registration (10-7959F-1) has expired. If you want to register for Foreign Medical Program benefits, please start a new application.',
      saved: 'Your FMP benefits registration has been saved.',
    },
  },
  version: 1,
  migrations: [expandPhoneNumberToInternational],
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to register for FMP benefits.',
    noAuth:
      'Please sign in again to continue your registration for FMP benefits.',
  },
  title: 'Register for the Foreign Medical Program (FMP)',
  subTitle: 'FMP Registration Form (VA Form 10-7959f-1)',
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      {
        href: 'health-care',
        label: 'Health care',
      },
      {
        href: 'health-care/foreign-medical-program',
        label: 'Foreign Medical Program',
      },
      {
        href: '#content',
        label: 'Register for the Foreign Medical Program (FMP)',
      },
    ],
    homeVeteransAffairs: true,
    wrapping: true,
  }),
  defaultDefinitions: {},
  chapters: {
    applicantInformationChapter: {
      title: 'Personal information',
      pages: {
        page1: {
          // initialData: mockdata.data,
          path: 'veteran-information',
          title: 'Name and date of birth',
          uiSchema: {
            ...titleUI('Name and date of birth'),
            veteranFullName: veteranFullNameUI,
            veteranDateOfBirth: dateOfBirthUI({
              required: () => true,
              dataDogHidden: true,
            }),
            'ui:validations': [
              (errors, formData) =>
                validObjectCharsOnly(errors, null, formData, 'veteranFullName'),
            ],
          },
          messageAriaDescribedby: 'Name and date of birth',
          schema: {
            type: 'object',
            required: ['veteranFullName', 'veteranDateOfBirth'],
            properties: {
              titleSchema,
              veteranFullName: fullNameSchema,
              veteranDateOfBirth: dateOfBirthSchema,
            },
          },
        },
      },
    },
    identificationInformation: {
      title: 'Identification information',
      pages: {
        page2: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: {
            ...titleUI(
              `Identification information`,
              `You must enter either a Social Security number or VA file number.`,
            ),
            messageAriaDescribedby:
              'You must enter either a Social Security number or VA file number.',
            veteranSocialSecurityNumber: ssnOrVaFileNumberCustomUI(),
          },
          schema: {
            type: 'object',
            required: ['veteranSocialSecurityNumber'],
            properties: {
              titleSchema,
              veteranSocialSecurityNumber: ssnOrVaFileNumberNoHintSchema,
            },
          },
          CustomPageReview: CustomSSNReviewPage,
        },
      },
    },
    mailingAddress: {
      title: 'Mailing address',
      pages: {
        page3: {
          path: 'mailing-address',
          title: 'Mailing address ',
          uiSchema: {
            ...titleUI(
              'Mailing address',
              "We'll send any important information about your application to this address.",
            ),
            messageAriaDescribedby:
              "We'll send any important information about your application to this address.",
            veteranAddress: merge({}, addressUI(), {
              state: {
                'ui:errorMessages': {
                  required: 'Enter a valid State, Province, or Region',
                },
              },
            }),
            'ui:validations': [
              (errors, formData) =>
                validAddressCharsOnly(errors, null, formData, 'veteranAddress'),
            ],
          },
          schema: {
            type: 'object',
            required: ['veteranAddress'],
            properties: {
              titleSchema,
              veteranAddress: addressSchema(),
            },
          },
        },
      },
    },
    physicalAddress: {
      title: 'Home address',
      pages: {
        page4: {
          path: 'same-as-mailing-address',
          title: 'Home address status ',
          uiSchema: {
            ...titleUI('Home address status'),
            sameMailingAddress: yesNoUI({
              title: 'Is your home address the same as your mailing address?',
              labels: {
                Y: 'Yes',
                N: 'No',
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['sameMailingAddress'],
            properties: {
              titleSchema,
              sameMailingAddress: yesNoSchema,
            },
          },
        },
        page4a: {
          path: 'home-address',
          title: 'Home address ',
          depends: formData => formData.sameMailingAddress === false,
          uiSchema: {
            ...titleUI(`Home address`),
            physicalAddress: merge({}, addressUI(), {
              state: {
                'ui:errorMessages': {
                  required: 'Enter a valid State, Province, or Region',
                },
              },
            }),
            'ui:validations': [
              (errors, formData) =>
                validAddressCharsOnly(
                  errors,
                  null,
                  formData,
                  'physicalAddress',
                ),
            ],
          },
          schema: {
            type: 'object',
            required: ['physicalAddress'],
            properties: {
              titleSchema,
              physicalAddress: addressSchema(),
            },
          },
        },
      },
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
        page5: {
          path: 'contact-info',
          title: 'Phone and email address',
          uiSchema: {
            ...titleUI(
              'Phone and email address',
              'Include a country code for foreign phone numbers',
            ),
            messageAriaDescribedby:
              'Please include this information so that we can contact you with questions or updates.',
            veteranPhoneNumber: internationalPhoneUI({}),
            veteranEmailAddress: emailUI(),
          },
          schema: {
            type: 'object',
            required: ['veteranPhoneNumber', 'veteranEmailAddress'],
            properties: {
              titleSchema,
              veteranPhoneNumber: internationalPhoneSchema({ required: true }),
              veteranEmailAddress: emailSchema,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
