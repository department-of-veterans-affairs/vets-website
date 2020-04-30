import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { VA_FORM_IDS } from 'platform/forms/constants';
import React from 'react';
import FooterInfo from '../components/FooterInfo';
import IntroductionPage from '../components/IntroductionPage';
import PersonalInfoBox from '../components/PersonalInfoBox';
import { schemaFields } from '../constants';
import ConfirmationPage from '../containers/ConfirmationPage';
import fullSchemaMDOT from '../schemas/2346-schema.json';
import { buildAddressSchema } from '../schemas/address-schema';
import UIDefinitions from '../schemas/definitions/2346UI';

const { email, supplies, currentAddress } = fullSchemaMDOT.definitions;

const {
  emailField,
  confirmationEmailField,
  suppliesField,
  viewAddAccessoriesField,
  permAddressField,
  tempAddressField,
  currentAddressField,
  eligibleBatteriesPromptField,
  ineligibleBatteriesPromptField,
} = schemaFields;

const {
  emailUI,
  confirmationEmailUI,
  addAccessoriesUI,
  accessoriesUI,
  eligibleBatteriesPromptUI,
  eligibleBatteriesDisplayUI,
  ineligibleBatteriesPromptUI,
  ineligibleBatteriesDisplayUI,
  permanentAddressUI,
  temporaryAddressUI,
  currentAddressUI,
} = UIDefinitions.sharedUISchemas;

const formChapterTitles = {
  veteranInformation: 'Veteran Information',
  orderSupplies: 'Order your supplies',
};

const formPageTitlesLookup = {
  personalDetails: 'Personal Details',
  address: 'Shipping Address',
  eligibleBatteries: 'Add batteries to your order',
  ineligibleBatteries: ' ',
  addAccessoriesPage: 'Add accessories to your order',
};

const addressSchema = buildAddressSchema(true);

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/posts',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'va-2346a-',
  verifyRequiredPrefill: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FooterInfo,
  formId: VA_FORM_IDS.FORM_VA_2346A,
  version: 0,
  prefillEnabled: true,
  title: 'Order hearing aid batteries and accessories',
  subTitle: 'VA Form 2346A',
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  defaultDefinitions: {
    email,
    supplies,
    addressSchema,
    currentAddress,
  },
  chapters: {
    veteranInformationChapter: {
      title: formChapterTitles.veteranInformation,
      pages: {
        [formPageTitlesLookup.personalDetails]: {
          path: 'veteran-information',
          title: formPageTitlesLookup.personalDetails,
          uiSchema: {
            'ui:description': ({ formData }) => (
              <PersonalInfoBox formData={formData} />
            ),
            [schemaFields.fullName]: fullNameUI,
          },
          schema: {
            required: [],
            type: 'object',
            properties: {},
          },
        },
        [formPageTitlesLookup.address]: {
          path: 'veteran-information/addresses',
          title: formPageTitlesLookup.address,
          uiSchema: {
            [permAddressField]: permanentAddressUI,
            [tempAddressField]: temporaryAddressUI,
            [emailField]: emailUI,
            [confirmationEmailField]: confirmationEmailUI,
            [currentAddressField]: currentAddressUI,
          },
          schema: {
            type: 'object',
            properties: {
              [permAddressField]: addressSchema,
              [tempAddressField]: addressSchema,
              [emailField]: email,
              [confirmationEmailField]: email,
              [currentAddressField]: currentAddress,
            },
          },
        },
      },
    },
    orderSuppliesChapter: {
      title: formChapterTitles.orderSupplies,
      pages: {
        [formPageTitlesLookup.eligibleBatteries]: {
          path: 'eligible-batteries',
          title: formPageTitlesLookup.eligibleBatteries,
          // depends: formData => formData.eligibility?.batteries,
          schema: {
            type: 'object',
            properties: {
              [eligibleBatteriesPromptField]: {
                type: 'string',
                enum: ['yes', 'no'],
              },
              [suppliesField]: supplies,
            },
          },
          uiSchema: {
            [eligibleBatteriesPromptField]: eligibleBatteriesPromptUI,
            [suppliesField]: eligibleBatteriesDisplayUI,
          },
        },
        [formPageTitlesLookup.ineligibleBatteries]: {
          path: 'ineligible-batteries',
          title: formPageTitlesLookup.ineligibleBatteries,
          // depends: formData => !formData.eligibility?.batteries,
          schema: {
            type: 'object',
            properties: {
              [ineligibleBatteriesPromptField]: {
                type: 'string',
                title: ' ',
              },
              [suppliesField]: supplies,
            },
          },
          uiSchema: {
            [ineligibleBatteriesPromptField]: ineligibleBatteriesPromptUI,
            [suppliesField]: ineligibleBatteriesDisplayUI,
          },
        },
        [formPageTitlesLookup.addAccessoriesPage]: {
          path: 'accessories',
          title: formPageTitlesLookup.addAccessoriesPage,
          schema: {
            type: 'object',
            properties: {
              [viewAddAccessoriesField]: {
                type: 'string',
                enum: ['yes', 'no'],
              },
              [suppliesField]: supplies,
            },
          },
          uiSchema: {
            [viewAddAccessoriesField]: addAccessoriesUI,
            [suppliesField]: accessoriesUI,
          },
        },
      },
    },
  },
};
export default formConfig;
