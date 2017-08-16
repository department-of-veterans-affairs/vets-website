import _ from 'lodash/fp';
import moment from 'moment';

import fullSchema1990 from 'vets-json-schema/dist/22-1990-schema.json';

import applicantInformation from '../../../common/schemaform/pages/applicantInformation';
import employmentHistoryPage from '../../pages/employmentHistory';

import postHighSchoolTrainingsUI from '../../definitions/postHighSchoolTrainings';
import currentOrPastDateUI from '../../../common/schemaform/definitions/currentOrPastDate';
import yearUI from '../../../common/schemaform/definitions/year';
import * as toursOfDuty from '../../definitions/toursOfDuty';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import BenefitsRelinquishmentField from '../BenefitsRelinquishmentField';

import { validateBooleanGroup } from '../../../common/schemaform/validation';
import dateUI from '../../../common/schemaform/definitions/date';

import {
  transform,
  benefitsEligibilityBox,
  benefitsRelinquishmentWarning,
  benefitsRelinquishmentLabels,
  benefitsRelinquishedDescription
} from '../helpers';

import {
  benefitsLabels
} from '../../utils/labels';

const {
  chapter33,
  chapter30,
  chapter1606,
  chapter32,
  benefitsRelinquished,
  benefitsRelinquishedDate,
  faaFlightCertificatesInformation,
  highSchoolOrGedCompletionDate,
  serviceAcademyGraduationYear
} = fullSchema1990.properties;


const {
  postHighSchoolTrainings,
  date,
  dateRange,
  year,
  currentlyActiveDuty
} = fullSchema1990.definitions;

