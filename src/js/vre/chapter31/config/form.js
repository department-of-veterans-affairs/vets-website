// import _ from 'lodash/fp';

import fullSchema31 from 'vets-json-schema/dist/28-1900-schema.json';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ServicePeriodView from '../../../common/schemaform/components/ServicePeriodView';
import dateRangeUI from '../../../common/schemaform/definitions/dateRange';

import { dischargeTypeLabels, serviceFlagLabels } from '../../utils/labels';
import createVeteranInfoPage from '../../pages/veteranInfo';
import { facilityLocatorLink } from '../helpers';

const {
  vaRecordsOffice,
  serviceFlags
} = fullSchema31.properties;

const {
  fullName,
  serviceHistory,
  date,
  dateRange,
  ssn,
  vaFileNumber
} = fullSchema31.definitions;

const serviceHistoryUI = {
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
};

const serviceFlagsUI = {
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
    fullName,
    date,
    dateRange,
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
            serviceHistory: serviceHistoryUI,
            serviceFlags: serviceFlagsUI
          },
          schema: {
            type: 'object',
            properties: {
              serviceHistory,
              serviceFlags
            }
          }
        },
      }
    },
    workInformation: {
      title: 'Work Information',
      pages: {
        workInformation: {
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
