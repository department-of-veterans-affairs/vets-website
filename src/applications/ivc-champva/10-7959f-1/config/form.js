import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { cloneDeep } from 'lodash';

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
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import transformForSubmit from './submitTransformer';
import manifest from '../manifest.json';
import prefillTransformer from './prefillTransformer';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../../shared/components/GetFormHelp';
import prefilledAddress from '../helpers/prefilledAddress';

// import mockdata from '../tests/e2e/fixtures/data/test-data.json';
import {
  ssnOrVaFileNumberCustomUI,
  CustomSSNReviewPage,
} from '../helpers/CustomSSN';
import {
  internationalPhoneSchema,
  internationalPhoneUI,
} from '../../shared/components/InternationalPhone';
import PrefillCopy from '../helpers/PrefillCopy';

const veteranFullNameUI = cloneDeep(fullNameUI());
veteranFullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit,
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  footerContent: GetFormHelp,
  // submit: () =>
  //   Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-7959f-1-FMP-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  customText: {
    reviewPageTitle: 'Review and sign',
    submitButtonText: 'Submit',
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
  formId: '10-7959F-1',
  saveInProgress: {
    messages: {
      inProgress: 'Your FMP registration (10-7959F-1) is in progress.',
      expired:
        'Your saved FMP benefits registration (10-7959F-1) has expired. If you want to register for Foriegn Medical Program benefits, please start a new application.',
      saved: 'Your FMP benefits registration has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to register for FMP benefits.',
    noAuth:
      'Please sign in again to continue your registration for FMP benefits.',
  },
  title: 'Register for the Foreign Medical Program (FMP)',
  subTitle: 'FMP Registration Form (VA Form 10-7959f-1)',
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
            ...titleUI(
              'Name and date of birth',
              'We use this information to verify other details.',
            ),
            messageAriaDescribedby:
              'We use this information to verify other details.',
            'view:prefilledAddress': {
              'ui:description': prefilledAddress,
            },
            veteranFullName: veteranFullNameUI,
            veteranDateOfBirth: dateOfBirthUI({ required: true }),
            'view:PrefillCopy': {
              'ui:description': PrefillCopy,
            },
          },
          schema: {
            type: 'object',
            required: ['veteranFullName', 'veteranDateOfBirth'],
            properties: {
              titleSchema,
              'view:prefilledAddress': {
                type: 'object',
                properties: {},
              },
              veteranFullName: fullNameSchema,
              veteranDateOfBirth: dateOfBirthSchema,
              'view:PrefillCopy': {
                type: 'object',
                properties: {},
              },
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
            veteranAddress: addressUI({
              required: {
                state: () => true,
              },
            }),
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
          title: 'Home address ',
          uiSchema: {
            ...titleUI('Home address'),
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
            ...titleUI(
              `Home address`,
              `This is your current location, outside the United States.`,
            ),
            messageAriaDescribedby:
              'This is your current location, outside the United States.',
            physicalAddress: {
              ...addressUI({
                required: {
                  state: () => true,
                },
              }),
            },
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
              'For foreign numbers, add the country code so we can reach you if there are questions about this form.',
            ),
            messageAriaDescribedby:
              'Please include this information so that we can contact you with questions or updates.',
            veteranPhoneNumber: internationalPhoneUI(),
            veteranEmailAddress: emailUI(),
          },
          schema: {
            type: 'object',
            required: ['veteranPhoneNumber'],
            properties: {
              titleSchema,
              veteranPhoneNumber: internationalPhoneSchema,
              veteranEmailAddress: emailSchema,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