const formConfig = {
  urlPrefix: '/1990-rjsf/',
  submitUrl: '/v0/education_benefits_claims/1990',
  trackingPrefix: 'edu-',
  formId: '1990',
  version: 0,
  disableSave: true,
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {
    date,
    dateRange,
    year
  },
  title: 'Apply for education benefits',
  subTitle: 'Form 22-1990',
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: _.merge(applicantInformation(fullSchema1990, {
          isVeteran: true,
          fields: [
            'veteranFullName',
            'veteranSocialSecurityNumber',
            'veteranDateOfBirth',
            'gender'
          ],
          required: [
            'veteranFullName',
            'veteranSocialSecurityNumber',
            'veteranDateOfBirth',
          ]
        }), {
          uiSchema: {
            veteranDateOfBirth: {
              'ui:validations': [
                (errors, dob) => {
                  // If we have a complete date, check to make sure it's a valid dob
                  if (/\d{4}-\d{2}-\d{2}/.test(dob) && moment(dob).isAfter(moment().endOf('day').subtract(17, 'years'))) {
                    errors.addError('You must be at least 17 to apply');
                  }
                }
              ]
            }
          }
        })
      }
    },
    benefitsEligibility: {
      title: 'Benefits Eligibility',
      pages: {
        benefitsEligibility: {
          title: 'Benefits eligibility',
          path: 'benefits-eligibility/benefits-selection',
          uiSchema: {
            'ui:description': benefitsEligibilityBox,
            'view:selectedBenefits': {
              'ui:title': 'Select the benefit that is the best match for you.',
              'ui:validations': [
                validateBooleanGroup
              ],
              'ui:errorMessages': {
                atLeastOne: 'Please select at least one benefit'
              },
              'ui:options': {
                showFieldLabel: true
              },
              chapter33: {
                'ui:title': benefitsLabels.chapter33,
                'ui:options': {
                  expandUnderClassNames: 'schemaform-expandUnder-indent',
                }
              },
              'view:chapter33ExpandedContent': {
                'ui:description': 'When you choose to apply for your Post-9/11 benefit, you have to relinquish (give up) 1 other benefit you may be eligible for. You’ll make this decision on the next page.',
                'ui:options': {
                  expandUnder: 'chapter33',
                }
              },
              chapter30: {
                'ui:title': benefitsLabels.chapter30
              },
              chapter1606: {
                'ui:title': benefitsLabels.chapter1606
              },
              chapter32: {
                'ui:title': benefitsLabels.chapter32
              }
            }
          },
          schema: {
            type: 'object',
            required: ['view:selectedBenefits'],
            properties: {
              'view:selectedBenefits': {
                type: 'object',
                properties: {
                  chapter33,
                  'view:chapter33ExpandedContent': {
                    type: 'object',
                    properties: {}
                  },
                  chapter30,
                  chapter1606,
                  chapter32
                }
              }
            }
          }
        },
        benefitsRelinquishment: {
          title: 'Benefits relinquishment',
          path: 'benefits-eligibility/benefits-relinquishment',
          depends: (formData) => formData['view:selectedBenefits'].chapter33,
          initialData: {
            'view:benefitsRelinquishedContainer': {
              benefitsRelinquishedDate: moment().format('YYYY-MM-DD')
            }
          },
          uiSchema: {
            'ui:title': 'Benefits relinquishment',
            'ui:description': benefitsRelinquishmentWarning,
            'view:benefitsRelinquishedContainer': {
              'ui:field': BenefitsRelinquishmentField,
              benefitsRelinquished: {
                'ui:title': 'I choose to give up:',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: benefitsRelinquishmentLabels,
                }
              },
              benefitsRelinquishedDate: _.merge(dateUI('Effective date'), {
                'ui:required': (formData) => _.get('view:benefitsRelinquishedContainer.benefitsRelinquished', formData) !== 'unknown'
              })
            },
            'view:questionText': {
              'ui:description': benefitsRelinquishedDescription
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:benefitsRelinquishedContainer': {
                type: 'object',
                required: ['benefitsRelinquished'],
                properties: {
                  benefitsRelinquished,
                  benefitsRelinquishedDate
                }
              },
              'view:questionText': {
                type: 'object',
                properties: {}
              }
            }
          }
        }
      }
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
        servicePeriods: {
          title: 'Service periods',
          path: 'military-history/service-periods',
          uiSchema: {
            'ui:title': 'Service periods',
            toursOfDuty: _.merge(toursOfDuty.uiSchema, {
              'ui:title': null,
              'ui:description': 'Please record all your periods of service.'
            })
          },
          schema: {
            type: 'object',
            properties: {
              toursOfDuty: toursOfDuty.schema(fullSchema1990, {
                required: ['serviceBranch', 'dateRange.from'],
                fields: ['serviceBranch', 'serviceStatus', 'dateRange', 'applyPeriodToSelected', 'benefitsToApplyTo', 'view:disclaimer']
              })
            }
          }
        },
        militaryService: {
          title: 'Military service',
          path: 'military-history/military-service',
          uiSchema: {
            serviceAcademyGraduationYear: _.assign(yearUI, {
              'ui:title': 'If you received a commission from a military service academy, what year did you graduate?'
            }),
            currentlyActiveDuty: {
              yes: {
                'ui:title': 'Are you on active duty now?',
                'ui:widget': 'yesNo'
              },
              onTerminalLeave: {
                'ui:title': 'Are you on terminal leave now?',
                'ui:widget': 'yesNo',
                'ui:options': {
                  expandUnder: 'yes'
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              serviceAcademyGraduationYear,
              currentlyActiveDuty: {
                type: 'object',
                properties: {
                  yes: currentlyActiveDuty.properties.yes,
                  onTerminalLeave: currentlyActiveDuty.properties.onTerminalLeave
                }
              }
            }
          }
        },
        rotcHistory: {
          title: 'ROTC history',
          path: 'military-history/rotc-history',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        contributions: {
          title: 'Contributions',
          path: 'military-history/contributions',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    educationHistory: {
      title: 'Education History',
      pages: {
        educationHistory: {
          title: 'Education history',
          // There's only one page in this chapter (right?), so this url seems a
          //  bit heavy-handed.
          path: 'education-history/education-information',
          uiSchema: {
            highSchoolOrGedCompletionDate: currentOrPastDateUI('When did you earn your high school diploma or equivalency certificate?'),
            postHighSchoolTrainings: postHighSchoolTrainingsUI,
            faaFlightCertificatesInformation: {
              'ui:title': 'If you have any FAA flight certificates, please list them here.',
              'ui:widget': 'textarea'
            }
          },
          schema: {
            type: 'object',
            properties: {
              highSchoolOrGedCompletionDate,
              postHighSchoolTrainings,
              faaFlightCertificatesInformation
            }
          }
        }
      }
    },
    employmentHistory: {
      title: 'Employment History',
      pages: {
        employmentHistory: _.merge(employmentHistoryPage(fullSchema1990), {
          path: 'employment-history/employment-information'
        })
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        schoolSelection: {
          title: 'School selection',
          // There's only one page in this chapter (right?), so this url seems a
          //  bit heavy-handed.
          path: 'school-selection/school-information',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation: {
          title: 'Contact information',
          path: 'personal-information/contact-information',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        secondaryContact: {
          title: 'Secondary contact',
          path: 'personal-information/secondary-contact',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        dependents: {
          title: 'Dependent information',
          path: 'personal-information/dependents',
          depends: {
            // hasServiceBefore1978
          },
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        directDeposit: {
          title: 'Direct deposit',
          path: 'personal-information/direct-deposit',
          uiSchema: {
          },
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
