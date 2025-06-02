import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import environment from 'platform/utilities/environment';
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
import yearsOfGraduateStudiesPage from '../pages/yearsOfGraduateStudies';
import PreSubmit from '../components/PreSubmit';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/veteran_readiness_employment_claims`,
  trackingPrefix: 'new-careers-employment-28-1900-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  stepLabels: 'Your Information;Contact Information;Review',
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  formId: VA_FORM_IDS.FORM_28_1900_V2,
  saveInProgress: {
    messages: {
      inProgress:
        'Your VR&E Chapter 31 benefits application (28-1900) is in progress.',
      expired:
        'Your saved VR&E Chapter 31 benefits application (28-1900) has expired. If you want to apply for Chapter 31 benefits, start a new application.',
      saved: 'Your Chapter 31 benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Start over to apply for Veteran Readiness and Employment.',
    noAuth:
      'Sign in again to continue your application for Vocational Readiness and Employment.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  defaultDefinitions: {},
  preSubmitInfo: {
    field: 'privacyAgreementAccepted',
    CustomComponent: PreSubmit,
    required: true,
    // statementOfTruth: {
    //   body:
    //     'I confirm that the identifying information in this form is accurate has been represented correctly.',
    //   messageAriaDescribedby:
    //     'I confirm that the identifying information in this form is accurate has been represented correctly.',
    //   useProfileFullName: true,
    // },
  },
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
          depends: formData => formData.isMoving,
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
