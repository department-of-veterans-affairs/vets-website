import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import schemaFields from '../schema';
import uiSchema from '../schema/5655-ui-schema';
import schema from '../schema/5655-schema';

const { viewVeteranInfoField, viewTypeOfEmploymentField } = schemaFields;
const { veteranInfoUI, householdIncomeUI } = uiSchema;
const { veteranInfo, householdIncome } = schema;
const { fullName } = veteranInfo.definitions;

const formChapterTitles = {
  veteranInformationTitle: 'Veteran information',
  householdIncomeTitle: 'Household income',
};

const formPageTitles = {
  veteranInfoTitle: 'Veteran information',
  employmentHistoryTitle: 'Your employment history',
};

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
    notFound:
      'Please start over to submit an application for financial hardship assistance.',
    noAuth:
      'Please sign in again to continue your application for financial hardship assistance.',
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your application for financial hardship assistance is in progress.',
      expired:
        'Your saved application for financial hardship assistance has expired. If you want to submit a application for financial hardship assistance, please start a new application for financial hardship assistance.',
      saved:
        'Your application for financial hardship assistance has been saved.',
    },
  },
  defaultDefinitions: {
    fullName,
  },
  title: 'Apply for financial hardship assistance',
  subTitle: 'Form 5655',
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  chapters: {
    veteranInformationChapter: {
      title: formChapterTitles.veteranInformationTitle,
      pages: {
        [formPageTitles.veteranInfoTitle]: {
          path: 'veteran-information',
          title: formPageTitles.veteranInfoTitle,
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
                  dob: {
                    type: 'string',
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
    householdInformationChapter: {
      title: formChapterTitles.householdIncomeTitle,
      pages: {
        [formPageTitles.employmentHistoryTitle]: {
          path: 'household-income',
          title: formPageTitles.employmentHistoryTitle,
          uiSchema: {
            [viewTypeOfEmploymentField]: householdIncomeUI,
          },
          schema: {
            type: 'object',
            properties: {
              [viewTypeOfEmploymentField]: householdIncome,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
