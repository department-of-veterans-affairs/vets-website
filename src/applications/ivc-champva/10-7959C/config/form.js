import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  addressUI,
  addressSchema,
  radioUI,
  radioSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
  yesNoUI,
  yesNoSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import get from 'platform/utilities/data/get';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import CoverageField from '../components/coverages/CoverageField';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  fileTypes,
  attachmentsSchema,
} from '../../shared/components/attachments';

const uploadUrl = `${
  environment.API_URL
}/simple_forms_api/v1/simple_forms/submit_supporting_documents`;

/** @type {PageSchema} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '10-7959C-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  formId: '10-7959C',
  saveInProgress: {
    messages: {
      inProgress:
        'Your CHAMPVA other health insurance certification application (10-7959C) is in progress.',
      expired:
        'Your saved CHAMPVA other health insurance certification application (10-7959C) has expired. If you want to apply for CHAMPVA other health insurance certification, please start a new application.',
      saved:
        'Your CHAMPVA other health insurance certification application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for CHAMPVA other health insurance certification.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA other health insurance certification.',
  },
  title: '10-7959C CHAMPVA Other Health Insurance Certification form',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Beneficiary Information',
      pages: {
        page1: {
          path: 'beneficiary-name',
          title: 'Beneficiary Name',
          uiSchema: {
            ...titleUI('Beneficiary name'),
            beneficiaryFullName: fullNameNoSuffixUI(),
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              beneficiaryFullName: fullNameNoSuffixSchema,
            },
          },
        },
        page2: {
          path: 'beneficiary-ssn',
          title: 'Beneficiary SSN',
          uiSchema: {
            ...titleUI('Beneficiary SSN'),
            beneficiarySSN: ssnUI(),
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              beneficiarySSN: ssnSchema,
            },
          },
        },
        page3: {
          path: 'beneficiary-address',
          title: 'Beneficiary Address',
          uiSchema: {
            ...titleUI('Beneficiary Address'),
            beneficiaryAddress: addressUI(),
            beneficiaryNewAddress: checkboxGroupUI({
              title: 'Address Information',
              required: false,
              labels: {
                addressIsNew: 'Check if this is a new address',
              },
            }),
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              beneficiaryAddress: addressSchema({
                omit: [
                  'isMilitary',
                  'view:militaryBaseDescription',
                  'country',
                  'street2',
                  'street3',
                ],
              }),
              beneficiaryNewAddress: checkboxGroupSchema(['addressIsNew']),
            },
          },
        },
        page4: {
          path: 'beneficiary-gender',
          title: 'Beneficiary Gender',
          uiSchema: {
            ...titleUI('Beneficiary Gender'),
            beneficiaryGender: radioUI({
              title: 'Gender',
              required: true,
              labels: {
                male: 'Male',
                female: 'Female',
              },
            }),
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              beneficiaryGender: radioSchema(['male', 'female']),
            },
          },
        },
      },
    },
    chapter2: {
      title: 'Medicare Beneficiaries',
      pages: {
        page5: {
          path: 'medicare-part-a',
          title: 'Medicare Part A Information',
          uiSchema: {
            ...titleUI('Medicare Part A Information'),
            hasMedicarePartA: yesNoUI({
              title: 'Do you have Medicare Part A?',
            }),
            partAEffectiveDate: {
              ...currentOrPastDateUI(),
              'ui:options': {
                hideIf: formData => !get('hasMedicarePartA', formData),
              },
              'ui:required': formData => formData.hasMedicarePartA,
            },
            partACarrierName: {
              'ui:title': 'Part A Carrier Name',
              'ui:webComponentField': VaTextInputField,
              'ui:options': {
                hideIf: formData => !get('hasMedicarePartA', formData),
              },
              'ui:required': formData => formData.hasMedicarePartA,
            },
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              hasMedicarePartA: yesNoSchema,
              partAEffectiveDate: currentOrPastDateSchema,
              partACarrierName: {
                type: 'string',
              },
            },
          },
        },
        page6: {
          path: 'medicare-part-b',
          title: 'Medicare Part B Information',
          uiSchema: {
            ...titleUI('Medicare Part B Information'),
            hasMedicarePartB: yesNoUI({
              title: 'Do you have Medicare Part B?',
            }),
            partBEffectiveDate: {
              ...currentOrPastDateUI(),
              'ui:options': {
                hideIf: formData => !get('hasMedicarePartB', formData),
              },
              'ui:required': formData => formData.hasMedicarePartB,
            },
            partBCarrierName: {
              'ui:title': 'Part B Carrier Name',
              'ui:webComponentField': VaTextInputField,
              'ui:options': {
                hideIf: formData => !get('hasMedicarePartB', formData),
              },
              'ui:required': formData => formData.hasMedicarePartB,
            },
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              hasMedicarePartB: yesNoSchema,
              partBEffectiveDate: currentOrPastDateSchema,
              partBCarrierName: {
                type: 'string',
              },
            },
          },
        },
        page7: {
          path: 'medicare-part-d',
          title: 'Medicare Part D Information',
          uiSchema: {
            ...titleUI('Medicare Part D Information'),
            hasMedicarePartD: yesNoUI({
              title: 'Do you have Medicare Part D?',
            }),
            partDEffectiveDate: {
              ...currentOrPastDateUI(),
              'ui:options': {
                hideIf: formData => !get('hasMedicarePartD', formData),
              },
              'ui:required': formData => formData.hasMedicarePartD,
            },
            partDCarrierName: {
              'ui:title': 'Part D Carrier Name',
              'ui:webComponentField': VaTextInputField,
              'ui:options': {
                hideIf: formData => !get('hasMedicarePartD', formData),
              },
              'ui:required': formData => formData.hasMedicarePartD,
            },
            hasOtherHealthInsurance: yesNoUI({
              required: true,
              title: 'Do you have health insurance other than MEDICARE?',
            }),
          },
          schema: {
            type: 'object',
            properties: {
              titleSchema,
              hasMedicarePartD: yesNoSchema,
              partDEffectiveDate: currentOrPastDateSchema,
              partDCarrierName: {
                type: 'string',
              },
              hasOtherHealthInsurance: yesNoSchema,
            },
          },
        },
        // Conditional - only go here if they have pt A or B
        page8: {
          path: 'medicare-coverage-details',
          title: 'Medicare Coverage Details',
          depends: form =>
            get('hasMedicarePartA', form) || get('hasMedicarePartB', form),
          uiSchema: {
            medicareProvidesPharmacy: yesNoUI({
              required: true,
              title: 'Does your Medicare coverage provide pharmacy benefits?',
            }),
            hasMedicareAdvantagePlan: yesNoUI({
              required: true,
              title:
                'Did you choose a Medicare Advantage Plan for your Medicare Coverage?',
            }),
          },
          schema: {
            type: 'object',
            properties: {
              medicareProvidesPharmacy: yesNoSchema,
              hasMedicareAdvantagePlan: yesNoSchema,
            },
          },
        },
      },
    },
    chapter3: {
      title: 'Other Health Insurance',
      pages: {
        // TODO: is pt D required to get to this state?
        page9: {
          path: 'other-health-insurance',
          // Shows up on review page
          title: 'Other Health Insurance (OHI)',
          arrayPath: 'coverages',
          depends: form => get('hasOtherHealthInsurance', form),
          uiSchema: {
            ...titleUI(
              'Other Coverages',
              'Provide all periods of OHI coverage since becoming CHAMPVA eligible and attach a copy of any active health insurance cards (front and back).',
            ),
            coverages: {
              'ui:options': {
                viewField: CoverageField,
                keepInPageOnReview: true,
                useDlWrap: false,
              },
              'ui:errorMessages': {
                minItems: 'Must have at least one coverage listed.',
              },
              items: {
                nameOfInsurance: {
                  'ui:title': 'Name of Insurance',
                  'ui:webComponentField': VaTextInputField,
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              coverages: {
                type: 'array',
                minItems: 1,
                maxItems: 3,
                items: {
                  type: 'object',
                  required: ['nameOfInsurance'],
                  properties: {
                    titleSchema,
                    nameOfInsurance: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        page10: {
          path: 'other-health-insurance/:index/effective-date',
          arrayPath: 'coverages',
          showPagePerItem: true,
          title: 'OHI Effective Date',
          depends: form => get('hasOtherHealthInsurance', form),
          uiSchema: {
            'ui:description': 'Provide date OHI coverage became effective.',
            coverages: {
              'ui:options': {
                itemName: 'Coverage',
                useDlWrap: false,
                viewField: CoverageField,
              },
              items: {
                ...titleUI(
                  ({ formData }) =>
                    `${formData.nameOfInsurance} coverage effective date`,
                ),
                ohiEffectiveDate: {
                  ...currentOrPastDateUI(),
                  'ui:required': () => true,
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              coverages: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    titleSchema,
                    ohiEffectiveDate: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        page11: {
          path: 'other-health-insurance/:index/upload-proof',
          depends: form => get('hasOtherHealthInsurance', form),
          arrayPath: 'coverages',
          showPagePerItem: true,
          title: 'Active OHI Card',
          uiSchema: {
            'ui:description': 'Upload a copy of your health insurance card.',
            coverages: {
              'ui:options': {
                itemName: 'Coverage',
                useDlWrap: false,
                viewField: CoverageField,
              },
              items: {
                ...titleUI(
                  ({ formData }) =>
                    `${formData.nameOfInsurance} insurance card`,
                ),
                attachmentFront: fileUploadUI('Upload insurance card (Front)', {
                  fileTypes,
                  fileUploadUrl: uploadUrl,
                }),
                attachmentBack: fileUploadUI('Upload insurance card (Back)', {
                  fileTypes,
                  fileUploadUrl: uploadUrl,
                }),
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              coverages: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  properties: {
                    titleSchema,
                    attachmentFront: attachmentsSchema,
                    attachmentBack: attachmentsSchema,
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
