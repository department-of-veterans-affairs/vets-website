import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import recordEvent from 'platform/monitoring/record-event';
import React from 'react';
import fullSchema from 'vets-json-schema/dist/MDOT-schema.json';
import FooterInfo from '../components/FooterInfo';
import IntroductionPage from '../components/IntroductionPage';
import PersonalInfoBox from '../components/PersonalInfoBox';
import { schemaFields } from '../constants';
import ConfirmationPage from '../containers/ConfirmationPage';
import frontEndSchema from '../schemas/2346-schema.json';
import { buildAddressSchema } from '../schemas/address-schema';
import UIDefinitions from '../schemas/definitions/2346UI';

const { email, supplies, date } = fullSchema.definitions;
const { currentAddress } = frontEndSchema.definitions;

const {
  emailField,
  confirmationEmailField,
  suppliesField,
  permAddressField,
  tempAddressField,
  currentAddressField,
} = schemaFields;

const {
  emailUI,
  confirmationEmailUI,
  batteriesUI,
  accessoriesUI,
  permanentAddressUI,
  temporaryAddressUI,
  currentAddressUI,
} = UIDefinitions.sharedUISchemas;

const formChapterTitles = {
  veteranInformation: 'Veteran information',
  selectSupplies: 'Select your supplies',
};

const formPageTitlesLookup = {
  personalDetails: 'Personal Details',
  address: 'Shipping address',
  addAccessoriesPage: 'Add accessories to your order',
  addBatteriesPage: 'Add batteries to your order',
};

const addressSchema = buildAddressSchema(true);

const asyncReturn = (returnValue, error, delay = 300) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldIReturnTrue = true;
      if (shouldIReturnTrue) {
        return resolve(returnValue);
      } else {
        return reject(error);
      }
    }, delay);
  });

const submit = form => {
  const submissionData = JSON.stringify(form.data);
  const itemQuantities = form.data?.selectedProducts?.length;
  const selectedAddress = form.data?.currentAddress;
  let shippingAddress;
  if (selectedAddress === 'permanentAddress') {
    shippingAddress = form.data?.permanentAddress;
  } else if (selectedAddress === 'temporaryAddress') {
    shippingAddress = form.data?.temporaryAddress;
  }

  recordEvent({
    event: 'bam-2346a-submission',
    'bam-quantityOrdered': itemQuantities,
  });

  const onSuccess = resp =>
    new Promise(resolve => {
      recordEvent({
        event: 'bam-2346a-submission-successful',
        'bam-quantityOrdered': itemQuantities,
      });
      return resolve(resp);
    });

  const onFailure = error =>
    new Promise(reject => {
      recordEvent({
        event: 'bam-2346a-submission-failure',
        'bam-quantityOrdered': itemQuantities,
      });
      return reject(error);
    });

  return asyncReturn(
    {
      attributes: { confirmationNumber: '123123123' },
      submissionData,
      shippingAddress,
    },
    'this is an error message',
  )
    .then(onSuccess)
    .catch(onFailure);
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/posts',
  submit,
  trackingPrefix: 'bam-2346a-',
  verifyRequiredPrefill: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: FooterInfo,
  formId: VA_FORM_IDS.FORM_VA_2346A,
  version: 0,
  prefillEnabled: true,
  title: 'Order hearing aid batteries and accessories',
  finishLaterLinkText: 'Finish this order later.',
  subTitle: 'VA Form 2346',
  savedFormMessages: {
    notFound:
      'You can’t reorder your items at this time because your items aren’t available for reorder or we can’t find your records in our system. For help, please call the Denver Logistics Center (DLC) at 303-273-6200 or email us at dalc.css@va.gov.',
    noAuth: 'Please sign in again to continue your application for benefits.',
    forbidden:
      'We can’t fulfill an order for this Veteran because they are deceased in our records. If this information is incorrect, please call Veterans Benefits Assistance at 800-827-1000, Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.',
  },
  defaultDefinitions: {
    email,
    supplies,
    date,
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
    selectSuppliesChapter: {
      title: formChapterTitles.selectSupplies,
      pages: {
        [formPageTitlesLookup.addBatteriesPage]: {
          path: 'batteries',
          title: formPageTitlesLookup.addBatteriesPage,
          schema: {
            type: 'object',
            properties: {
              [suppliesField]: supplies,
            },
          },
          uiSchema: {
            [suppliesField]: batteriesUI,
          },
        },
        [formPageTitlesLookup.addAccessoriesPage]: {
          path: 'accessories',
          title: formPageTitlesLookup.addAccessoriesPage,
          schema: {
            type: 'object',
            properties: {
              [suppliesField]: supplies,
            },
          },
          uiSchema: {
            [suppliesField]: accessoriesUI,
          },
        },
      },
    },
  },
};
export default formConfig;
