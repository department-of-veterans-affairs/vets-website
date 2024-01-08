// TODO: Add Ask-VA form schema when we know the full scope of the form
// import fullSchema from 'vets-json-schema/dist/XX-230-schema.json';

import manifest from '../manifest.json';
import {
  requiredForSubtopicPage,
  CHAPTER_1,
  CHAPTER_2,
  CHAPTER_3,
} from '../constants';

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
import aboutTheFamilyMemberPage from './chapters/personalInformation/aboutTheFamilyMember';
import aboutYourRelationshipToFamilyMemberPage from './chapters/personalInformation/relationshipToFamilyMember';
import relationshipToVeteranPage from './chapters/personalInformation/relationshipToVeteran';
import aboutYourRelationshipPage from './chapters/personalInformation/aboutYourRelationship';
import whoQuestionAboutPage from './chapters/personalInformation/questionIsAbout';
import isTheVeteranDeceasedPage from './chapters/personalInformation/isTheVeteranDeceased';
import deathDatePage from './chapters/personalInformation/deathDate';
import howToContactPage from './chapters/personalInformation/howToContact';

// Contact Information
import aboutTheVeteranPage from './chapters/personalInformation/aboutTheVeteran';
import veteransAddressZipPage from './chapters/personalInformation/veteranAddressZip';
import aboutYourselfPage from './chapters/personalInformation/aboutYourself';
import yourPhoneAndEmailPage from './chapters/personalInformation/yourPhoneAndEmail';
import yourCountryPage from './chapters/personalInformation/yourCountry';
import yourAddressPage from './chapters/personalInformation/yourAddress';
import addressConfirmationPage from './chapters/personalInformation/addressConfirmation';

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
        tellUsYourQuestion: {
          path: CHAPTER_2.PAGE_1.PATH,
          title: CHAPTER_2.PAGE_1.TITLE,
          uiSchema: yourQuestionPage.uiSchema,
          schema: yourQuestionPage.schema,
        },
      },
    },
    personalInformation: {
      title: CHAPTER_3.CHAPTER_TITLE,
      pages: {
        relationshipToVeteran: {
          path: CHAPTER_3.PAGE_1.PATH,
          title: CHAPTER_3.PAGE_1.TITLE,
          uiSchema: relationshipToVeteranPage.uiSchema,
          schema: relationshipToVeteranPage.schema,
        },
        aboutYourRelationship: {
          path: CHAPTER_3.PAGE_2.PATH,
          title: CHAPTER_3.PAGE_2.TITLE,
          uiSchema: aboutYourRelationshipPage.uiSchema,
          schema: aboutYourRelationshipPage.schema,
        },
        aboutTheVeteran: {
          path: CHAPTER_3.PAGE_3.PATH,
          title: CHAPTER_3.PAGE_3.TITLE,
          uiSchema: aboutTheVeteranPage.uiSchema,
          schema: aboutTheVeteranPage.schema,
        },
        veteranDeceased: {
          path: CHAPTER_3.PAGE_4.PATH,
          title: CHAPTER_3.PAGE_4.TITLE,
          uiSchema: isTheVeteranDeceasedPage.uiSchema,
          schema: isTheVeteranDeceasedPage.schema,
        },
        dateOfDeath: {
          path: CHAPTER_3.PAGE_5.PATH,
          title: CHAPTER_3.PAGE_5.TITLE,
          uiSchema: deathDatePage.uiSchema,
          schema: deathDatePage.schema,
        },
        veteransAddressZip: {
          path: CHAPTER_3.PAGE_6.PATH,
          title: CHAPTER_3.PAGE_6.TITLE,
          uiSchema: veteransAddressZipPage.uiSchema,
          schema: veteransAddressZipPage.schema,
        },
        whoIsAbout: {
          path: CHAPTER_3.PAGE_7.PATH,
          title: CHAPTER_3.PAGE_7.TITLE,
          uiSchema: whoQuestionAboutPage.uiSchema,
          schema: whoQuestionAboutPage.schema,
        },
        vaEmployee: {
          path: CHAPTER_3.PAGE_8.PATH,
          title: CHAPTER_3.PAGE_8.TITLE,
          uiSchema: vaEmployeePage.uiSchema,
          schema: vaEmployeePage.schema,
        },
        aboutYourself: {
          path: CHAPTER_3.PAGE_9.PATH,
          title: CHAPTER_3.PAGE_9.TITLE,
          uiSchema: aboutYourselfPage.uiSchema,
          schema: aboutYourselfPage.schema,
        },
        searchVAMedicalCenter: {
          path: CHAPTER_3.PAGE_10.PATH,
          title: CHAPTER_3.PAGE_10.TITLE,
          uiSchema: searchVAMedicalCenterPage.uiSchema,
          schema: searchVAMedicalCenterPage.schema,
        },
        yourPhoneAndEmail: {
          path: CHAPTER_3.PAGE_11.PATH,
          title: CHAPTER_3.PAGE_11.TITLE,
          uiSchema: yourPhoneAndEmailPage.uiSchema,
          schema: yourPhoneAndEmailPage.schema,
        },
        howToContact: {
          path: CHAPTER_3.PAGE_12.PATH,
          title: CHAPTER_3.PAGE_12.TITLE,
          uiSchema: howToContactPage.uiSchema,
          schema: howToContactPage.schema,
        },
        yourCountry: {
          path: CHAPTER_3.PAGE_13.PATH,
          title: CHAPTER_3.PAGE_13.TITLE,
          uiSchema: yourCountryPage.uiSchema,
          schema: yourCountryPage.schema,
        },
        yourAddress: {
          path: CHAPTER_3.PAGE_14.PATH,
          title: CHAPTER_3.PAGE_14.TITLE,
          uiSchema: yourAddressPage.uiSchema,
          schema: yourAddressPage.schema,
        },
        yourAddressConfirmation: {
          path: CHAPTER_3.PAGE_15.PATH,
          title: CHAPTER_3.PAGE_15.TITLE,
          uiSchema: addressConfirmationPage.uiSchema,
          schema: addressConfirmationPage.schema,
          depends: form => !form.onBaseOutsideUS,
        },
        aboutYourFamilyMember: {
          path: CHAPTER_3.PAGE_16.PATH,
          title: CHAPTER_3.PAGE_16.TITLE,
          uiSchema: aboutTheFamilyMemberPage.uiSchema,
          schema: aboutTheFamilyMemberPage.schema,
        },
        aboutYourRelationshipToFamilyMember: {
          path: CHAPTER_3.PAGE_17.PATH,
          title: CHAPTER_3.PAGE_17.TITLE,
          uiSchema: aboutYourRelationshipToFamilyMemberPage.uiSchema,
          schema: aboutYourRelationshipToFamilyMemberPage.schema,
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
