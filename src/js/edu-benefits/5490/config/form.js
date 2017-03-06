import _ from 'lodash/fp';

import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';
import { transform, benefitsLabels, hoursTypeLabels, highSchoolStatusLabels } from '../helpers';
import { enumToNames } from '../../utils/helpers';

import * as date from '../../../common/schemaform/definitions/date';
import * as dateRange from '../../../common/schemaform/definitions/dateRange';
import * as bankAccount from '../../../common/schemaform/definitions/bankAccount';
import * as address from '../../../common/schemaform/definitions/address';
import * as phone from '../../../common/schemaform/definitions/phone';
import contactInformation from '../../definitions/contactInformation';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  benefit,
  highSchool
} = fullSchema5490.properties;

const {
  secondaryContact
} = fullSchema5490.definitions;

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
    benefitSelection: {
      title: 'Education Benefit',
      pages: {
        benefitSelection: {
          title: 'Education benefit',
          path: 'benefits-eligibility/education-benefit',
          initialData: {},
          uiSchema: {
            benefit: {
              'ui:widget': 'radio',
              'ui:title': 'Select the benefit that is the best match for you:'
            },
            benefitsRelinquishedDate: date.uiSchema('Effective date')
          },
          schema: {
            type: 'object',
            properties: {
              benefit: _.assign(benefit, {
                enumNames: enumToNames(benefit.enum, benefitsLabels)
              }),
              benefitsRelinquishedDate: date.schema
            }
          }
        }
      }
    },
    militaryService: {
      title: 'Military History',
      pages: {}
    },
    educationHistory: {
      title: 'Education History',
      pages: {
        educationHistory: {
          title: 'Education history',
          path: 'education-history',
          initialData: {},
          uiSchema: {
            highSchool: {
              status: {
                'ui:title': 'What is your current high school status?'
              },
              highSchoolOrGedCompletionDate: _.assign(
                date.uiSchema('When did you earn your high school diploma or equivalency certificate?'), {
                  'ui:options': {
                    hideIf: form => {
                      const status = _.get('highSchool.status', form);
                      return status !== 'graduated' && status !== 'ged';
                    }
                  }
                }),
              'view:hasHighSchool': {
                'ui:options': {
                  hideIf: form => {
                    const status = _.get('highSchool.status', form);
                    return status !== 'graduationExpected';
                  }
                },
                name: {
                  'ui:title': 'Name of high school'
                },
                city: {
                  'ui:title': 'City'
                },
                state: {
                  'ui:title': 'State'
                },
                dateRange: dateRange.uiSchema(),
                hours: {
                  'ui:title': 'Hours completed'
                },
                hoursType: {
                  'ui:title': 'Type of hours'
                },
                degreeReceived: {
                  'ui:title': 'Degree, diploma, or certificate received'
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              highSchool: {
                type: 'object',
                properties: {
                  status: _.assign(highSchool.properties.status, {
                    enumNames: enumToNames(
                      highSchool.properties.status.enum,
                      highSchoolStatusLabels
                    )
                  }),
                  highSchoolOrGedCompletionDate: date.schema,
                  'view:hasHighSchool': {
                    type: 'object',
                    properties: {
                      name: highSchool.properties.name,
                      city: highSchool.properties.city,
                      state: highSchool.properties.state,
                      dateRange: dateRange.schema,
                      hours: highSchool.properties.hours,
                      hoursType: _.assign(highSchool.properties.hoursType, {
                        enumNames: enumToNames(
                          highSchool.properties.hoursType.enum,
                          hoursTypeLabels
                        )
                      }),
                      degreeReceived: highSchool.properties.degreeReceived
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {}
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation,
        secondaryContact: {
          title: 'Secondary contact',
          path: 'personal-information/secondary-contact',
          initialData: {},
          uiSchema: {
            'ui:title': 'Secondary contact',
            'ui:description': 'This person should know where you can be reached at all times.',
            secondaryContact: {
              fullName: {
                'ui:title': 'Name'
              },
              phone: phone.uiSchema('Telephone number'),
              sameAddress: {
                'ui:title': 'Address for secondary contact is the same as mine'
              },
              address: _.merge(address.uiSchema(), {
                'ui:options': {
                  hideIf: (form) => _.get('secondaryContact.sameAddress', form) === true
                }
              })
            }
          },
          schema: {
            type: 'object',
            properties: {
              secondaryContact: {
                type: 'object',
                properties: {
                  fullName: secondaryContact.properties.fullName,
                  phone: phone.schema,
                  sameAddress: secondaryContact.properties.sameAddress,
                  address: address.schema(),
                }
              }
            }
          }
        },
        directDeposit: {
          title: 'Direct deposit',
          path: 'personal-information/direct-deposit',
          initialData: {},
          uiSchema: {
            'ui:title': 'Direct deposit',
            bankAccount: bankAccount.uiSchema,
          },
          schema: {
            type: 'object',
            properties: {
              bankAccount: bankAccount.schema
            }
          }
        }
      }
    }
  }
};

export default formConfig;
