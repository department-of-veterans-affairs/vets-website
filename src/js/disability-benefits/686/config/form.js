import { createSelector } from 'reselect';
import fullSchema686 from 'vets-json-schema/dist/21-686C-schema.json';
import _ from 'lodash/fp';

import currentOrPastDateUI from '../../../common/schemaform/definitions/currentOrPastDate';
import ssnUI from '../../../common/schemaform/definitions/ssn';
import * as address from '../../../common/schemaform/definitions/address';
import fullNameUI from '../../../common/schemaform/definitions/fullName';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SpouseMarriageView from '../components/SpouseMarriageView';
import { VAFileNumberDescription, relationshipLabels } from '../helpers';

import { validateAfterMarriageDate } from '../validation';

const {
  spouseDateOfBirth,
  spouseSocialSecurityNumber,
  spouseVaFileNumber,
  liveWithSpouse,
  spouseIsVeteran,
  claimantFullName,
  claimantEmail,
  veteranFullName,
  veteranSocialSecurityNumber
} = fullSchema686.properties;

const {
  marriages,
  fullName,
  ssn,
  date,
  vaFileNumber
} = fullSchema686.definitions;

function isMarried(form = {}) {
  return ['Married', 'Separated'].includes(form.maritalStatus);
}

const spouseSelector = createSelector(form => {
  return (form.marriages && form.marriages.length)
    ? form.marriages[0].spouseFullName
    : null;
}, spouse => spouse);

function createSpouseLabelSelector(nameTemplate) {
  return createSelector(spouseSelector, spouseFullName => {
    if (spouseFullName) {
      return {
        title: nameTemplate(spouseFullName)
      };
    }

    return {
      title: null
    };
  });
}

const marriageProperties = marriages.items.properties;

