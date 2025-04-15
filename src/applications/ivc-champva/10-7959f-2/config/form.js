import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { cloneDeep } from 'lodash';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import React from 'react';

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
  radioSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import transformForSubmit from './submitTransformer';
import SubmissionError from '../../shared/components/SubmissionError';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import GetFormHelp from '../../shared/components/GetFormHelp';
import {
  internationalPhoneSchema,
  internationalPhoneUI,
} from '../../shared/components/InternationalPhone';
import PaymentSelectionUI, {
  PaymentReviewScreen,
} from '../components/PaymentSelection';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
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
  submitUrl: `${environment.API_URL}/ivc_champva/v1/forms`,
  footerContent: GetFormHelp,
  // submit: () =>
  //   Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'fmp-cover-sheet-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  customText: {
    reviewPageTitle: 'Review and submit',
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
          path: 'identification-information ',
          title: 'Identification information ',
          uiSchema: {
            ...titleUI(
              'Identification information ',
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
              "We'll send any important information about your claim to this address.",
            ),
            messageAriaDescribedby:
              "We'll send any important information about your claim to this address.",
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
            messageAriaDescribedby:
              'Include a country code for foreign phone numbers',
            veteranPhoneNumber: internationalPhoneUI(),
            veteranEmailAddress: emailUI(),
          },
          schema: {
            type: 'object',
            required: ['veteranPhoneNumber', 'veteranEmailAddress'],
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
      title: 'Payment selection',
      pages: {
        page6: {
          path: 'payment-selection',
          title: 'Where to send the payment',
          uiSchema: {
            ...titleUI(
              'Who should we send payments to?',
              <>
                <p>
                  Tell us if we should send any payments for this claim to you
                  or to the provider:
                </p>
                <ul>
                  <li>
                    <b>If you already paid the provider,</b> select{' '}
                    <b>Veteran</b>. If we approve your claim, we’ll pay you by
                    direct deposit if you have it set up for your VA benefit
                    payments. Or we’ll mail you a check.
                  </li>
                  <li>
                    <b>If you haven’t paid the provider,</b> select{' '}
                    <b>Provider</b>. We’ll send a check to the provider by mail.
                  </li>
                </ul>
                <va-additional-info trigger="Learn more about direct deposit payments">
                  <va-link
                    href="https://www.va.gov/change-direct-deposit/"
                    text="Learn how to change your direct deposit information for your VA benefit payments."
                  />
                  <br />
                  <br />
                  <p>
                    Don’t have direct deposit or a U.S. bank account? We’ll send
                    any payments to you by check at the mailing address you gave
                    us on this form.
                  </p>
                </va-additional-info>
              </>,
            ),
            sendPayment: PaymentSelectionUI(),
          },
          schema: {
            type: 'object',
            required: ['sendPayment'],
            properties: {
              titleSchema,
              sendPayment: radioSchema(['Veteran', 'Provider']),
            },
          },
          CustomPageReview: PaymentReviewScreen,
        },
      },
    },
    fileUpload: {
      title: 'Supporting files',
      pages: {
        page7: {
          path: 'upload-supporting-documents',
          title: 'Included files',
          depends: formData => formData.sendPayment === 'Veteran',
          uiSchema: {
            ...titleUI({
              title: 'Upload billing statements and supporting documents',
              headerLevel: 2,
            }),
            'view:UploadDocuments': {
              'ui:description': UploadDocumentsVeteran,
            },
            uploadSectionVeteran: fileUploadUI({
              label: 'Upload file',
              attachmentName: false,
            }),
          },
          schema: {
            type: 'object',
            required: ['uploadSectionVeteran'],
            properties: {
              titleSchema,
              'view:UploadDocuments': {
                type: 'object',
                properties: {},
              },
              uploadSectionVeteran: {
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
        page8: {
          path: 'upload-supporting-documents-provider',
          title: 'Included files',
          depends: formData => formData.sendPayment === 'Provider',
          uiSchema: {
            ...titleUI({
              title: 'Upload billing statements and supporting documents',
              headerLevel: 2,
            }),
            'view:UploadDocuments': {
              'ui:description': UploadDocumentsProvider,
            },
            uploadSectionProvider: fileUploadUI({
              label: 'Upload file',
              attachmentName: false,
            }),
          },
          schema: {
            type: 'object',
            required: ['uploadSectionProvider'],
            properties: {
              titleSchema,
              'view:UploadDocuments': {
                type: 'object',
                properties: {},
              },
              uploadSectionProvider: {
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
