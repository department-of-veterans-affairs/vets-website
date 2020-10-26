// import _ from 'lodash/fp';
// import moment from 'moment';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { VA_FORM_IDS } from 'platform/forms/constants';
import manifest from '../manifest.json';
// import applicantInformation from 'platform/forms/pages/applicantInformation';
import fullSchema from '../schema/5655-schema.json';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from '../components/GetFormHelp';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import VeteranInfoBox from '../components/VeteranInfoBox';

const { fullName } = fullSchema.definitions;
// const { vaFileNumber } = fullSchema.properties;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'fsr-5655-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_5655,
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your [savedFormDescription] is in progress.',
    //   expired: 'Your saved [savedFormDescription] has expired. If you want to apply for [benefitType], please start a new [appType].',
    //   saved: 'Your [benefitType] [appType] has been saved.',
    // },
  },
  defaultDefinitions: {
    fullName,
  },
  title: 'Financial Status Report (5655)',
  subTitle: 'Form 5655',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  chapters: {
    veteranInformationChapter: {
      title: 'Veteran Information',
      pages: {
        'Veteran information': {
          path: 'veteran-information',
          title: 'Veteran information',
          uiSchema: {
            'view:veteranInfo': {
              'ui:field': VeteranInfoBox,
              first: {
                'ui:title': 'First name',
                'ui:errorMessages': {
                  required: 'Please enter a first name',
                },
              },
              last: {
                'ui:title': 'Last name',
                'ui:errorMessages': {
                  required: 'Please enter a last name',
                },
              },
              middle: {
                'ui:title': 'Middle name',
              },
              suffix: {
                'ui:title': 'Suffix',
                'ui:options': {
                  widgetClassNames: 'form-select-medium',
                },
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:veteranInfo': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
