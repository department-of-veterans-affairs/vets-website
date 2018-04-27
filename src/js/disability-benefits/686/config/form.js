import { createSelector } from 'reselect';
import fullSchema from 'vets-json-schema/dist/21-686C-schema.json';
import merge from '../../../../platform/utilities/data/merge';

import currentOrPastDateUI from '../../../common/schemaform/definitions/currentOrPastDate';
import ssnUI from '../../../common/schemaform/definitions/ssn';
import * as address from '../../../common/schemaform/definitions/address';
import ArrayCountWidget from '../../../common/schemaform/widgets/ArrayCountWidget';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SpouseMarriageTitle from '../components/SpouseMarriageTitle';

import { getSpouseMarriageTitle } from '../helpers';

const {
  spouseDateOfBirth,
  spouseSocialSecurityNumber,
  spouseVaFileNumber,
  liveWithSpouse,
  reasonForNotLivingWithSpouse,
  spouseIsVeteran,
} = fullSchema.properties;

const {
  marriages
} = fullSchema.definitions;

function isMarried(form = {}) {
  return ['Married', 'Separated'].includes(form.maritalStatus);
}

function createSpouseLabelSelector(nameTemplate) {
  return createSelector(form => {
    return (form.marriages && form.marriages.length)
      ? form.marriages[form.marriages.length - 1].spouseFullName
      : null;
  }, spouseFullName => {
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
  },
  chapters: {
    currentSpouseInfo: {
      title: 'Current Spouse’s Information',
      pages: {
        spouseInfo: {
          title: 'Spouse information',
          path: 'household/spouse-info',
          depends: isMarried,
          uiSchema: {
            'ui:title': 'Spouse information',
            spouseDateOfBirth: merge(currentOrPastDateUI(''), {
              'ui:options': {
                updateSchema: createSpouseLabelSelector(spouseName =>
                  `${spouseName.first} ${spouseName.last}’s date of birth`)
              }
            }),
            spouseSocialSecurityNumber: merge(ssnUI, {
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
            spouseAddress: merge(address.uiSchema('Spouse address', false, form => form.liveWithSpouse === false),
              {
                'ui:options': {
                  expandUnder: 'liveWithSpouse',
                  expandUnderCondition: false
                }
              }
            ),
            reasonForNotLivingWithSpouse: {
              'ui:title': 'What is the reason you do not live with your spouse?',
              'ui:required': form => form.liveWithSpouse === false,
              'ui:options': {
                expandUnder: 'liveWithSpouse',
                expandUnderCondition: false
              }
            },
            spouseMarriages: {
              'ui:title': 'How many times has your spouse been married (including current marriage)?',
              'ui:widget': ArrayCountWidget,
              'ui:field': 'StringField',
              'ui:options': {
                showFieldLabel: 'label',
                keepInPageOnReview: true,
                countOffset: -1
              },
              'ui:errorMessages': {
                required: 'You must enter at least 1 marriage'
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
              'spouseMarriages'
            ],
            properties: {
              spouseDateOfBirth,
              spouseSocialSecurityNumber,
              spouseIsVeteran,
              spouseVaFileNumber,
              liveWithSpouse,
              spouseAddress: address.schema(fullSchema),
              reasonForNotLivingWithSpouse,
              spouseMarriages: marriages
            }
          }
        },
        spouseMarriageHistory: {
          title: (form, { pagePerItemIndex }) => getSpouseMarriageTitle(pagePerItemIndex),
          path: 'household/spouse-marriages/:index',
          depends: isMarried,
          showPagePerItem: true,
          arrayPath: 'spouseMarriages',
          uiSchema: {
            spouseMarriages: {
              items: {
                'ui:title': SpouseMarriageTitle,
                spouseFullName: merge(fullNameUI, {
                  first: {
                    'ui:title': 'Their spouse’s first name'
                  },
                  last: {
                    'ui:title': 'Their spouse’s last name'
                  },
                  middle: {
                    'ui:title': 'Their spouse’s middle name'
                  },
                  suffix: {
                    'ui:title': 'Their spouse’s suffix',
                  }
                }),
                dateOfMarriage: merge(currentOrPastDateUI(''), {
                  'ui:options': {
                    updateSchema: createSpouseLabelSelector(spouseName =>
                      `Date of ${spouseName.first} ${spouseName.last}’s marriage`)
                  }
                }),
                locationOfMarriage: {
                  'ui:options': {
                    updateSchema: createSpouseLabelSelector(spouseName =>
                      `Place of ${spouseName.first} ${spouseName.last}’s marriage (city and state or foreign country)`)
                  }
                },
                marriageType: {
                  'ui:title': 'Type of marriage',
                  'ui:widget': 'radio'
                },
                otherExplanation: {
                  'ui:title': 'Please specify',
                  'ui:required': (form, index) => {
                    return _.get(['spouseMarriages', index, 'marriageType'], form) === 'Other';
                  },
                  'ui:options': {
                    expandUnder: 'marriageType',
                    expandUnderCondition: 'Other'
                  }
                },
                'view:marriageWarning': {
                  'ui:description': marriageWarning,
                  'ui:options': {
                    hideIf: (form, index) => _.get(['spouseMarriages', index, 'marriageType'], form) !== 'Common-law'
                  }
                },
                reasonForSeparation: {
                  'ui:title': 'Why did the marriage end?',
                  'ui:widget': 'radio'
                },
                dateOfSeparation: _.assign(currentOrPastDateUI('Date marriage ended'), {
                  'ui:validations': [
                    validateAfterMarriageDate
                  ]
                }),
                locationOfSeparation: {
                  'ui:title': 'Place marriage ended (city and state or foreign country)',
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              spouseMarriages: {
                type: 'array',
                items: {
                  type: 'object',
                  required: [
                    'spouseFullName',
                    'dateOfMarriage',
                    'marriageType',
                    'locationOfMarriage',
                    'reasonForSeparation',
                    'dateOfSeparation',
                    'locationOfSeparation'
                  ],
                  properties: {
                    dateOfMarriage: marriageProperties.dateOfMarriage,
                    locationOfMarriage: marriageProperties.locationOfMarriage,
                    spouseFullName: marriageProperties.spouseFullName,
                    marriageType,
                    otherExplanation: marriageProperties.otherExplanation,
                    'view:marriageWarning': { type: 'object', properties: {} },
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
    }
  }
};

export default formConfig;
