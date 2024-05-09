import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { cloneDeep } from 'lodash';

import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberNoHintUI,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  addressUI,
  addressSchema,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  // checkboxGroupUI,
  // checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  getNextPagePath,
  checkValidPagePath,
} from '@department-of-veterans-affairs/platform-forms-system/routing';
import transformForSubmit from './submitTransformer';
import manifest from '../manifest.json';
import prefillTransformer from './prefillTransformer';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../../shared/components/GetFormHelp';

// import mockdata from '../tests/fixtures/data/test-data.json';

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
    appType: 'form',
  },
  // This is here temporarily to allow us to log SIP/Prefill data on staging
  onFormLoaded: props => {
    // TODO: Remove all this when we've verified we're getting the right data.
    const { formData, returnUrl } = props;
    // Check valid return URL; copied from RoutedSavableApp
    const isValidReturnUrl = checkValidPagePath(
      props.routes[props.routes.length - 1].pageList,
      formData,
      returnUrl,
    );
    if (isValidReturnUrl) {
      props.router.push(returnUrl);
    } else {
      const nextPagePath = getNextPagePath(
        props.routes[props.routes.length - 1].pageList,
        formData,
        '/introduction',
      );
      props.router.push(nextPagePath);
    }
    // Show whatever formData we have at this time, which should include data
    // produced by the prefill transformer
    // eslint-disable-next-line no-console
    console.log('Form loaded - data: ', formData);
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'fullName',
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
      title: 'Name and date of birth',
      pages: {
        page1: {
          // initialData: mockdata.data,
          path: 'veteran-information',
          title: 'Personal Information',
          uiSchema: {
            ...titleUI(
              'Name and date of birth',
              'We use this information to verify other details.',
            ),
            messageAriaDescribedby:
              'We use this information to verify other details.',
            veteranFullName: veteranFullNameUI,
            veteranDateOfBirth: dateOfBirthUI({ required: true }),
          },
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
      title: 'Identification Information',
      pages: {
        page2: {
          path: 'identification-information',
          title: 'Veteran SSN and VA file number',
          uiSchema: {
            ...titleUI(
              `Identification information`,
              `You must enter either a Social Security number or VA file number.`,
            ),
            messageAriaDescribedby:
              'You must enter either a Social Security number or VA file number.',
            veteranSocialSecurityNumber: ssnOrVaFileNumberNoHintUI(),
          },
          schema: {
            type: 'object',
            required: ['veteranSocialSecurityNumber'],
            properties: {
              titleSchema,
              veteranSocialSecurityNumber: ssnOrVaFileNumberSchema,
            },
          },
        },
      },
    },
    mailingAddress: {
      title: 'Mailing Address',
      pages: {
        page: {
          path: 'mailing-address',
          title: "Veteran's Mailing address",
          uiSchema: {
            ...titleUI(
              'Mailing address',
              "We'll send any important information about your application to this address.",
            ),
            messageAriaDescribedby:
              "We'll send any important information about your application to this address.",
            veteranAddress: addressUI({
              labels: {
                street2: 'Apartment or unit number',
              },
              omit: ['street3'],
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
              veteranAddress: addressSchema({
                omit: ['street3'],
              }),
            },
          },
        },
      },
    },
    physicalAddress: {
      title: 'Home Address',
      pages: {
        page4: {
          path: 'home-address',
          title: "Veteran's Home address",
          uiSchema: {
            ...titleUI(
              'Home Address',
              'This is your current location, outside the United States.',
            ),
            messageAriaDescribedby:
              'This is your current location, outside the United States.',
            // matchAddress: checkboxGroupUI({
            //   title: ' ',
            //   required: () => false,
            //   labels: {
            //     yes: 'Same as Mailing Address',
            //   },
            // }),
            physicalAddress: addressUI({
              labels: {
                street2: 'Apartment or unit number',
              },
              omit: ['street3'],
              required: {
                state: () => true,
              },
            }),
          },
          schema: {
            type: 'object',
            required: ['physicalAddress'],
            properties: {
              titleSchema,
              // matchAddress: checkboxGroupSchema(['yes']),
              physicalAddress: addressSchema({
                omit: ['street3'],
              }),
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
          title: "Veteran's contact information",
          uiSchema: {
            ...titleUI(
              'Phone and email address',
              'Please include this information so that we can contact you with questions or updates',
            ),
            messageAriaDescribedby:
              'Please include this information so that we can contact you with questions or updates.',
            veteranPhoneNumber: phoneUI(),
            veteranEmailAddress: emailUI(),
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              veteranPhoneNumber: phoneSchema,
              veteranEmailAddress: emailSchema,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
