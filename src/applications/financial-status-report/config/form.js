import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';

import { availableDebts, employmentHistory, veteranInfo } from '../pages';

const formChapterTitles = {
  veteranInformationTitle: 'Veteran information',
  householdIncomeTitle: 'Household income',
};

const formPageTitles = {
  veteranInfoTitle: 'Veteran information',
  employmentHistoryTitle: 'Your employment history',
  veteranInfo: 'Veteran information',
  address: 'Shipping address',
  addSuppliesPage: 'Add supplies to your order',
  availableDebts: 'Available Debts',
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
  defaultDefinitions: {},
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
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
        },
        availableDebts: {
          initialData: { fsrDebts: [] },
          path: 'available-debts',
          title: formPageTitles.availableDebts,
          uiSchema: availableDebts.uiSchema,
          schema: availableDebts.schema,
        },
      },
    },
    householdInformationChapter: {
      title: formChapterTitles.householdIncomeTitle,
      pages: {
        [formPageTitles.employmentHistoryTitle]: {
          path: 'household-income',
          title: formPageTitles.employmentHistoryTitle,
          uiSchema: employmentHistory.uiSchema,
          schema: employmentHistory.schema,
        },
      },
    },
  },
};

export default formConfig;
