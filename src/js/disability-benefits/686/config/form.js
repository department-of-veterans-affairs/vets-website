import { createSelector } from 'reselect';
import _ from 'lodash/fp';
import moment from 'moment';

import GetFormHelp from '../../components/GetFormHelp.jsx';
import fullSchema686 from 'vets-json-schema/dist/21-686C-schema.json';
import currentOrPastDateUI from '../../../common/schemaform/definitions/currentOrPastDate';
import ssnUI from '../../../common/schemaform/definitions/ssn';
import * as address from '../../../common/schemaform/definitions/address';
import fullNameUI from '../../../common/schemaform/definitions/fullName';
// import fileUploadUI from '../../../common/schemaform/definitions/file';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import SpouseMarriageView from '../components/SpouseMarriageView';
import DependentField from '../components/DependentField';
import createHouseholdMemberTitle from '../components/DisclosureTitle';

import { VAFileNumberDescription, relationshipLabels, dependentsMinItem, schoolAttendanceWarning, disableWarning, childRelationshipStatusLabels } from '../helpers';

import { validateAfterMarriageDate } from '../validation';

// const FIFTY_MB = 52428800;

const {
  spouseDateOfBirth,
  spouseSocialSecurityNumber,
  spouseVaFileNumber,
  liveWithSpouse,
  spouseIsVeteran,
  claimantFullName,
  claimantEmail,
  veteranFullName,
  veteranSocialSecurityNumber,
  dependents
} = fullSchema686.properties;

const {
  marriages,
  fullName,
  ssn,
  date,
  vaFileNumber,
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
function calculateChildAge(form, index) {
  if (form.dependents[index].childDateOfBirth) {
    const childAge = (form.dependents[index].childDateOfBirth);
    return moment().diff(childAge, 'years');
  }
  return null;
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
    address,
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
    },
    unMarriedChildren: {
      title: 'Veteran\'s Unmarried Children',
      pages: {
        dependents: {
          path: 'unmarried-children',
          title: 'Veteran\'s Unmarried Children',
          uiSchema: {
            'view:hasUnmarriedChildren': {
              'ui:widget': 'yesNo',
              'ui:title': 'Do you have unmarried children?',
            },
            dependents: {
              'ui:options': {
                itemName: 'Dependent',
                expandUnder: 'view:hasUnmarriedChildren',
                viewField: DependentField
              },
              'ui:errorMessages': {
                minItems: dependentsMinItem
              },
              items: {
                fullName: fullNameUI,
                childDateOfBirth: currentOrPastDateUI('Child\'s date of birth')
              }
            }
          },
          schema: {
            type: 'object',
            required: ['view:hasUnmarriedChildren'],
            properties: {
              'view:hasUnmarriedChildren': {
                type: 'boolean'
              },
              dependents: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: ['fullName', 'childDateOfBirth'],
                  properties: {
                    fullName: dependents.items.properties.fullName,
                    childDateOfBirth: dependents.items.properties.childDateOfBirth
                  }
                }
              }
            }
          }
        },
        childrenInformation: {
          path: 'unmarried-children/information/:index',
          title: item => `${item.fullName.first || ''} ${item.fullName.last || ''} information`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['childRelationship'],
                  properties: {
                    childSocialSecurityNumber: dependents.items.properties.childSocialSecurityNumber,
                    'view:noSSN': { type: 'boolean' },
                    childRelationship: dependents.items.properties.childRelationship,
                    inSchool: dependents.items.properties.attendingCollege,
                    'view:schoolWarning': {
                      type: 'object',
                      properties: {}
                    },
                    disabled: dependents.items.properties.disabled,
                    'view:disableWarning': {
                      type: 'object',
                      properties: {}
                    },
                    married: dependents.items.properties.previouslyMarried,
                    'view:stepChildCondition': {
                      type: 'boolean',
                    },
                  }
                }
              }
            }
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle('fullName', 'Information'),
                childSocialSecurityNumber: _.merge(ssnUI, {
                  'ui:title': 'Social Security number',
                  'ui:required': (formData, index) => !_.get(`dependents.${index}.view:noSSN`, formData)
                }),
                'view:noSSN': {
                  'ui:title': 'Does not have a Social Security number (foreign national, etc.)'
                },
                childRelationship: {
                  'ui:title': 'Child status (Check all that apply.)',
                  'ui:options': {
                    showFieldLabel: true,
                    labels: childRelationshipStatusLabels
                  },
                  'ui:widget': 'radio',
                },
                inSchool: {
                  'ui:title': '18-23 years old and in school',
                  'ui:options': {
                    hideIf: (form, index) => {
                      const childAge = calculateChildAge(form, index);
                      if (childAge) {
                        return childAge < 18 || childAge > 23;
                      }
                      return true;
                    }
                  }
                },
                'view:schoolWarning': {
                  'ui:description': schoolAttendanceWarning,
                  'ui:options': {
                    expandUnder: 'inSchool'
                  }
                },
                disabled: {
                  'ui:title': 'Seriously Disabled',
                  'ui:options': {
                    hideIf: (form, index) => {
                      const childAge = calculateChildAge(form, index);
                      if (childAge) {
                        return childAge < 18;
                      }
                      return true;
                    }
                  }
                },
                'view:disableWarning': {
                  'ui:description': disableWarning,
                  'ui:options': {
                    expandUnder: 'disabled'
                  }
                },
                married: {
                  'ui:title': 'Child Previously Married'
                },
                'view:stepChildCondition': {
                  'ui:options': {
                    expandUnder: 'childRelationship',
                    expandUnderCondition: (formData) => formData === 'stepchild'
                  },
                  'ui:required': (formData, index) => _.get(`dependents.${index}.childRelationship`, formData) === 'stepchild',
                  'ui:widget': 'yesNo',
                  'ui:title': 'Is your child the biological child of your spouse?',
                },
              }
            }
          }
        },
        childrenAddress: {
          path: 'unmarried-children/address/:index',
          title: item => `${item.fullName.first || ''} ${item.fullName.last || ''} address`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['childInHousehold'],
                  properties: {
                    childInHousehold: dependents.items.properties.childInHousehold,
                    childInfo: {
                      type: 'object',
                      properties: {
                        childAddress: address.schema(fullSchema686),
                        personChildLiveWith: {
                          type: 'object',
                          properties: {
                            firstName: {
                              type: 'string'
                            },
                            lastName: {
                              type: 'string'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle('fullName', 'Address'),
                childInHousehold: {
                  'ui:title': 'Does your child currently live with you?',
                  'ui:widget': 'yesNo'
                },
                childInfo: {
                  'ui:options': {
                    expandUnder: 'childInHousehold',
                    expandUnderCondition: false
                  },
                  childAddress: _.merge(address.uiSchema('Address', false, (form, index) => !_.get(['dependents', index, 'childInHousehold'], form)),
                    {
                      'ui:title': 'Child Address',
                    }),
                  personChildLiveWith: {
                    firstName: {
                      'ui:title': 'First name of person child lives with (if applicable)'
                    },
                    lastName: {
                      'ui:title': 'Last name of person child lives with (if applicable)'
                    }
                  }
                },
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
