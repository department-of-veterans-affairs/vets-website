import _ from 'lodash/fp';
import moment from 'moment';

import fullSchema1990 from 'vets-json-schema/dist/22-1990-schema.json';

import applicantInformation from '../../../common/schemaform/pages/applicantInformation';

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
  benefitsRelinquishedDate
} = fullSchema1990.properties;

const {
  date
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
    date
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
                'ui:required': () => true,
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
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        },
        militaryService: {
          title: 'Military service',
          path: 'military-history/military-service',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
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
          },
          schema: {
            type: 'object',
            properties: {
            }
          }
        }
      }
    },
    employmentHistory: {
      title: 'Employment History',
      pages: {
        employmentHistory: {
          title: 'Employment history',
          // There's only one page in this chapter (right?), so this url seems a
          //  bit heavy-handed.
          path: 'employment-history/employment-information',
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
