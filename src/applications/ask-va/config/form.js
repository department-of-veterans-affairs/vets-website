// TODO: Add Ask-VA form schema when we know the full scope of the form
// import fullSchema from 'vets-json-schema/dist/XX-230-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// Category and Topic pages
import selectTopicPage from './chapters/categoryAndTopic/selectTopic';
import selectCategoryPage from './chapters/categoryAndTopic/selectCategory';

// Your Question
import yourQuestionPage from './chapters/yourQuestion/yourQuestion';

// Submitter Contact Information
import submitterContactPage from './chapters/submitterInformation/submitterContact';

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
    submitterInfo: {
      title: "Submitter's Information",
      pages: {
        submitterContactInfo: {
          path: 'submitter-info-1',
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
