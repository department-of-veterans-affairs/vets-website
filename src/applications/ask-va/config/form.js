import {
  CHAPTER_1,
  CHAPTER_2,
  CHAPTER_3,
  requiredForSubtopicPage,
  whoIsYourQuestionAboutLabels,
} from '../constants';
import manifest from '../manifest.json';

import ConfirmationPage from '../containers/ConfirmationPage';
import IntroductionPage from '../containers/IntroductionPage';

// Category and Topic pages
import selectCategoryPage from './chapters/categoryAndTopic/selectCategory';
import selectSubtopicPage from './chapters/categoryAndTopic/selectSubtopic';
import selectTopicPage from './chapters/categoryAndTopic/selectTopic';

// Your Question
import whoIsYourQuestionAboutPage from './chapters/yourQuestion/whoIsYourQuestionAbout';
import yourQuestionPage from './chapters/yourQuestion/yourQuestion';

// Your Personal Information - Authenticated
import YourPersonalInformationAuthenticated from '../components/YourPersonalInformationAuthenticated';
import {
  aboutMyselfRelationshipFamilyMemberPages,
  aboutMyselfRelationshipVeteranPages,
  aboutSomeoneElseRelationshipConnectedThroughWorkEducationPages,
  aboutSomeoneElseRelationshipConnectedThroughWorkPages,
  aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberPages,
  aboutSomeoneElseRelationshipFamilyMemberAboutVeteranPages,
  aboutSomeoneElseRelationshipFamilyMemberPages,
  aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationPages,
  aboutSomeoneElseRelationshipVeteranPages,
  generalQuestionPages,
} from './schema-helpers/formFlowHelper';

// // Personal Information
import relationshipToVeteranPage from './chapters/personalInformation/relationshipToVeteran';

// Review Page
import Footer from '../components/Footer';
import CategorySelectPage from '../containers/CategorySelectPage';
import ReviewPage from '../containers/ReviewPage';
import SubTopicSelectPage from '../containers/SubTopicSelectPage';
import TopicSelectPage from '../containers/TopicSelectPage';
import WhoIsYourQuestionAboutCustomPage from '../containers/WhoIsYourQuestionAboutCustomPage';