const reasonForSeparation = _.assign(marriageProperties.reasonForSeparation, {
  'enum': [
    'Widowed',
    'Divorced'
  ]
});

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: '686-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21-686C',
  version: 0,
  prefillEnabled: false,
  savedFormMessages: {
    notFound: 'Please start over to apply for declaration of status of dependents.',
    noAuth: 'Please sign in again to continue your application for declaration of status of dependents.'
  },
  title: 'Declaration of status of dependents',
  defaultDefinitions: {
    marriages,
    fullName,
    ssn,
    date,
    vaFileNumber
  },
  chapters: {
    veteranInformation: {
      title: 'Veteran Information',
      pages: {
        veteranInformation: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: {
            veteranFullName: fullNameUI,
            veteranSSN: _.merge(ssnUI, {
              'ui:required': form => !form.veteranVAfileNumber
            }),
            veteranVAfileNumber: {
              'ui:title': 'VA file number (must have this or a Social Security number)',
              'ui:required': form => !form.veteranSSN,
              'ui:help': VAFileNumberDescription,
              'ui:errorMessages': {
                pattern: 'Your VA file number must be between 7 to 9 digits'
              }
            },
            'view:relationship': {
              'ui:title': 'Relationship to Veteran',
              'ui:widget': 'radio',
              'ui:options': {
                labels: relationshipLabels
              }
            },
            'view:applicantInfo': {
              'ui:title': 'Applicant Information',
              claimantFullName: _.merge(fullNameUI, {
                first: {
                  'ui:required': (formData) => formData['view:relationship'] !== 'veteran'
                },
                last: {
                  'ui:required': (formData) => formData['view:relationship'] !== 'veteran'
                }
              }),
              ssn: _.assign(ssnUI, {
                'ui:required': (formData) => formData['view:relationship'] !== 'veteran'
              }),
              address: address.uiSchema('', false, (formData) => {
                return formData['view:relationship'] !== 'veteran';
              }),
              claimantEmail: {
                'ui:title': 'Email address',
                'ui:required': (formData) => formData['view:relationship'] !== 'veteran'
              },
              'ui:options': {
                expandUnder: 'view:relationship',
                expandUnderCondition: (field) => field === 'spouse' || field === 'child' || field === 'other'
              }
            },
          },
          schema: {
            type: 'object',
            required: ['view:relationship'],
            properties: {
              veteranFullName,
              veteranSSN: veteranSocialSecurityNumber,
              veteranVAfileNumber: vaFileNumber,
              'view:relationship': {
                type: 'string',
                'enum': [
                  'veteran',
                  'spouse',
                  'child',
                  'other'
                ]
              },
              'view:applicantInfo': {
                type: 'object',
                properties: {
                  claimantFullName,
                  ssn,
                  address: address.schema(fullSchema686),
                  claimantEmail
                }
              },
            }
          },
        }
      }
    },
    currentSpouseInfo: {
      title: 'Current Spouse’s Information',
      pages: {
        spouseInfo: {
          title: 'Spouse information',
          path: 'spouse-info',
          depends: isMarried,
          uiSchema: {
            spouseDateOfBirth: _.merge(currentOrPastDateUI(''), {
              'ui:options': {
                updateSchema: createSpouseLabelSelector(spouseName =>
                  `${spouseName.first} ${spouseName.last}’s date of birth`)
              }
            }),
            spouseSocialSecurityNumber: _.merge(ssnUI, {
              'ui:title': '',
              'ui:options': {
                updateSchema: createSpouseLabelSelector(spouseName =>
                  `${spouseName.first} ${spouseName.last}’s Social Security number`)
              }
            }),
            spouseIsVeteran: {
              'ui:widget': 'yesNo',
              'ui:options': {
                updateSchema: createSpouseLabelSelector(spouseName =>
                  `Is ${spouseName.first} ${spouseName.last} also a Veteran?`)
              }
            },
            spouseVaFileNumber: {
              'ui:title': 'What is their VA file number?',
              'ui:options': {
                expandUnder: 'spouseIsVeteran'
              },
              'ui:errorMessages': {
                pattern: 'Your VA file number must be between 7 to 9 digits'
              }
            },
            liveWithSpouse: {
              'ui:widget': 'yesNo',
              'ui:options': {
                updateSchema: createSpouseLabelSelector(spouseName =>
                  `Do you live with ${spouseName.first} ${spouseName.last}?`)
              }
            },
            spouseAddress: _.merge(address.uiSchema('Spouse address', false, form => form.liveWithSpouse === false),
              {
                'ui:options': {
                  expandUnder: 'liveWithSpouse',
                  expandUnderCondition: false
                }
              }
            ),
            'view:spouseMarriedBefore': {
              'ui:widget': 'yesNo',
              'ui:options': {
                updateSchema: createSpouseLabelSelector(spouseName =>
                  `Has ${spouseName.first} ${spouseName.last} been married before?`)
              }
            }
          },
          schema: {
            type: 'object',
            required: [
              'spouseDateOfBirth',
              'spouseSocialSecurityNumber',
              'spouseIsVeteran',
              'liveWithSpouse',
              'view:spouseMarriedBefore'
            ],
            properties: {
              spouseDateOfBirth,
              spouseSocialSecurityNumber,
              spouseIsVeteran,
              spouseVaFileNumber,
              liveWithSpouse,
              spouseAddress: address.schema(fullSchema686),
              'view:spouseMarriedBefore': {
                type: 'boolean'
              }
            }
          }
        },
        spouseMarriageHistory: {
          title: 'Spouse marriage history',
          path: 'spouse-info/marriages',
          depends: (formData) => isMarried(formData) && formData['view:spouseMarriedBefore'],
          uiSchema: {
            spouseMarriages: {
              'ui:description': 'Please provide details about your spouse or surviving spouse’s previous marriages.',
              'ui:options': {
                itemName: 'Spouse Marriage',
                viewField: SpouseMarriageView,
                reviewTitle: 'Spouse Marriages'
              },
              items: {
                dateOfMarriage: _.merge(currentOrPastDateUI(''), {
                  'ui:options': {
                    updateSchema: createSpouseLabelSelector(spouseName =>
                      `When did ${spouseName.first} ${spouseName.last} get married?`)
                  }
                }),
                locationOfMarriage: {
                  'ui:options': {
                    updateSchema: createSpouseLabelSelector(spouseName =>
                      `Where did ${spouseName.first} ${spouseName.last} get married? (city and state or foreign country)`)
                  }
                },
                spouseFullName: _.merge(fullNameUI, {
                  first: {
                    'ui:title': '',
                    'ui:options': {
                      updateSchema: createSpouseLabelSelector(spouseName =>
                        `First name of ${spouseName.first} ${spouseName.last}’s former spouse`)
                    }
                  },
                  middle: {
                    'ui:title': '',
                    'ui:options': {
                      updateSchema: createSpouseLabelSelector(spouseName =>
                        `Middle name of ${spouseName.first} ${spouseName.last}’s former spouse`)
                    }
                  },
                  last: {
                    'ui:title': '',
                    'ui:options': {
                      updateSchema: createSpouseLabelSelector(spouseName =>
                        `Last name of ${spouseName.first} ${spouseName.last}’s former spouse`)
                    }
                  }
                }),
                dateOfSeparation: _.assign(currentOrPastDateUI('When did this marriage end?'), {
                  'ui:validations': [
                    validateAfterMarriageDate
                  ]
                }),
                locationOfSeparation: {
                  'ui:title': 'Where did this marriage end? (city and state or foreign country)',
                },
                reasonForSeparation: {
                  'ui:title': 'How did this marriage end?',
                  'ui:widget': 'radio'
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              spouseMarriages: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: [
                    'spouseFullName',
                    'dateOfMarriage',
                    'locationOfMarriage',
                    'reasonForSeparation',
                    'dateOfSeparation',
                    'locationOfSeparation'
                  ],
                  properties: {
                    dateOfMarriage: marriageProperties.dateOfMarriage,
                    locationOfMarriage: marriageProperties.locationOfMarriage,
                    spouseFullName: marriageProperties.spouseFullName,
                    dateOfSeparation: marriageProperties.dateOfSeparation,
                    locationOfSeparation: marriageProperties.locationOfSeparation,
                    reasonForSeparation
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
