// TODO: Add Ask-VA form schema when we know the full scope of the form
// import fullSchema from 'vets-json-schema/dist/XX-230-schema.json';

import {
  CHAPTER_1,
  CHAPTER_2,
  CHAPTER_3,
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

// // Personal Information
import relationshipToVeteranPage from './chapters/personalInformation/relationshipToVeteran';
import {
  flowPaths,
  generalQuestionPages,
  myOwnBenFamPages,
  myOwnBenVetPages,
  someoneElseBen3rdPartyPages,
  someoneElseBenFamPages,
  someoneElseBenVetPages,
} from './schema-helpers/formFlowHelper';

// Review Page
import Footer from '../components/Footer';
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
    'Get answers to your questions about VA benefits and services and upload documents online.',
  footerContent: Footer,
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
          onNavForward: ({ formData, goPath }) => {
            if (formData.questionAbout === 'GENERAL') {
              goPath(`/${flowPaths.general}-1`);
            } else if (formData.questionAbout !== 'GENERAL') {
              goPath(`/${CHAPTER_3.RELATIONSHIP_TO_VET.PATH}`);
            } else {
              goPath('/review-then-submit');
            }
          },
        },
      },
    },
    personalInformation: {
      title: CHAPTER_3.CHAPTER_TITLE,
      pages: {
        relationshipToVeteran: {
          path: CHAPTER_3.RELATIONSHIP_TO_VET.PATH,
          title: CHAPTER_3.RELATIONSHIP_TO_VET.TITLE,
          uiSchema: relationshipToVeteranPage.uiSchema,
          schema: relationshipToVeteranPage.schema,
          onNavForward: ({ formData, goPath }) => {
            // TODO: Refactor this when we know what the other category flows will look like.
            if (
              formData.personalRelationship === 'VETERAN' &&
              formData.questionAbout === 'MY_OWN'
            ) {
              goPath(`/${flowPaths.myOwnBenVet}-1`);
            } else if (
              formData.personalRelationship === 'FAMILY_MEMBER' &&
              formData.questionAbout === 'MY_OWN'
            ) {
              goPath(`/${flowPaths.myOwnBenFam}-1`);
            } else if (
              formData.personalRelationship === 'FAMILY_MEMBER' &&
              formData.questionAbout === 'SOMEONE_ELSE'
            ) {
              goPath(`/${flowPaths.someoneElseBenFam}-1`);
            } else if (
              formData.personalRelationship === 'VETERAN' &&
              formData.questionAbout === 'SOMEONE_ELSE'
            ) {
              goPath(`/${flowPaths.someoneElseBenVet}-1`);
            } else if (
              formData.personalRelationship === 'WORK' &&
              formData.questionAbout === 'SOMEONE_ELSE'
            ) {
              goPath(`/${flowPaths.someoneElseBen3rdParty}-1`);
            } else {
              goPath('/review-then-submit');
            }
          },
        },
        ...generalQuestionPages,
        ...myOwnBenVetPages,
        ...myOwnBenFamPages,
        ...someoneElseBenVetPages,
        ...someoneElseBenFamPages,
        ...someoneElseBen3rdPartyPages,
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
