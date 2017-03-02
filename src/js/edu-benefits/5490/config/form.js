import { transform } from '../helpers';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const formConfig = {
  urlPrefix: '/5490/',
  submitUrl: '/v0/education_benefits_claims/5490',
  trackingPrefix: 'edu-5490-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Update your Education Benefits',
  subTitle: 'Form 22-5490',
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {}
    },
    veteranInformation: {
      title: 'Veteran Information',
      pages: {}
    },
    benefitSelection: {
      title: 'Education Benefit',
      pages: {}
    },
    militaryService: {
      title: 'Military History',
      pages: {}
    },
    educationHistory: {
      title: 'Education History',
      pages: {}
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {}
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {}
    }
  }
};


export default formConfig;
