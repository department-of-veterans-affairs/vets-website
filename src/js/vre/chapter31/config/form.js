import _ from 'lodash/fp';

import fullSchema31 from 'vets-json-schema/dist/28-1900-schema.json';

import * as address from '../../../common/schemaform/definitions/address';
import currencyUI from '../../../common/schemaform/definitions/currency';
import phoneUI from '../../../common/schemaform/definitions/phone';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ServicePeriodView from '../../../common/schemaform/components/ServicePeriodView';
import dateRangeUI from '../../../common/schemaform/definitions/dateRange';

import { dischargeTypeLabels, serviceFlagLabels } from '../../utils/labels';
import createVeteranInfoPage from '../../pages/veteranInfo';
import { facilityLocatorLink } from '../helpers';
import { validateMatch } from '../../../common/schemaform/validation';

const {
  serviceFlags,
  daytimePhone,
  email,
  eveningPhone,
  employer,
  jobDuties,
  monthlyIncome,
  vaRecordsOffice
} = fullSchema31.properties;

const {
  date,
  dateRange,
  fullName,
  phone,
  serviceHistory,
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
    dateRange,
    phone,
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
          path: 'military-history',
          title: 'Military History',
          uiSchema: {
            serviceHistory: {
              'ui:options': {
                itemName: 'Service Period',
                viewField: ServicePeriodView,
                hideTitle: true
              },
              items: {
                serviceBranch: {
                  'ui:title': 'Branch of service'
                },
                dateRange: dateRangeUI(
                  'Service start date',
                  'Service end date',
                  'End of service must be after start of service'
                ),
                dischargeType: {
                  'ui:title': 'Character of discharge',
                  'ui:options': {
                    labels: dischargeTypeLabels
                  }
                }
              }
            },
            serviceFlags: {
              'ui:title': 'Did you serve in:',
              'ui:options': {
                showFieldLabel: true
              },
              ww2: {
                'ui:title': serviceFlagLabels.ww2
              },
              postWw2: {
                'ui:title': serviceFlagLabels.postWw2
              },
              korea: {
                'ui:title': serviceFlagLabels.korea
              },
              postKorea: {
                'ui:title': serviceFlagLabels.postKorea
              },
              vietnam: {
                'ui:title': serviceFlagLabels.vietnam
              },
              postVietnam: {
                'ui:title': serviceFlagLabels.postVietnam
              },
              gulf: {
                'ui:title': serviceFlagLabels.gulf
              },
              operationEnduringFreedom: {
                'ui:title': serviceFlagLabels.operationEnduringFreedom
              },
              operationIraqiFreedom: {
                'ui:title': serviceFlagLabels.operationIraqiFreedom
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              serviceHistory,
              serviceFlags
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
        veteranAddress: {
          path: 'veteran-address',
          title: 'Address Information',
          uiSchema: {
            veteranAddress: address.uiSchema(''),
            'view:isMoving': {
              'ui:title': 'Are you moving within the next 30 days?',
              'ui:widget': 'yesNo'
            },
            veteranNewAddress: _.merge(
              address.uiSchema('New address', false, (formData) => formData['view:isMoving']),
              {
                'ui:options': {
                  expandUnder: 'view:isMoving'
                }
              }
            )
          },
          schema: {
            type: 'object',
            required: ['veteranAddress', 'view:isMoving'],
            properties: {
              veteranAddress: address.schema(fullSchema31, true),
              'view:isMoving': {
                type: 'boolean'
              },
              veteranNewAddress: address.schema(fullSchema31)
            }
          }
        },
        contactInformation: {
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: {
            daytimePhone: phoneUI('Daytime phone number'),
            eveningPhone: phoneUI('Evening phone number'),
            email: {
              'ui:title': 'Email address'
            },
            'view:confirmEmail': {
              'ui:title': 'Re-enter email address',
              'ui:options': {
                hideOnReview: true
              }
            },
            'ui:validations': [
              validateMatch('email', 'view:confirmEmail')
            ]
          },
          schema: {
            type: 'object',
            properties: {
              daytimePhone,
              eveningPhone,
              email,
              'view:confirmEmail': email,
            }
          }
        }
      }
    }
  }
};

export default formConfig;
