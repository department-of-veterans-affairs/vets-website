import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const formConfig = {
  urlPrefix: '/1990e/',
  submitUrl: '/v0/education_benefits_claims/1990e',
  trackingPrefix: 'edu-1990e-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Apply for transferred education benefits',
  subTitle: 'Form 22-1990e',
  chapters: {
    dependentInformation: {
      pages: {
      }
    },
    benefitSelection: {
      pages: {
      }
    },
    educationHistory: {
      pages: {
      }
    },
    employmentHistory: {
      pages: {
      }
    },
    schoolSelection: {
      pages: {
      }
    },
    personalInformation: {
      pages: {
      }
    }
  }
};


export default formConfig;
