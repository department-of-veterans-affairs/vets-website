import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import fullSchema from '../schema/5655-schema.json';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import { schemaFields } from '../constants';
import uiDefinitions from '../schema/5655-ui-schema';

const { viewVeteranInfoField } = schemaFields;
const { veteranInfoUI } = uiDefinitions;

const formChapterTitles = {
  veteranInformation: 'Veteran information',
  selectSupplies: 'Select your supplies',
};

const formPageTitles = {
  veteranInfo: 'Veteran information',
  address: 'Shipping address',
  addSuppliesPage: 'Add supplies to your order',
};

const { fullName } = fullSchema.definitions;
// const { vaFileNumber } = fullSchema.properties;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/api`,
  trackingPrefix: 'fsr-5655-',
  verifyRequiredPrefill: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_5655,
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to submit a Financial Status Report (5655).',
    noAuth:
      'Please sign in again to continue your Financial Status Report (5655).',
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your Financial Status Report (5655) is in progress.',
      expired:
        'Your saved Financial Status Report (5655) has expired. If you want to submit a Financial Status Report (5655), please start a new Financial Status Report (5655).',
      saved: 'Your Financial Status Report (5655) has been saved.',
    },
  },
  defaultDefinitions: {
    fullName,
  },
  title: 'Financial Status Report (5655)',
  subTitle: 'Form 5655',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  chapters: {
    veteranInformationChapter: {
      title: formChapterTitles.veteranInformation,
      pages: {
        [formPageTitles.veteranInfo]: {
          path: 'veteran-information',
          title: formPageTitles.veteranInfo,
          uiSchema: {
            [viewVeteranInfoField]: veteranInfoUI,
          },
          schema: {
            type: 'object',
            properties: {
              [viewVeteranInfoField]: {
                type: 'object',
                properties: {
                  fullName: {
                    type: 'string',
                  },
                  ssnLastFour: {
                    type: 'number',
                  },
                  vaFileNumber: {
                    type: 'number',
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
