// import _ from 'lodash/fp';

import fullSchema31 from 'vets-json-schema/dist/28-1900-schema.json';

import * as address from '../../../common/schemaform/definitions/address';
import currencyUI from '../../../common/schemaform/definitions/currency';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import createVeteranInfoPage from '../../pages/veteranInfo';
import { facilityLocatorLink } from '../helpers';

const {
  disabilityRating,
  employer,
  jobDuties,
  monthlyIncome,
  vaRecordsOffice
} = fullSchema31.properties;

const {
  fullName,
  date,
  ssn,
  vaFileNumber
} = fullSchema31.definitions;

const expandIfWorking = {
  'ui:options': {
    expandUnder: 'view:isWorking',
  }
};

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
  title: 'Apply for Vocational Rehabilitation',
  subTitle: 'Form 28-1900',
  defaultDefinitions: {
    address,
    date,
    fullName,
    ssn,
    vaFileNumber,
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: createVeteranInfoPage(fullSchema31, {
          uiSchema: {
            vaRecordsOffice: {
              'ui:title': 'VA benefit office where your records are located',
              'ui:help': facilityLocatorLink
            }
          },
          schema: {
            vaRecordsOffice
          }
        })
      }
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
        militaryHistory: {
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
              'ui:required': (formData) => formData['view:isWorking'],
              ...expandIfWorking
            },
            jobDuties: {
              'ui:title': 'Job duties',
              ...expandIfWorking
            },
            monthlyIncome: {
              ...currencyUI('Monthly pay'),
              ...expandIfWorking
            },
            employerAddress: {
              ...address.uiSchema('Employer address'),
              ...expandIfWorking
            }
          },
          schema: {
            type: 'object',
            required: ['view:isWorking'],
            properties: {
              'view:isWorking': {
                type: 'boolean'
              },
              employer,
              jobDuties,
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
        educationAndVREInformation: {
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
        disabilityInformation: {
          path: 'Disability-information',
          title: 'Disability Information',
          uiSchema: {
            type: 'object',
            disabilityRating: {
              'ui:title': 'Disability rating'
            },
            disabilities: {
              'ui:title': 'Please describe disability or disabilities:',
            },
            vaRecordsOffice: {
              'ui:title': 'VA office where your disability records are located',
              'ui:help': facilityLocatorLink
            },
            'view:inHospital': {
              'ui:title': 'Are you currently in the hospital?',
              'ui:widget': 'yesNo'
            },
            hospital: {
              hospitalName: {
                'ui:title': 'Hospital name',
                'ui:options': {
                  expandUnder: 'view:inHospital'
                }
              },
              hospitalAddress: address.uiSchema('Hospital address'),
              'ui:options': {
                expandUnder: 'view:inHospital'
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilityRating,
              disabilities: {
                type: 'string'
              },
              vaRecordsOffice,
              'view:inHospital': {
                type: 'boolean'
              },
              hospital: {
                type: 'object',
                properties: {
                  hospitalName: {
                    type: 'string'
                  },
                  hospitalAddress: address.schema(fullSchema31)
                }
              }
            }
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
};

export default formConfig;
