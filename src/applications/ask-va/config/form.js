// TODO: Add Ask-VA form schema when we know the full scope of the form
// import fullSchema from 'vets-json-schema/dist/XX-230-schema.json';

import manifest from '../manifest.json';
import { requiredForSubtopicPage, CHAPTER_3, CHAPTER_4 } from '../constants';

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
import whoHasAQuestionPage from './chapters/personalInformation/whoHasAQuestion';
import areYouTheVeteranPage from './chapters/personalInformation/areYouTheVeteran';
import areYouTheDependentPage from './chapters/personalInformation/areYouTheDependent';
import relationshipToVeteranPage from './chapters/personalInformation/relationshipToVeteran';
import isTheVeteranDeceasedPage from './chapters/personalInformation/isTheVeteranDeceased';
import deathDatePage from './chapters/personalInformation/deathDate';

// Contact Information
import aboutTheVeteranPage from './chapters/contactInformation/aboutTheVeteran';
import veteransAddressZipPage from './chapters/contactInformation/veteranAddressZip';
import aboutYourselfPage from './chapters/contactInformation/aboutYourself';
import yourPhoneAndEmailPage from './chapters/contactInformation/yourPhoneAndEmail';
import yourCountryPage from './chapters/contactInformation/yourCountry';
import yourAddressPage from './chapters/contactInformation/yourAddress';
// import veteransAddressPage from './chapters/contactInformation/veteransAddress';
import addressConfirmationPage from './chapters/contactInformation/addressConfirmation';

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
    vaInformation: {
      title: CHAPTER_3.CHAPTER_TITLE,
      pages: {
        searchVAMedicalCenter: {
          path: CHAPTER_3.PAGE_1.PATH,
          title: CHAPTER_3.PAGE_1.TITLE,
          uiSchema: searchVAMedicalCenterPage.uiSchema,
          schema: searchVAMedicalCenterPage.schema,
        },
        whoHasAQuestion: {
          path: CHAPTER_3.PAGE_2.PATH,
          title: CHAPTER_3.PAGE_2.TITLE,
          uiSchema: whoHasAQuestionPage.uiSchema,
          schema: whoHasAQuestionPage.schema,
        },
        areYouTheVeteran: {
          path: CHAPTER_3.PAGE_3.PATH,
          title: CHAPTER_3.PAGE_3.TITLE,
          uiSchema: areYouTheVeteranPage.uiSchema,
          schema: areYouTheVeteranPage.schema,
        },
        areYouTheDependent: {
          path: CHAPTER_3.PAGE_4.PATH,
          title: CHAPTER_3.PAGE_4.TITLE,
          uiSchema: areYouTheDependentPage.uiSchema,
          schema: areYouTheDependentPage.schema,
        },
        relationshipToVeteran: {
          path: CHAPTER_3.PAGE_5.PATH,
          title: CHAPTER_3.PAGE_5.TITLE,
          uiSchema: relationshipToVeteranPage.uiSchema,
          schema: relationshipToVeteranPage.schema,
        },
        veteranDeceased: {
          path: CHAPTER_3.PAGE_6.PATH,
          title: CHAPTER_3.PAGE_6.TITLE,
          uiSchema: isTheVeteranDeceasedPage.uiSchema,
          schema: isTheVeteranDeceasedPage.schema,
        },
        dateOfDeath: {
          path: CHAPTER_3.PAGE_7.PATH,
          title: CHAPTER_3.PAGE_7.TITLE,
          uiSchema: deathDatePage.uiSchema,
          schema: deathDatePage.schema,
        },
      },
    },
    contactInformation: {
      title: CHAPTER_4.CHAPTER_TITLE,
      pages: {
        aboutTheVeteran: {
          path: CHAPTER_4.PAGE_1.PATH,
          title: CHAPTER_4.PAGE_1.TITLE,
          uiSchema: aboutTheVeteranPage.uiSchema,
          schema: aboutTheVeteranPage.schema,
        },
        veteransAddressZip: {
          path: CHAPTER_4.PAGE_2.PATH,
          title: CHAPTER_4.PAGE_2.TITLE,
          uiSchema: veteransAddressZipPage.uiSchema,
          schema: veteransAddressZipPage.schema,
        },
        aboutYourself: {
          path: CHAPTER_4.PAGE_3.PATH,
          title: CHAPTER_4.PAGE_3.TITLE,
          uiSchema: aboutYourselfPage.uiSchema,
          schema: aboutYourselfPage.schema,
        },
        yourPhoneAndEmail: {
          path: CHAPTER_4.PAGE_4.PATH,
          title: CHAPTER_4.PAGE_4.TITLE,
          uiSchema: yourPhoneAndEmailPage.uiSchema,
          schema: yourPhoneAndEmailPage.schema,
        },
        yourCountry: {
          path: CHAPTER_4.PAGE_5.PATH,
          title: CHAPTER_4.PAGE_5.TITLE,
          uiSchema: yourCountryPage.uiSchema,
          schema: yourCountryPage.schema,
        },
        yourAddress: {
          path: CHAPTER_4.PAGE_6.PATH,
          title: CHAPTER_4.PAGE_6.TITLE,
          uiSchema: yourAddressPage.uiSchema,
          schema: yourAddressPage.schema,
        },
        yourAddressConfirmation: {
          path: CHAPTER_4.PAGE_7.PATH,
          title: CHAPTER_4.PAGE_7.TITLE,
          uiSchema: addressConfirmationPage.uiSchema,
          schema: addressConfirmationPage.schema,
          depends: form => !form.onBaseOutsideUS,
        },
      },
    },
  },
};

export default formConfig;