import CustomPageReviewField from '../components/CustomPageReviewField';
import {
  aboutMyselfRelationshipFamilyMemberCondition,
  aboutMyselfRelationshipVeteranCondition,
  aboutSomeoneElseRelationshipConnectedThroughWorkCondition,
  aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition,
  aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition,
  aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition,
  aboutSomeoneElseRelationshipFamilyMemberCondition,
  aboutSomeoneElseRelationshipVeteranCondition,
  aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition,
  generalQuestionCondition,
  whoIsYourQuestionAboutCondition,
} from './helpers';
import prefillTransformer from './prefill-transformer';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  trackingPrefix: 'ask-the-va-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '0873',
  customText: {
    appAction: 'asking your question',
    appSavedSuccessfullyMessage: 'Your question has been saved.',
    appType: 'question',
    continueAppButtonText: 'Continue your question',
    finishAppLaterMessage: 'Finish this question later',
    startNewAppButtonText: 'Start a new question',
  },

  saveInProgress: {
    messages: {
      inProgress: 'Your question is in progress',
      expired: 'Your question expired',
      saved: 'Your question has been saved',
    },
    resumeOnly: false,
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'test notFound',
    noAuth: 'test no auth',
  },
  title: 'Ask VA',
  subTitle: 'Get answers to your questions about VA benefits and services.',
  footerContent: Footer,
  defaultDefinitions: {},
  chapters: {
    categoryAndTopic: {
      title: CHAPTER_1.CHAPTER_TITLE,
      hideFormNavProgress: true,
      pages: {
        yourPersonalInformation: {
          // Auth only - hidden on review page
          path: CHAPTER_3.YOUR_PERSONAL_INFORMATION.PATH,
          title: CHAPTER_3.YOUR_PERSONAL_INFORMATION.TITLE,
          CustomPage: YourPersonalInformationAuthenticated,
          CustomPageReview: null,
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
        },
        selectCategory: {
          path: CHAPTER_1.PAGE_1.PATH,
          title: CHAPTER_1.PAGE_1.TITLE,
          CustomPage: CategorySelectPage,
          CustomPageReview: CustomPageReviewField,
          uiSchema: selectCategoryPage.uiSchema,
          schema: selectCategoryPage.schema,
          editModeOnReviewPage: false,
        },
        selectTopic: {
          path: CHAPTER_1.PAGE_2.PATH,
          title: CHAPTER_1.PAGE_2.TITLE,
          CustomPage: TopicSelectPage,
          CustomPageReview: CustomPageReviewField,
          uiSchema: selectTopicPage.uiSchema,
          schema: selectTopicPage.schema,
          editModeOnReviewPage: false,
        },
        selectSubtopic: {
          path: CHAPTER_1.PAGE_3.PATH,
          title: CHAPTER_1.PAGE_3.TITLE,
          CustomPage: SubTopicSelectPage,
          CustomPageReview: CustomPageReviewField,
          uiSchema: selectSubtopicPage.uiSchema,
          schema: selectSubtopicPage.schema,
          depends: form => requiredForSubtopicPage.includes(form.selectTopic),
          editModeOnReviewPage: false,
        },
      },
    },
    yourQuestionPart1: {
      title: 'Your Question Part 1',
      hideFormNavProgress: true,
      pages: {
        whoIsYourQuestionAbout: {
          editModeOnReviewPage: false,
          path: CHAPTER_2.PAGE_1.PATH,
          title: CHAPTER_2.PAGE_1.TITLE,
          CustomPage: WhoIsYourQuestionAboutCustomPage,
          CustomPageReview: CustomPageReviewField,
          uiSchema: whoIsYourQuestionAboutPage.uiSchema,
          schema: whoIsYourQuestionAboutPage.schema,
          depends: formData => {
            return whoIsYourQuestionAboutCondition(formData);
          },
        },
        relationshipToVeteran: {
          editModeOnReviewPage: false,
          path: CHAPTER_3.RELATIONSHIP_TO_VET.PATH,
          title: CHAPTER_3.RELATIONSHIP_TO_VET.TITLE,
          CustomPageReview: CustomPageReviewField,
          depends: form => {
            return (
              form.whoIsYourQuestionAbout !==
              whoIsYourQuestionAboutLabels.GENERAL
            );
          },
          uiSchema: relationshipToVeteranPage.uiSchema,
          schema: relationshipToVeteranPage.schema,
        },
      },
    },
    aboutMyselfRelationshipVeteran: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData => aboutMyselfRelationshipVeteranCondition(formData),
      pages: { ...aboutMyselfRelationshipVeteranPages },
    },
    aboutMyselfRelationshipFamilyMember: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        aboutMyselfRelationshipFamilyMemberCondition(formData),
      pages: { ...aboutMyselfRelationshipFamilyMemberPages },
    },
    aboutSomeoneElseRelationshipVeteran: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        aboutSomeoneElseRelationshipVeteranCondition(formData),
      pages: { ...aboutSomeoneElseRelationshipVeteranPages },
    },
    aboutSomeoneElseRelationshipFamilyMember: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        aboutSomeoneElseRelationshipFamilyMemberCondition(formData),
      pages: { ...aboutSomeoneElseRelationshipFamilyMemberPages },
    },
    aboutSomeoneElseRelationshipFamilyMemberAboutVeteran: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition(formData),
      pages: {
        ...aboutSomeoneElseRelationshipFamilyMemberAboutVeteranPages,
      },
    },
    aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition(
          formData,
        ),
      pages: {
        ...aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberPages,
      },
    },
    aboutSomeoneElseRelationshipConnectedThroughWork: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        aboutSomeoneElseRelationshipConnectedThroughWorkCondition(formData),
      pages: { ...aboutSomeoneElseRelationshipConnectedThroughWorkPages },
    },
    aboutSomeoneElseRelationshipConnectedThroughWorkEducation: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition(
          formData,
        ),
      pages: {
        ...aboutSomeoneElseRelationshipConnectedThroughWorkEducationPages,
      },
    },
    aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducation: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition(
          formData,
        ),
      pages: {
        ...aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationPages,
      },
    },
    generalQuestion: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData => generalQuestionCondition(formData),
      pages: { ...generalQuestionPages },
    },
    yourQuestionPart2: {
      title: CHAPTER_2.CHAPTER_TITLE,
      hideFormNavProgress: true,
      pages: {
        question: {
          path: CHAPTER_2.PAGE_3.PATH,
          title: CHAPTER_2.PAGE_3.TITLE,
          // CustomPageReview: CustomYourQuestionReviewField,
          uiSchema: yourQuestionPage.uiSchema,
          schema: yourQuestionPage.schema,
          onNavForward: ({ goPath }) => {
            goPath('/review-then-submit');
          },
        },
      },
    },

    review: {
      title: 'Review and submit',
      hideFormNavProgress: true,
      pages: {
        reviewForm: {
          title: 'Review and submit',
          path: 'review-then-submit',
          CustomPage: ReviewPage,
          CustomPageReview: null,
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {},
          },
          onNavForward: ({ goPath }) => {
            goPath('/confirmation');
          },
        },
      },
    },
  },
};

export default formConfig;
