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
import yourQuestionPage from './chapters/yourQuestion/yourQuestion';

// Your Personal Information - Authenticated
import YourPersonalInformationAuthenticated from '../components/YourPersonalInformationAuthenticated';

// // Personal Information
import relationshipToVeteranPage from './chapters/personalInformation/relationshipToVeteran';
import {
  aboutMyselfRelationshipFamilyMemberPages,
  aboutMyselfRelationshipVeteranPages,
  aboutSomeoneElseRelationshipConnectedThroughWorkPages,
  aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberPages,
  aboutSomeoneElseRelationshipFamilyMemberAboutVeteranPages,
  aboutSomeoneElseRelationshipFamilyMemberPages,
  aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationPages,
  aboutSomeoneElseRelationshipVeteranPages,
  flowPaths,
  generalQuestionPages,
} from './schema-helpers/formFlowHelper';

// Review Page
import Footer from '../components/Footer';
import ReviewPage from '../containers/ReviewPage';

// const mockUser = {
//   first: 'Mark',
//   last: 'Webb',
//   dateOfBirth: '1950-10-04',
//   socialOrServiceNum: {
//     ssn: '1112223333',
//     service: null,
//   },
// };

import prefillTransformer from './prefill-transformer';

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
  prefillTransformer,
  savedFormMessages: {
    // notFound: 'Please start over to apply for ask the va test.',
    // noAuth:
    //   'Please sign in again to continue your application for ask the va test.',
  },
  title: 'Ask VA',
  subTitle: 'Get answers to your questions about VA benefits and services.',
  footerContent: Footer,
  defaultDefinitions: {},
  chapters: {
    categoryAndTopic: {
      title: CHAPTER_1.CHAPTER_TITLE,
      pages: {
        yourPersonalInformation: {
          path: CHAPTER_3.YOUR_PERSONAL_INFORMATION.PATH,
          title: CHAPTER_3.YOUR_PERSONAL_INFORMATION.TITLE,
          CustomPage: YourPersonalInformationAuthenticated,
          CustomPageReview: null,
          schema: {
            // This does still need to be here or it'll throw an error
            type: 'object',
            properties: {}, // The properties can be empty
          },
          uiSchema: {}, // UI schema is completely ignored
        },
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
        whoIsYourQuestionAbout: {
          path: CHAPTER_2.PAGE_1.PATH,
          title: CHAPTER_2.PAGE_1.TITLE,
          uiSchema: questionAboutPage.uiSchema,
          schema: questionAboutPage.schema,
          // Hidden - EDU Question are always 'General Question'
          depends: formData =>
            formData.selectCategory !==
            'Education (Ch.30, 33, 35, 1606, etc. & Work Study)',
          onNavForward: ({ formData, goPath }) => {
            if (
              formData.selectCategory !==
                'Education (Ch.30, 33, 35, 1606, etc. & Work Study)' &&
              formData.questionAbout !== 'GENERAL'
            ) {
              goPath(CHAPTER_3.RELATIONSHIP_TO_VET.PATH);
            } else {
              goPath(`/${flowPaths.general}-1`);
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
            if (
              formData.questionAbout === 'MYSELF' &&
              formData.personalRelationship === 'VETERAN'
            ) {
              goPath(`/${flowPaths.aboutMyselfRelationshipVeteran}-1`);
            } else if (
              formData.questionAbout === 'MYSELF' &&
              formData.personalRelationship === 'FAMILY_MEMBER'
            ) {
              goPath(`/${flowPaths.aboutMyselfRelationshipFamilyMember}-1`);
            } else if (
              formData.questionAbout === 'SOMEONE_ELSE' &&
              formData.personalRelationship === 'VETERAN' &&
              formData.selectCategory !==
                'Education (Ch.30, 33, 35, 1606, etc. & Work Study)'
            ) {
              goPath(`/${flowPaths.aboutSomeoneElseRelationshipVeteran}-1`);
            } else if (
              formData.questionAbout === 'SOMEONE_ELSE' &&
              formData.personalRelationship === 'FAMILY_MEMBER' &&
              formData.selectCategory !==
                'Education (Ch.30, 33, 35, 1606, etc. & Work Study)'
            ) {
              goPath(
                `/${flowPaths.aboutSomeoneElseRelationshipFamilyMember}-1`,
              );
            } else if (
              formData.questionAbout === 'SOMEONE_ELSE' &&
              formData.personalRelationship !== 'WORK' &&
              formData.selectCategory ===
                'Education (Ch.30, 33, 35, 1606, etc. & Work Study)'
            ) {
              goPath(
                `/${
                  flowPaths.aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducation
                }-1`,
              );
            } else if (
              formData.questionAbout === 'SOMEONE_ELSE' &&
              formData.personalRelationship === 'WORK'
            ) {
              goPath(
                `/${
                  flowPaths.aboutSomeoneElseRelationshipConnectedThroughWork
                }-1`,
              );
            } else if (
              formData.questionAbout === 'SOMEONE_ELSE' &&
              formData.personalRelationship === 'WORK' &&
              formData.selectCategory ===
                'Education (Ch.30, 33, 35, 1606, etc. & Work Study)'
            ) {
              goPath(
                `/${
                  flowPaths.aboutSomeoneElseRelationshipConnectedThroughWorkEducation
                }-1`,
              );
            } else if (
              formData.questionAbout === 'GENERAL' ||
              formData.selectCategory ===
                'Education (Ch.30, 33, 35, 1606, etc. & Work Study)'
            ) {
              goPath(`/${flowPaths.general}-1`);
            } else {
              goPath('/review-then-submit');
            }
          },
        },
        ...generalQuestionPages,
        ...aboutMyselfRelationshipVeteranPages,
        ...aboutMyselfRelationshipFamilyMemberPages,
        ...aboutSomeoneElseRelationshipVeteranPages,
        ...aboutSomeoneElseRelationshipFamilyMemberPages,
        ...aboutSomeoneElseRelationshipFamilyMemberAboutVeteranPages,
        ...aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberPages,
        ...aboutSomeoneElseRelationshipConnectedThroughWorkPages,
        ...aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationPages,
      },
    },
    yourQuestion: {
      title: CHAPTER_2.CHAPTER_TITLE,
      pages: {
        tellUsYourQuestion: {
          path: CHAPTER_2.PAGE_3.PATH,
          title: CHAPTER_2.PAGE_3.TITLE,
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
