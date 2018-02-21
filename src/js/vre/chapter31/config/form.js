import _ from 'lodash/fp';

import fullSchema31 from 'vets-json-schema/dist/28-1900-schema.json';

import * as address from '../../../common/schemaform/definitions/address';
import currencyUI from '../../../common/schemaform/definitions/currency';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  employer,
  employerAddress,
  jobDuties,
  monthlyIncome
} = fullSchema31.properties;

const {
  fullName
} = fullSchema31.definitions;

const expandIfWorking = {
  'ui:options': {
    expandUnder: 'view:isWorking',
  }
}

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
    address,
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
        veteranInformation: {
          path: 'military-information',
          title: 'Military Information',
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    workInformation: {
      title: 'Work Information',
      pages: {
        workInformation: {
          path: 'work-information',
          title: 'Work Information',
          uiSchema: {
            'view:isWorking': {
              'ui:title': 'Are you working?',
              'ui:widget': 'yesNo'
            },
            employer: {
              'ui:title': 'Employer name',
              ...expandIfWorking
            },
            monthlyIncome: _.merge(
              currencyUI('Monthly pay'),
              expandIfWorking
            ),
            employerAddress: _.merge(
              address.uiSchema('Employer address'),
              expandIfWorking
            )
          },
          schema: {
            type: 'object',
            required: ['view:isWorking'],
            properties: {
              'view:isWorking': {
                type: 'boolean'
              },
              employer,
              monthlyIncome,
              employerAddress: address.schema(fullSchema31)
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
