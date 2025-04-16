import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  TITLE,
  SUBTITLE,
  YOUR_INFORMATION_CHAPTER_CONSTANTS,
  CONTACT_INFORMATION_CHAPTER_CONSTANTS,
} from '../constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import educationPage from '../pages/education';
import getHelp from '../components/GetFormHelp';
import mainMailingAddressPage from '../pages/mainMailingAddress';
import movingYesNoPage from '../pages/movingYesNo';
import newMailingAddressPage from '../pages/newMailingAddress';
import personalInformationPage from '../pages/personalInformation';
import phoneAndEmailPage from '../pages/phoneAndEmail';
import yearsOfCollegeStudiesPage from '../pages/yearsOfCollegeStudies';
import yearsOfGraduateStudiesPage from '../pages/yearsOfGraduateStudiesPage';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'new-careers-employment-28-1900-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  stepLabels: 'Your Information;Contact Information;Review',
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_28_1900,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your VR&amp;E Chapter 31 benefits application application (28-1900) is in progress.',
    //   expired: 'Your saved VR&amp;E Chapter 31 benefits application application (28-1900) has expired. If you want to apply for VR&amp;E Chapter 31 benefits application, please start a new application.',
    //   saved: 'Your VR&amp;E Chapter 31 benefits application application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for VR&amp;E Chapter 31 benefits application.',
    noAuth:
      'Please sign in again to continue your application for VR&amp;E Chapter 31 benefits application.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  chapters: {
    yourInformationChapter: {
      title: 'Your information',
      pages: {
        personalInformationPage: {
          path: 'personal-information',
          title:
            YOUR_INFORMATION_CHAPTER_CONSTANTS.personalInformationPageTitle,
          uiSchema: personalInformationPage.uiSchema,
          schema: personalInformationPage.schema,
        },
        educationPage: {
          path: 'education',
          title: YOUR_INFORMATION_CHAPTER_CONSTANTS.educationPageTitle,
          uiSchema: educationPage.uiSchema,
          schema: educationPage.schema,
        },
        yearsOfCollegeStudiesPage: {
          depends: formData =>
            formData.yearsOfEducation === 'someOrAllOfCollege',
          path: 'years-of-college-studies',
          title:
            YOUR_INFORMATION_CHAPTER_CONSTANTS.yearsOfCollegeOrGraduateStudiesPageTitle,
          uiSchema: yearsOfCollegeStudiesPage.uiSchema,
          schema: yearsOfCollegeStudiesPage.schema,
        },
        yearsOfGraduateStudiesPage: {
          depends: formData =>
            formData.yearsOfEducation === 'someOrAllOfGraduateSchool',
          path: 'years-of-graduate-studies',
          title:
            YOUR_INFORMATION_CHAPTER_CONSTANTS.yearsOfCollegeOrGraduateStudiesPageTitle,
          uiSchema: yearsOfGraduateStudiesPage.uiSchema,
          schema: yearsOfGraduateStudiesPage.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        mainMailingAddressPage: {
          path: 'main-mailing-address',
          title:
            CONTACT_INFORMATION_CHAPTER_CONSTANTS.mainMailingAddressPageTitle,
          uiSchema: mainMailingAddressPage.uiSchema,
          schema: mainMailingAddressPage.schema,
        },
        movingYesNoPage: {
          path: 'moving-yes-no',
          title: CONTACT_INFORMATION_CHAPTER_CONSTANTS.movingYesNoPageTitle,
          uiSchema: movingYesNoPage.uiSchema,
          schema: movingYesNoPage.schema,
        },
        newMailingAddressPage: {
          path: 'new-mailing-address',
          title:
            CONTACT_INFORMATION_CHAPTER_CONSTANTS.newMailingAddressPageTitle,
          uiSchema: newMailingAddressPage.uiSchema,
          schema: newMailingAddressPage.schema,
        },
        phoneAndEmailPage: {
          path: 'phone-and-email',
          title: CONTACT_INFORMATION_CHAPTER_CONSTANTS.phoneAndEmailPageTitle,
          uiSchema: phoneAndEmailPage.uiSchema,
          schema: phoneAndEmailPage.schema,
        },
      },
    },
  },
  getHelp,
  footerContent,
};

export default formConfig;
