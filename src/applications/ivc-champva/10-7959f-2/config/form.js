import { cloneDeep, merge } from 'lodash';
import environment from 'platform/utilities/environment';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import {
  ssnUI,
  ssnSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
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

import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from '../../shared/components/fileInputPattern';

import transformForSubmit from './submitTransformer';
import prefillTransformer from './prefillTransformer';
import SubmissionError from '../../shared/components/SubmissionError';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import FormFooter from '../components/FormFooter';
import {
  validAddressCharsOnly,
  validObjectCharsOnly,
} from '../../shared/validations';
import paymentSelection from '../chapters/payments/paymentSelection';
import {
  UploadDocumentsVeteran,
  UploadDocumentsProvider,
} from '../components/UploadDocuments';

// import mockdata from '../tests/e2e/fixtures/data/test-data.json';

const veteranFullNameUI = cloneDeep(fullNameUI());
veteranFullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  transformForSubmit,
  prefillTransformer,
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  footerContent: FormFooter,
  trackingPrefix: 'fmp-cover-sheet-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  formOptions: {
    filterInactiveNestedPageData: true,
  },
  customText: {
    reviewPageTitle: 'Review and submit',
    submitButtonText: 'Submit',
    appType: 'claim',
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
  formId: '10-7959F-2',
  saveInProgress: {
    messages: {
      inProgress:
        'Your health care benefits application (10-7959F-2) is in progress.',
      expired:
        'Your saved health care benefits application (10-7959F-2) has expired. If you want to apply for health care benefits, please start a new application.',
      saved: 'Your health care benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  downtime: {
    dependencies: [externalServices.pega, externalServices.form107959f2],
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for health care benefits.',
    noAuth:
      'Please sign in again to continue your application for health care benefits.',
  },
  title: 'File a Foreign Medical Program (FMP) claim',
  subTitle: 'FMP Claim Cover Sheet (VA Form 10-7959f-2)',
  defaultDefinitions: {},
  chapters: {
    veteranInfoChapter: {
      title: 'Personal information',
      pages: {
        page1: {
          // initialData: mockdata.data,
          path: 'veteran-information',
          title: 'Name and date of birth',
          uiSchema: {
            ...titleUI('Name and date of birth'),
            veteranFullName: veteranFullNameUI,
            veteranDateOfBirth: dateOfBirthUI({ required: () => true }),
            'ui:validations': [
              (errors, formData) =>
                validObjectCharsOnly(errors, null, formData, 'veteranFullName'),
            ],
          },
          schema: {
            type: 'object',
            required: ['veteranFullName', 'veteranDateOfBirth'],
            properties: {
              veteranFullName: fullNameSchema,
              veteranDateOfBirth: dateOfBirthSchema,
            },
          },
        },
      },
    },
    veteranIdentificationChapter: {
      title: 'Identification information',
      pages: {
        page2: {
          path: 'identification-information',
          title: 'Identification information',
          uiSchema: {
            ...titleUI('Identification information'),
            veteranSocialSecurityNumber: ssnUI(),
          },
          schema: {
            type: 'object',
            required: ['veteranSocialSecurityNumber'],
            properties: {
              veteranSocialSecurityNumber: ssnSchema,
            },
          },
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
              "We'll send any important information about your claim to this address.",
            ),
            messageAriaDescribedby:
              "We'll send any important information about your claim to this address.",
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
          title: 'Home address status',
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
              physicalAddress: addressSchema(),
            },
          },
        },
      },
    },
    contactInformation: {
      title: 'Contact information',
      pages: {
        page5: {
          path: 'contact-information',
          title: 'Phone and email address',
          uiSchema: {
            ...titleUI(
              'Phone and email address',
              'Include a country code for foreign phone numbers',
            ),
            veteranPhoneNumber: internationalPhoneUI('Phone number'),
            veteranEmailAddress: emailUI(),
          },
          schema: {
            type: 'object',
            required: ['veteranPhoneNumber', 'veteranEmailAddress'],
            properties: {
              veteranPhoneNumber: internationalPhoneSchema({ required: true }),
              veteranEmailAddress: emailSchema,
            },
          },
        },
      },
    },
    paymentSelection: {
      title: 'Payment selection',
      pages: {
        page6: {
          path: 'payment-selection',
          title: 'Who should we send payments to?',
          ...paymentSelection,
        },
      },
    },
    fileUpload: {
      title: 'Supporting files',
      pages: {
        page7: {
          path: 'upload-supporting-documents',
          title: 'Veteran payment docs',
          depends: formData => formData.sendPayment === 'Veteran',
          uiSchema: {
            ...titleUI('Upload billing statements and supporting documents'),
            'view:UploadDocuments': {
              'ui:description': UploadDocumentsVeteran,
            },
            uploadSectionVeteran: {
              ...fileInputMultipleUI({
                errorMessages: { required: 'This document is required.' },
                name: 'veteran-payment',
                fileUploadUrl: `${
                  environment.API_URL
                }/ivc_champva/v1/forms/submit_supporting_documents`,
                title: 'Upload supporting document',
                formNumber: '10-7959F-2',
              }),
            },
          },
          schema: {
            type: 'object',
            required: ['uploadSectionVeteran'],
            properties: {
              'view:UploadDocuments': {
                type: 'object',
                properties: {},
              },
              uploadSectionVeteran: fileInputMultipleSchema,
            },
          },
        },
        page8: {
          path: 'upload-supporting-documents-provider',
          title: 'Provider payment docs',
          depends: formData => formData.sendPayment === 'Provider',
          uiSchema: {
            ...titleUI('Upload billing statements and supporting documents'),
            'view:UploadDocuments': {
              'ui:description': UploadDocumentsProvider,
            },
            uploadSectionProvider: {
              ...fileInputMultipleUI({
                errorMessages: { required: 'This document is required.' },
                name: 'provider-payment',
                fileUploadUrl: `${
                  environment.API_URL
                }/ivc_champva/v1/forms/submit_supporting_documents`,
                title: 'Upload supporting document',
                formNumber: '10-7959F-2',
              }),
            },
          },
          schema: {
            type: 'object',
            required: ['uploadSectionProvider'],
            properties: {
              'view:UploadDocuments': {
                type: 'object',
                properties: {},
              },
              uploadSectionProvider: fileInputMultipleSchema,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
