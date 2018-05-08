import { createSelector } from 'reselect';
import _ from 'lodash/fp';

import ArrayCountWidget from '../../common/schemaform/widgets/ArrayCountWidget';
import GetFormHelp from '../../components/GetFormHelp.jsx';
import fullSchema686 from 'vets-json-schema/dist/21-686C-schema.json';
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
  getHelp: GetFormHelp,
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
    marriageInfo: {
      title: 'Marriage history',
      path: 'household/marriage-info',
      uiSchema: {
        maritalStatus: {
          'ui:title': 'What’s your marital status?',
          'ui:widget': 'radio'
        },
        marriages: {
          'ui:title': 'How many times have you been married?',
          'ui:widget': ArrayCountWidget,
          'ui:field': 'StringField',
          'ui:required': (form) => !!_.get('maritalStatus', form)
          && form.maritalStatus !== 'Never Married',
          'ui:options': {
            showFieldLabel: 'label',
            keepInPageOnReview: true,
            expandUnder: 'maritalStatus',
            expandUnderCondition: (status) => !!status
            && status !== 'Never Married'
          },
          'ui:errorMessages': {
            required: 'You must enter at least 1 marriage'
          }
        }
      },
      schema: {
        type: 'object',
        required: ['maritalStatus'],
        properties: {
          maritalStatus,
          marriages
        }
      }
    },
    marriageHistory: {
      title: (form, { pagePerItemIndex }) => getMarriageTitleWithCurrent(form, pagePerItemIndex),
      path: 'household/marriages/:index',
      showPagePerItem: true,
      arrayPath: 'marriages',
      uiSchema: {
        marriages: {
          items: {
            'ui:options': {
              updateSchema: (form, schema, uiSchema, index) => {
                return {
                  title: getMarriageTitleWithCurrent(form, index)
                };
              }
            },
            spouseFullName: _.merge(fullNameUI, {
              first: {
                'ui:title': 'Spouse first name'
              },
              last: {
                'ui:title': 'Spouse last name'
              },
              middle: {
                'ui:title': 'Spouse middle name'
              },
              suffix: {
                'ui:title': 'Spouse suffix',
              }
            }),
            dateOfMarriage: currentOrPastDateUI('Date of marriage'),
            locationOfMarriage: {
              'ui:title': 'Place of marriage (city and state or foreign country)'
            },
            marriageType: {
              'ui:title': 'Type of marriage',
              'ui:widget': 'radio'
            },
            otherExplanation: {
              'ui:title': 'Please specify',
              'ui:required': (form, index) => {
                return _.get(['marriages', index, 'marriageType'], form) === 'Other';
              },
              'ui:options': {
                expandUnder: 'marriageType',
                expandUnderCondition: 'Other'
              }
            },
            'view:marriageWarning': {
              'ui:description': marriageWarning,
              'ui:options': {
                hideIf: (form, index) => _.get(['marriages', index, 'marriageType'], form) !== 'Common-law'
              }
            },
            'view:pastMarriage': {
              'ui:options': {
                hideIf: isCurrentMarriage
              },
              reasonForSeparation: {
                'ui:title': 'How did marriage end?',
                'ui:widget': 'radio',
                'ui:required': (...args) => !isCurrentMarriage(...args)
              },
              dateOfSeparation: _.assign(currentOrPastDateUI('Date marriage ended'), {
                'ui:required': (...args) => !isCurrentMarriage(...args),
                'ui:validations': [
                  validateAfterMarriageDate
                ]
              }),
              locationOfSeparation: {
                'ui:title': 'Place marriage ended (city and state or foreign country)',
                'ui:required': (...args) => !isCurrentMarriage(...args)
              }
            }
          }
        }
      },
      schema: {
        type: 'object',
        properties: {
          marriages: {
            type: 'array',
            items: {
              type: 'object',
              required: [
                'spouseFullName',
                'dateOfMarriage',
                'locationOfMarriage',
                'marriageType'
              ],
              properties: {
                spouseFullName: marriageProperties.spouseFullName,
                dateOfMarriage: marriageProperties.dateOfMarriage,
                locationOfMarriage: marriageProperties.locationOfMarriage,
                marriageType,
                otherExplanation: marriageProperties.otherExplanation,
                'view:marriageWarning': { type: 'object', properties: {} },
                'view:pastMarriage': {
                  type: 'object',
                  properties: {
                    reasonForSeparation,
                    dateOfSeparation: marriageProperties.dateOfSeparation,
                    locationOfSeparation: marriageProperties.locationOfSeparation
                  }
                }
              }
            }
          }
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
