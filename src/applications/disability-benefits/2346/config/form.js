import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import fullSchema from 'vets-json-schema/dist/MDOT-schema.json';
import FooterInfo from '../components/FooterInfo';
import IntroductionPage from '../components/IntroductionPage';
import { schemaFields } from '../constants';
import ConfirmationPage from '../containers/ConfirmationPage';
import UIDefinitions from '../schemas/2346UI';

const {
  email,
  date,
  supplies,
  addressWithIsMilitaryBase,
} = fullSchema.definitions;

const {
  vetEmailField,
  viewConfirmationEmailField,
  suppliesField,
  permanentAddressField,
  temporaryAddressField,
  viewCurrentAddressField,
  viewVeteranInfoField,
} = schemaFields;

const {
  emailUI,
  confirmationEmailUI,
  suppliesUI,
  permanentAddressUI,
  temporaryAddressUI,
  currentAddressUI,
  veteranInfoUI,
} = UIDefinitions.sharedUISchemas;

const formChapterTitles = {
  veteranInformation: 'Veteran information',
  selectSupplies: 'Select your supplies',
};

const formPageTitlesLookup = {
  veteranInfo: 'Veteran information',
  address: 'Shipping address',
  addSuppliesPage: 'Add supplies to your order',
};

const asyncReturn = (returnValue, error, delay = 0) =>
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

// We need to add this property so we can display the component within our address schema, underneath the checkbox for military bases.
addressWithIsMilitaryBase.properties['view:livesOnMilitaryBaseInfo'] = {
  type: 'string',
};

// the following two properties have to be added to our MDOT-schema.json.  Remove these props once they are added.
addressWithIsMilitaryBase.properties.country = {
  type: 'string',
};

addressWithIsMilitaryBase.properties.state = {
  type: 'string',
};

const submit = form => {
  const currentAddress = form.data['view:currentAddress'];
  const itemQuantities = form.data?.selectedProducts?.length;
  const { order, permanentAddress, temporaryAddress, vetEmail } = form.data;
  const useVeteranAddress = currentAddress === 'permanentAddress';
  const useTemporaryAddress = currentAddress === 'temporaryAddress';
  const payload = {
    permanentAddress,
    temporaryAddress,
    vetEmail,
    order,
    useVeteranAddress,
    useTemporaryAddress,
  };

  const options = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
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

  return apiRequest('/mdot/supplies', options)
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
  subTitle: 'VA Form 2346A',
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
    addressWithIsMilitaryBase,
  },
  chapters: {
    veteranInformationChapter: {
      title: formChapterTitles.veteranInformation,
      pages: {
        [formPageTitlesLookup.veteranInfo]: {
          path: 'veteran-information',
          title: formPageTitlesLookup.veteranInfo,
          uiSchema: {
            [viewVeteranInfoField]: veteranInfoUI,
          },
          schema: {
            type: 'object',
            properties: {
              [viewVeteranInfoField]: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        [formPageTitlesLookup.address]: {
          path: 'address',
          title: formPageTitlesLookup.address,
          uiSchema: {
            [permanentAddressField]: permanentAddressUI,
            [temporaryAddressField]: temporaryAddressUI,
            [vetEmailField]: emailUI,
            [viewConfirmationEmailField]: confirmationEmailUI,
            [viewCurrentAddressField]: currentAddressUI,
          },
          schema: {
            type: 'object',
            properties: {
              [permanentAddressField]: addressWithIsMilitaryBase,
              [temporaryAddressField]: addressWithIsMilitaryBase,
              [vetEmailField]: email,
              [viewConfirmationEmailField]: email,
              [viewCurrentAddressField]: {
                type: 'string',
                enum: ['permanentAddress', 'temporaryAddress'],
                default: 'permanentAddress',
              },
            },
          },
        },
      },
    },
    selectSuppliesChapter: {
      title: formChapterTitles.selectSupplies,
      pages: {
        [formPageTitlesLookup.addSuppliesPage]: {
          path: 'supplies',
          title: formPageTitlesLookup.addSuppliesPage,
          schema: {
            type: 'object',
            properties: {
              [suppliesField]: supplies,
            },
          },
          uiSchema: {
            [suppliesField]: suppliesUI,
          },
        },
      },
    },
  },
};
export default formConfig;
