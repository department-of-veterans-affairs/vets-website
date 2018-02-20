import _ from 'lodash/fp';

import fullSchema36 from 'vets-json-schema/dist/28-8832-schema.json';

import {
  genderLabels
} from '../../../common/utils/labels.jsx';

import { dischargeTypeLabels } from '../../utils/labels';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import ServicePeriodView from '../../../common/schemaform/components/ServicePeriodView';
import dateRangeUI from '../../../common/schemaform/definitions/dateRange';
import currentOrPastDateUI from '../../../common/schemaform/definitions/currentOrPastDate';
import fullNameUI from '../../../common/schemaform/definitions/fullName';
import ssnUI from '../../../common/schemaform/definitions/ssn';

const {
  applicantFullName,
  applicantGender,
  applicantSocialSecurityNumber,
  seekingRestorativeTraining,
  seekingVocationalTraining,
  receivedPamphlet,
  veteranDateOfBirth,
  veteranDateOfDeathMIAPOW,
  veteranFullName,
  veteranSocialSecurityNumber,
  veteranVaFileNumber
} = fullSchema36.properties;

const {
  date,
  fullName,
  gender,
  ssn,
  vaFileNumber,
  dateRange,
  serviceHistory
} = fullSchema36.definitions;

const requiredDateRange = _.merge(dateRange, {
  required: ['to', 'from']
});

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

const applicantServiceHistory = _.merge(serviceHistory, {
  minItems: 1,
  items: {
    required: ['serviceBranch', 'dateRange', 'dischargeType'],
    properties: {
      dateRange: {
        $ref: '#/definitions/requiredDateRange'
      }
    }
  }
});

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/vre',
  trackingPrefix: 'vre-chapter-36',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '28-8832',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for vocational counseling.',
    noAuth: 'Please sign in again to resume your application for vocational counseling.'
  },
  title: 'Apply for vocational counseling',
  subTitle: 'Form 28-8832',
  defaultDefinitions: {
    date,
    fullName,
    gender,
    ssn,
    vaFileNumber,
    dateRange,
    requiredDateRange
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          title: 'Applicant information',
          path: 'applicant-information',
          applicantRelationshipToVeteran: 'Spouse',
          uiSchema: {
            'view:isVeteran': {
              'ui:title': 'Are you a Servicemember or Veteran applying for counseling service?',
              'ui:widget': 'yesNo'
            },
            applicantFullName: _.merge(fullNameUI, {
              first: {
                'ui:required': formData => formData['view:isVeteran'] === false,
              },
              last: {
                'ui:required': formData => formData['view:isVeteran'] === false,
              },
              'ui:options': {
                expandUnder: 'view:isVeteran',
                expandUnderCondition: false
              }
            }),
            applicantRelationshipToVeteran: {
              'ui:title': 'What is your relationship to the Servicemember or Veteran?',
              'ui:widget': 'radio',
              'ui:required': formData => formData['view:isVeteran'] === false,
              'ui:options': {
                expandUnder: 'view:isVeteran',
                expandUnderCondition: false
              }
            }
          },
          schema: {
            type: 'object',
            required: ['view:isVeteran'],
            properties: {
              'view:isVeteran': {
                type: 'boolean'
              },
              applicantFullName: _.unset('required', applicantFullName),
              applicantRelationshipToVeteran: {
                type: 'string',
                'enum': [
                  'Spouse',
                  'Surviving spouse',
                  'Child',
                  'Stepchild',
                  'Adopted child'
                ]
              }
            }
          }
        },
        dependentInformation: {
          title: 'Applicant information',
          path: 'dependent-information',
          depends: {
            'view:isVeteran': false
          },
          uiSchema: {
            applicantSocialSecurityNumber: ssnUI,
            applicantGender: {
              'ui:title': 'Gender',
              'ui:widget': 'radio',
              'ui:options': {
                labels: genderLabels
              }
            },
            seekingRestorativeTraining: {
              'ui:title': 'Are you a child who is at least 14 years old, a spouse, or a surviving spouse with a disability and looking for special restorative training?',
              'ui:widget': 'yesNo'
            },
            seekingVocationalTraining: {
              'ui:title': 'Are you a child, a spouse, or a surviving spouse with a disability and looking for special vocational training',
              'ui:widget': 'yesNo'
            },
            receivedPamphlet: {
              'ui:title': 'Have you received a pamphlet explaining survivors’ and dependents’ educational assistance benefits?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            properties: {
              applicantSocialSecurityNumber,
              applicantGender,
              seekingRestorativeTraining,
              seekingVocationalTraining,
              receivedPamphlet
            }
          }
        }
      }
    },
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          title: 'Veteran Inforation',
          path: 'veteran-information',
          uiSchema: {
            veteranFullName: fullNameUI,
            veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
            veteranSocialSecurityNumber: _.assign(ssnUI, {
              'ui:title': 'Social Security number (must have this or a VA file number)',
              'ui:required': form => !form.veteranVaFileNumber,
            }),
            veteranVaFileNumber: {
              'ui:title': 'VA file number (must have this or a Social Security number)',
              'ui:required': form => !form.veteranSocialSecurityNumber,
              'ui:errorMessages': {
                pattern: 'Your VA file number must be between 7 to 9 digits'
              }
            },
            veteranDateOfDeathMIAPOW: _.merge(
              currentOrPastDateUI('Date of Veteran’s death or date listed as missing in action or POW'),
              {
                'ui:options': {
                  hideIf: (formData) => formData['view:isVeteran'] === true,
                }
              }
            )
          },
          schema: {
            type: 'object',
            required: ['veteranDateOfBirth'],
            properties: {
              veteranFullName,
              veteranDateOfBirth,
              veteranSocialSecurityNumber,
              veteranVaFileNumber,
              veteranDateOfDeathMIAPOW
            }
          }
        }
      }
    },
    additionalInformation: {
      title: 'Additional Information',
      pages: {
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
            veteranServiceHistory: serviceHistoryUI
          },
          schema: {
            type: 'object',
            properties: {
              veteranServiceHistory: applicantServiceHistory
            }
          }
        },
        militaryHistory: {
          depends: (formData) => !formData['view:isVeteran'],
          path: 'military-history-applicant',
          title: 'Military History',
          uiSchema: {
            'view:hasMilitaryHistory': {
              'ui:title': 'Have you served on active duty in the Armed Forces? (This can include active duty for training for 3 months or more, or subsequent periods of active duty for training of 6 months or more.)',
              'ui:widget': 'yesNo'
            },
            applicantServiceHistory: _.merge(serviceHistoryUI, {
              'ui:options': {
                expandUnder: 'view:hasMilitaryHistory'
              }
            })
          },
          schema: {
            type: 'object',
            required: ['view:hasMilitaryHistory'],
            properties: {
              'view:hasMilitaryHistory': {
                type: 'boolean'
              },
              applicantServiceHistory
            }
          }
        }
      }
    },
    contactInformation: {
      title: 'Contact Information',
      pages: {
      }
    }
  }
};


export default formConfig;
