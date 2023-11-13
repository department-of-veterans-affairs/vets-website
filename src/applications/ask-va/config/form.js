// TODO: Add Ask-VA form schema when we know the full scope of the form
// import fullSchema from 'vets-json-schema/dist/XX-230-schema.json';

import manifest from '../manifest.json';
import { requiredForSubtopicPage } from '../constants';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Category and Topic pages
import selectTopicPage from './chapters/categoryAndTopic/selectTopic';
import selectCategoryPage from './chapters/categoryAndTopic/selectCategory';
import selectSubtopicPage from './chapters/categoryAndTopic/selectSubtopic';

// Your Question
import yourQuestionPage from './chapters/yourQuestion/yourQuestion';

// Personal Information
import searchVAMedicalCenterPage from './chapters/personalInformation/searchVAMedicalCenter';
import vaEmployeePage from './chapters/personalInformation/vaEmployee';
import submitterContactPage from './chapters/personalInformation/submitterContact';

// Contact Information
import veteransAddressPage from './chapters/contactInformation/veteransAddress';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'ask-the-va-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  formId: '0873',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your ask the va test application (XX-230) is in progress.',
    //   expired: 'Your saved ask the va test application (XX-230) has expired. If you want to apply for ask the va test, please start a new application.',
    //   saved: 'Your ask the va test application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for ask the va test.',
    noAuth:
      'Please sign in again to continue your application for ask the va test.',
  },
  title: 'Ask VA',
  subTitle:
    'Get answers to your questions about VA benefits and services and send documents online',
  defaultDefinitions: {},
  chapters: {
    categoryAndTopic: {
      title: 'Category and Topic',
      pages: {
        selectCategory: {
          path: 'category-topic-1',
          title: 'Category Selected',
          editModeOnReviewPage: true,
          uiSchema: selectCategoryPage.uiSchema,
          schema: selectCategoryPage.schema,
        },
        selectTopic: {
          path: 'category-topic-2',
          title: 'Topic Selected',
          editModeOnReviewPage: true,
          uiSchema: selectTopicPage.uiSchema,
          schema: selectTopicPage.schema,
        },
        selectSubtopic: {
          path: 'category-topic-3',
          title: 'SubTopic Selected',
          editModeOnReviewPage: true,
          uiSchema: selectSubtopicPage.uiSchema,
          schema: selectSubtopicPage.schema,
          depends: form => requiredForSubtopicPage.includes(form.selectTopic),
        },
      },
    },
    yourQuestion: {
      title: 'Your Question',
      pages: {
        tellUsYourQuestion: {
          path: 'question-1',
          title: 'Tell us your question',
          uiSchema: yourQuestionPage.uiSchema,
          schema: yourQuestionPage.schema,
        },
      },
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        searchVAMedicalCenter: {
          path: 'personal-info-1',
          title: 'VA Medical Center',
          uiSchema: searchVAMedicalCenterPage.uiSchema,
          schema: searchVAMedicalCenterPage.schema,
        },
        vaEmployee: {
          path: 'personal-info-2',
          title: 'VA Employee',
          subTitle: 'testing subTitle',
          uiSchema: vaEmployeePage.uiSchema,
          schema: vaEmployeePage.schema,
        },
        submitterContactInfo: {
          path: 'personal-info-3',
          title: "Submitter's Contact Information",
          uiSchema: submitterContactPage.uiSchema,
          schema: submitterContactPage.schema,
        },
      },
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
        veteransAddress: {
          path: 'contact-info-1',
          title: 'Veteran Address',
          uiSchema: veteransAddressPage.uiSchema,
          schema: veteransAddressPage.schema,
        },
      },
    },
  },
};

export default formConfig;
