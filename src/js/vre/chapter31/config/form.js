// import _ from 'lodash/fp';

import fullSchema31 from 'vets-json-schema/dist/28-1900-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const {} = fullSchema31.properties;

const {
  fullName
} = fullSchema31.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/vre',
  trackingPrefix: 'vre-chapter-31',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '28-1900',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: '',
    noAuth: ''
  },
  title: '',
  subTitle: 'Form 28-1900',
  defaultDefinitions: {
    fullName
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
        militaryHistoryVeteran: {
          depends: {
            'view:isVeteran': true
          },
          path: 'military-history',
          title: 'Military History',
          uiSchema: {
            // serviceHistory: serviceHistoryUI,
            // serviceFlags: {}
          },
          schema: {
            type: 'object',
            properties: {
              // serviceHistory,
              // serviceFlags
            }
          }
        },
      }
    },
    workInformation: {
      title: 'Work Information',
      pages: {
        veteranInformation: {
          path: 'work-information',
          title: 'Work Information',
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    educationAndVREInformation: {
      title: 'Education and Vocational Rehab Information',
      pages: {
        veteranInformation: {
          path: 'education-vre-information',
          title: 'Education and Vocational Rehab Information',
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    disabilityInformation: {
      title: 'Disability Information',
      pages: {
        veteranInformation: {
          path: 'Disability-information',
          title: 'Disability Information',
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
        contactInformation: {
          path: 'contact-information',
          title: 'Contact Information',
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    }
  }
};

export default formConfig;
