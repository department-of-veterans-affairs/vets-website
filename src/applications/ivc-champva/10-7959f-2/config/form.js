import { cloneDeep } from 'lodash';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import {
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
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

import SubmissionError from '../../shared/components/SubmissionError';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../../shared/components/GetFormHelp';
import {
  internationalPhoneSchema,
  internationalPhoneUI,
} from '../../shared/components/InternationalPhone';
import PaymentSelectionUI from '../components/PaymentSelection';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import { UploadDocuments } from '../components/UploadDocuments';

const veteranFullNameUI = cloneDeep(fullNameUI());
veteranFullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  footerContent: GetFormHelp,
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'fmp-cover-sheet-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
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
    dependencies: [externalServices.pega],
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
      title: 'Name and date of birth',
      pages: {
        page1: {
          path: 'veteran-info',
          title: 'Personal Information',
          uiSchema: {
            ...titleUI('Name and date of birth'),
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
    veteranIdentificationChapter: {
      title: 'Identification information',
      pages: {
        page2: {
          path: 'identification-information',
          uiSchema: {
            ...titleUI(
              'Identification information',
              'You must enter either a Social Security Number or a VA file number.',
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
              veteranSocialSecurityNumber: ssnOrVaFileNumberNoHintSchema,
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
              "We'll send any important information about your claim to this address. This can be your current home address or a more permanent location.",
            ),
            messageAriaDescribedby:
              "We'll send any important information about your claim to this address. This can be your current home address or a more permanent location.",
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
              `Provide the address where you're living right now`,
            ),
            messageAriaDescribedby: `Provide the address where you're living right now.`,
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
              'For foreign numbers, add the country code so we can reach you if there are questions about this form.',
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
    paymentSelection: {
      title: 'Payment Selection',
      pages: {
        page6: {
          path: 'payment-selection',
          title: 'Payment Selection',
          uiSchema: {
            ...titleUI('Where to send the payment'),
            sendPayment: PaymentSelectionUI(),
          },
          schema: {
            type: 'object',
            required: ['sendPayment'],
            properties: {
              titleSchema,
              sendPayment: yesNoSchema,
            },
          },
        },
      },
    },
    fileUpload: {
      title: 'Upload files',
      pages: {
        page7: {
          path: 'upload-supporting-documents',
          title: 'Upload files',
          uiSchema: {
            ...titleUI({
              title: 'Upload billing statements and supporting documents',
              headerLevel: 2,
            }),
            'view:UploadDocuments': {
              'ui:description': UploadDocuments,
            },
            uploadSection: fileUploadUI({
              label: 'Upload file',
              attachmentName: true,
            }),
          },
          schema: {
            type: 'object',
            required: ['uploadSection'],
            properties: {
              titleSchema,
              'view:UploadDocuments': {
                type: 'object',
                properties: {},
              },
              uploadSection: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
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
