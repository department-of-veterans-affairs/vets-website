import {
  CategoryEducation,
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
  flowPaths,
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

import CustomPageReviewField from '../components/CustomPageReviewField';
import prefillTransformer from './prefill-transformer';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  // TODO: Clear local storage after submit - localStorage.removeItem('askVAFiles')
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'ask-the-va-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '0873',
  saveInProgress: {
    messages: {
      inProgress: 'test inProgress',
      expired: 'test expired',
      saved: 'test saved',
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
          uiSchema: {
            selectCategory: { 'ui:title': CHAPTER_1.PAGE_1.QUESTION_1 },
          },
          schema: selectCategoryPage.schema,
          editModeOnReviewPage: false,
        },
        selectTopic: {
          path: CHAPTER_1.PAGE_2.PATH,
          title: CHAPTER_1.PAGE_2.TITLE,
          CustomPage: TopicSelectPage,
          CustomPageReview: CustomPageReviewField,
          uiSchema: {
            selectTopic: { 'ui:title': CHAPTER_1.PAGE_2.QUESTION_1 },
          },
          schema: selectTopicPage.schema,
          editModeOnReviewPage: false,
        },
        selectSubtopic: {
          path: CHAPTER_1.PAGE_3.PATH,
          title: CHAPTER_1.PAGE_3.TITLE,
          CustomPage: SubTopicSelectPage,
          CustomPageReview: CustomPageReviewField,
          uiSchema: {
            selectTopic: { 'ui:title': CHAPTER_1.PAGE_3.QUESTION_1 },
          },
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
          CustomPageReview: CustomPageReviewField,
          uiSchema: whoIsYourQuestionAboutPage.uiSchema,
          schema: whoIsYourQuestionAboutPage.schema,
          // Hidden - EDU Question are always 'General Question'
          depends: form => form.selectCategory !== CategoryEducation,
          onNavForward: ({ formData, goPath }) => {
            if (
              formData.selectCategory !== CategoryEducation &&
              formData.whoIsYourQuestionAbout !== "It's a general question"
            ) {
              goPath(CHAPTER_3.RELATIONSHIP_TO_VET.PATH);
            } else goPath(`/${flowPaths.general}-1`);
          },
        },
        relationshipToVeteran: {
          editModeOnReviewPage: false,
          path: CHAPTER_3.RELATIONSHIP_TO_VET.PATH,
          title: CHAPTER_3.RELATIONSHIP_TO_VET.TITLE,
          CustomPageReview: CustomPageReviewField,
          depends: form =>
            form.whoIsYourQuestionAbout !== "It's a general question",
          uiSchema: relationshipToVeteranPage.uiSchema,
          schema: relationshipToVeteranPage.schema,
        },
      },
    },
    aboutMyselfRelationshipVeteran: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        formData.whoIsYourQuestionAbout === 'Myself' &&
        formData.relationshipToVeteran === "I'm the Veteran",
      pages: { ...aboutMyselfRelationshipVeteranPages },
    },
    aboutMyselfRelationshipFamilyMember: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        formData.whoIsYourQuestionAbout === 'Myself' &&
        formData.relationshipToVeteran === "I'm a family member of a Veteran",
      pages: { ...aboutMyselfRelationshipFamilyMemberPages },
    },
    aboutSomeoneElseRelationshipVeteran: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        formData.whoIsYourQuestionAbout === 'Someone else' &&
        formData.relationshipToVeteran === "I'm the Veteran" &&
        formData.selectCategory !== CategoryEducation,
      pages: { ...aboutSomeoneElseRelationshipVeteranPages },
    },
    aboutSomeoneElseRelationshipFamilyMember: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        formData.whoIsYourQuestionAbout === 'Someone else' &&
        formData.relationshipToVeteran === "I'm a family member of a Veteran" &&
        formData.selectCategory !== CategoryEducation,
      pages: { ...aboutSomeoneElseRelationshipFamilyMemberPages },
    },
    aboutSomeoneElseRelationshipFamilyMemberAboutVeteran: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        formData.whoIsYourQuestionAbout === 'Myself' &&
        formData.relationshipToVeteran === "I'm the Veteran",
      pages: {
        ...aboutSomeoneElseRelationshipFamilyMemberAboutVeteranPages,
      },
    },
    aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        formData.whoIsYourQuestionAbout === 'Myself' &&
        formData.relationshipToVeteran === "I'm the Veteran",
      pages: {
        ...aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberPages,
      },
    },
    aboutSomeoneElseRelationshipConnectedThroughWork: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        formData.whoIsYourQuestionAbout === 'Someone else' &&
        formData.relationshipToVeteran ===
          "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)" &&
        formData.selectCategory !== CategoryEducation,
      pages: { ...aboutSomeoneElseRelationshipConnectedThroughWorkPages },
    },
    aboutSomeoneElseRelationshipConnectedThroughWorkEducation: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        formData.whoIsYourQuestionAbout === 'Someone else' &&
        formData.relationshipToVeteran ===
          "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)" &&
        formData.selectCategory === CategoryEducation,
      pages: {
        ...aboutSomeoneElseRelationshipConnectedThroughWorkEducationPages,
      },
    },
    aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducation: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        formData.whoIsYourQuestionAbout === 'Someone else' &&
        formData.relationshipToVeteran !==
          "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)" &&
        formData.selectCategory === CategoryEducation,
      pages: {
        ...aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationPages,
      },
    },
    generalQuestion: {
      title: CHAPTER_3.CHAPTER_TITLE,
      hideFormNavProgress: true,
      depends: formData =>
        formData.whoIsYourQuestionAbout === "It's a general question" ||
        formData.selectCategory === CategoryEducation,
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
