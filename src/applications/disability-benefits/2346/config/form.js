import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { VA_FORM_IDS } from 'platform/forms/constants';
import FooterInfo from '../components/FooterInfo';
import IntroductionPage from '../components/IntroductionPage';
import PersonalInfoBox from '../components/PersonalInfoBox';
import { schemaFields } from '../constants';
import ConfirmationPage from '../containers/ConfirmationPage';
import fullSchemaMDOT from '../schemas/2346-schema.json';
import { buildAddressSchema } from '../schemas/address-schema';
import UIDefinitions from '../schemas/definitions/2346UI';

const { email, supplies } = fullSchemaMDOT.definitions;

const { selectedAddress } = fullSchemaMDOT.properties;

const {
  emailField,
  confirmationEmailField,
  suppliesField,
  viewAddAccessoriesField,
  viewAddBatteriesField,
  permAddressField,
  tempAddressField,
  selectedAddressField,
} = schemaFields;

const {
  emailUI,
  confirmationEmailUI,
  addAccessoriesUI,
  addBatteriesUI,
  batteriesUI,
  selectedAddressUI,
  accessoriesUI,
  permanentAddressUI,
  temporaryAddressUI,
} = UIDefinitions.sharedUISchemas;

const formChapterTitles = {
  veteranInformation: 'Veteran Information',
  orderSupplies: 'Order your supplies',
};

const formPageTitlesLookup = {
  personalDetails: 'Personal Details',
  address: 'Shipping Address',
  addBatteriesPage: 'Add batteries to your order',
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
  title: 'Order Hearing Aid Batteries and Accessories',
  subTitle: 'VA Form 2346A',
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  defaultDefinitions: {
    email,
    supplies,
    selectedAddress,
    addressSchema,
  },
  chapters: {
    veteranInformationChapter: {
      title: formChapterTitles.veteranInformation,
      pages: {
        [formPageTitlesLookup.personalDetails]: {
          path: 'veteran-information',
          title: formPageTitlesLookup.personalDetails,
          uiSchema: {
            'ui:description': PersonalInfoBox,
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
            [selectedAddressField]: selectedAddressUI,
            [emailField]: emailUI,
            [confirmationEmailField]: confirmationEmailUI,
          },
          schema: {
            type: 'object',
            properties: {
              [permAddressField]: addressSchema,
              [tempAddressField]: addressSchema,
              [selectedAddressField]: selectedAddress,
              [emailField]: email,
              [confirmationEmailField]: email,
            },
          },
        },
      },
    },
    orderSuppliesChapter: {
      title: formChapterTitles.orderSupplies,
      pages: {
        [formPageTitlesLookup.addBatteriesPage]: {
          path: 'batteries',
          title: formPageTitlesLookup.addBatteriesPage,
          schema: {
            type: 'object',
            properties: {
              [viewAddBatteriesField]: {
                type: 'string',
                enum: ['yes', 'no'],
              },
              supplies,
            },
          },
          uiSchema: {
            [viewAddBatteriesField]: addBatteriesUI,
            [suppliesField]: batteriesUI,
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
              supplies,
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
