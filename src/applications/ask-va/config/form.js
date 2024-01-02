// TODO: Add Ask-VA form schema when we know the full scope of the form
// import fullSchema from 'vets-json-schema/dist/XX-230-schema.json';

import {
  CHAPTER_1,
  CHAPTER_2,
  CHAPTER_3,
  CHAPTER_4,
  requiredForSubtopicPage,
} from '../constants';
import manifest from '../manifest.json';

import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';

// Category and Topic pages
import selectCategoryPage from './chapters/categoryAndTopic/selectCategory';
import selectSubtopicPage from './chapters/categoryAndTopic/selectSubtopic';
import selectTopicPage from './chapters/categoryAndTopic/selectTopic';

// Your Question
import questionAboutPage from './chapters/yourQuestion/questionAbout';
import reasonContactPage from './chapters/yourQuestion/reasonContacting';
import yourQuestionPage from './chapters/yourQuestion/yourQuestion';

// Personal Information
import areYouTheDependentPage from './chapters/personalInformation/areYouTheDependent';
import areYouTheVeteranPage from './chapters/personalInformation/areYouTheVeteran';
import deathDatePage from './chapters/personalInformation/deathDate';
import isTheVeteranDeceasedPage from './chapters/personalInformation/isTheVeteranDeceased';
import relationshipToVeteranPage from './chapters/personalInformation/relationshipToVeteran';
import searchVAMedicalCenterPage from './chapters/personalInformation/searchVAMedicalCenter';
import whoHasAQuestionPage from './chapters/personalInformation/whoHasAQuestion';

// Contact Information
import aboutTheVeteranPage from './chapters/contactInformation/aboutTheVeteran';
import aboutYourselfPage from './chapters/contactInformation/aboutYourself';
import veteransAddressZipPage from './chapters/contactInformation/veteranAddressZip';
import yourAddressPage from './chapters/contactInformation/yourAddress';
import yourCountryPage from './chapters/contactInformation/yourCountry';
import yourPhoneAndEmailPage from './chapters/contactInformation/yourPhoneAndEmail';
// import veteransAddressPage from './chapters/contactInformation/veteransAddress';
import addressConfirmationPage from './chapters/contactInformation/addressConfirmation';

// Review Page
import ReviewPage from '../containers/ReviewPage';

const review = {
  uiSchema: {},
  schema: {
    definitions: {},
    type: 'object',
    properties: {},
  },
};

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
      title: CHAPTER_1.CHAPTER_TITLE,
      pages: {
        selectCategory: {
          path: CHAPTER_1.PAGE_1.PATH,
          title: CHAPTER_1.PAGE_1.TITLE,
          uiSchema: selectCategoryPage.uiSchema,
          schema: selectCategoryPage.schema,
          editModeOnReviewPage: false,
        },
        selectTopic: {
          path: CHAPTER_1.PAGE_2.PATH,
          title: CHAPTER_1.PAGE_2.TITLE,
          uiSchema: selectTopicPage.uiSchema,
          schema: selectTopicPage.schema,
        },
        selectSubtopic: {
          path: CHAPTER_1.PAGE_3.PATH,
          title: CHAPTER_1.PAGE_3.TITLE,
          uiSchema: selectSubtopicPage.uiSchema,
          schema: selectSubtopicPage.schema,
          depends: form => requiredForSubtopicPage.includes(form.selectTopic),
        },
      },
    },
    yourQuestion: {
      title: CHAPTER_2.CHAPTER_TITLE,
      pages: {
        whatsYourQuestionAbout: {
          path: CHAPTER_2.PAGE_1.PATH,
          title: CHAPTER_2.PAGE_1.TITLE,
          uiSchema: questionAboutPage.uiSchema,
          schema: questionAboutPage.schema,
        },
        reasonYoureContactingUs: {
          path: CHAPTER_2.PAGE_2.PATH,
          title: CHAPTER_2.PAGE_2.TITLE,
          uiSchema: reasonContactPage.uiSchema,
          schema: reasonContactPage.schema,
        },
        tellUsYourQuestion: {
          path: CHAPTER_2.PAGE_3.PATH,
          title: CHAPTER_2.PAGE_3.TITLE,
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
        veteransAddressZip: {
          path: CHAPTER_4.PAGE_1.PATH,
          title: CHAPTER_4.PAGE_1.TITLE,
          uiSchema: veteransAddressZipPage.uiSchema,
          schema: veteransAddressZipPage.schema,
        },
        aboutTheVeteran: {
          path: CHAPTER_4.PAGE_2.PATH,
          title: CHAPTER_4.PAGE_2.TITLE,
          uiSchema: aboutTheVeteranPage.uiSchema,
          schema: aboutTheVeteranPage.schema,
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
    review: {
      title: 'Review and submit',
      pages: {
        reviewForm: {
          title: 'Review and submit',
          path: 'review-then-submit',
          CustomPage: ReviewPage,
          CustomPageReview: null,
          uiSchema: review.uiSchema,
          schema: review.schema,
        },
      },
    },
  },
};

export default formConfig;
