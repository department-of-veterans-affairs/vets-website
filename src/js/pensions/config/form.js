import _ from 'lodash/fp';
import moment from 'moment';
import { createSelector } from 'reselect';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import * as address from '../../common/schemaform/definitions/address';
import bankAccountUI from '../../common/schemaform/definitions/bankAccount';
import {
  transform,
  employmentDescription,
  getSpouseMarriageTitle,
  getMarriageTitleWithCurrent,
  spouseContribution,
  fileHelp,
  directDepositWarning,
  isMarried,
  applicantDescription
} from '../helpers';
import { relationshipLabels } from '../labels';
import IntroductionPage from '../components/IntroductionPage';
import DisabilityField from '../components/DisabilityField';
import SpouseMarriageTitle from '../components/SpouseMarriageTitle';
import ConfirmationPage from '../containers/ConfirmationPage';
import FullNameField from '../../common/schemaform/FullNameField';
import DependentField from '../components/DependentField';
import EmploymentField from '../components/EmploymentField';
import createHouseholdMemberTitle from '../components/DisclosureTitle';
import netWorthUI from '../definitions/netWorth';
import monthlyIncomeUI from '../definitions/monthlyIncome';
import expectedIncomeUI from '../definitions/expectedIncome';
import { additionalSourcesSchema } from '../definitions/additionalSources';
import dateUI from '../../common/schemaform/definitions/date';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import phoneUI from '../../common/schemaform/definitions/phone';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import dateRangeUI from '../../common/schemaform/definitions/dateRange';
import ArrayCountWidget from '../../common/schemaform/widgets/ArrayCountWidget';
import ssnUI from '../../common/schemaform/definitions/ssn';
import fileUploadUI from '../../common/schemaform/definitions/file';
import createNonRequiredFullName from '../../common/schemaform/definitions/nonRequiredFullName';
import otherExpensesUI from '../definitions/otherExpenses';
import GetFormHelp from '../../common/schemaform/GetPensionOrBurialFormHelp';

const {
  nationalGuardActivation,
  nationalGuard,
  disabilities,
  previousNames,
  combatSince911,
  jobs,
  placeOfSeparation,
  powDateRange,
  severancePay,
  spouseDateOfBirth,
  spouseSocialSecurityNumber,
  spouseVaFileNumber,
  liveWithSpouse,
  reasonForNotLivingWithSpouse,
  spouseIsVeteran,
  monthlySpousePayment,
  dependents,
  email,
  altEmail,
  dayPhone,
  nightPhone,
  mobilePhone,
  veteranFullName,
  veteranDateOfBirth,
  veteranSocialSecurityNumber
} = fullSchemaPensions.properties;

const {
  fullName,
  usaPhone,
  dateRange,
  date,
  monthlyIncome,
  netWorth,
  maritalStatus,
  marriages,
  expectedIncome,
  ssn,
  vaFileNumber,
  files,
  otherExpenses,
  bankAccount
} = fullSchemaPensions.definitions;

const nonRequiredFullName = createNonRequiredFullName(fullName);

function isUnder65(formData) {
  return moment().startOf('day').subtract(65, 'years').isBefore(formData.veteranDateOfBirth);
}

function isBetween18And23(childDOB) {
  return moment(childDOB).isBetween(moment().startOf('day').subtract(23, 'years'), moment().startOf('day').subtract(18, 'years'));
}

function isCurrentMarriage(form, index) {
  const numMarriages = form && form.marriages ? form.marriages.length : 0;
  return isMarried(form) && numMarriages - 1 === index;
}

function isChild(item) {
  return item.dependentRelationship === 'child';
}

function setupDirectDeposit(form) {
  return _.get('view:bankAccountChange', form) === 'start';
}

const marriageProperties = marriages.items.properties;

const marriageType = _.assign(marriageProperties.marriageType, {
  'enum': [
    'Ceremonial',
    'Common-law',
    'Proxy',
    'Tribal',
    'Other'
  ]
});

const reasonForSeparation = _.assign(marriageProperties.reasonForSeparation, {
  'enum': [
    'Widowed',
    'Divorced'
  ]
});

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
  submitUrl: '/v0/pension_claims',
  trackingPrefix: 'pensions-527EZ-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '21P-527EZ',
  version: 0,
  savedFormMessages: {
    notFound: 'Please start over to apply for pension benefits.',
    noAuth: 'Please sign in again to resume your application for pension benefits.'
  },
  title: 'Apply for pension',
  subTitle: 'Form 21-527EZ',
  getHelp: GetFormHelp,
  defaultDefinitions: {
    address: address.schema(fullSchemaPensions),
    additionalSources: additionalSourcesSchema(fullSchemaPensions),
    date,
    dateRange,
    usaPhone,
    fullName,
    ssn,
    vaFileNumber,
    monthlyIncome,
    expectedIncome,
    netWorth
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant/information',
          title: 'Applicant information',
          uiSchema: {
            'ui:description': applicantDescription,
            veteranFullName: fullNameUI,
            veteranSocialSecurityNumber: _.assign(ssnUI, {
              'ui:title': 'Social Security number (must have this or a VA file number)',
              'ui:required': form => !form.vaFileNumber,
            }),
            vaFileNumber: {
              'ui:title': 'VA file number (must have this or a Social Security number)',
              'ui:required': form => !form.veteranSocialSecurityNumber,
              'ui:options': {
                widgetClassNames: 'usa-input-medium'
              },
              'ui:errorMessages': {
                pattern: 'File number must be 8 digits'
              }
            },
            veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
            'ui:options': {
              showPrefillMessage: true
            }
          },
          schema: {
            type: 'object',
            required: ['veteranFullName', 'veteranDateOfBirth'],
            properties: {
              veteranFullName,
              veteranSocialSecurityNumber,
              vaFileNumber,
              veteranDateOfBirth
            }
          }
        }
      }
    },
    militaryHistory: {
      title: 'Military History',
      pages: {
        general: {
          path: 'military/history',
          title: 'General history',
          uiSchema: {
            'ui:title': 'General history',
            previousNames: {
              'ui:options': {
                expandUnder: 'view:serveUnderOtherNames',
                viewField: FullNameField,
                reviewTitle: 'Previous names'
              },
              items: fullNameUI
            },
            'view:serveUnderOtherNames': {
              'ui:title': 'Did you serve under another name?',
              'ui:widget': 'yesNo'
            },
            activeServiceDateRange: dateRangeUI(
              'Date entered active service',
              'Date left active service',
              'Date entered service must be before date left service'
            ),
            placeOfSeparation: {
              'ui:title': 'Place of last or anticipated separation'
            },
            combatSince911: (() => {
              const rangeExcludes911 = createSelector(
                _.get('activeServiceDateRange.to'),
                (to) => {
                  const isFullDate = /^\d{4}-\d{2}-\d{2}$/;

                  return !isFullDate.test(to) || !moment('2001-09-11').isBefore(to);
                }
              );

              return {
                'ui:title': 'Did you serve in a combat zone after 9/11/2001?',
                'ui:widget': 'yesNo',
                'ui:required': formData => !rangeExcludes911(formData),
                'ui:options': {
                  hideIf: rangeExcludes911
                }
              };
            })()
          },
          schema: {
            type: 'object',
            required: ['activeServiceDateRange', 'view:serveUnderOtherNames'],
            properties: {
              'view:serveUnderOtherNames': {
                type: 'boolean'
              },
              previousNames: _.assign(previousNames, {
                minItems: 1
              }),
              activeServiceDateRange: _.assign(dateRange, {
                required: ['from', 'to']
              }),
              placeOfSeparation,
              combatSince911
            }
          }
        },
        reserveAndNationalGuard: {
          path: 'military/reserve-national-guard',
          title: 'Reserve and National Guard',
          uiSchema: {
            'ui:title': 'Reserve and National Guard',
            nationalGuardActivation: {
              'ui:title': 'Are you currently on federal active duty in the National Guard?',
              'ui:widget': 'yesNo'
            },
            nationalGuard: {
              'ui:options': {
                expandUnder: 'nationalGuardActivation',
              },
              name: {
                'ui:title': 'Name of Reserve/National Guard unit',
              },
              address: address.uiSchema('Unit address'),
              phone: phoneUI('Unit phone number'),
              date: dateUI('Service Activation Date')
            }
          },
          schema: {
            type: 'object',
            required: ['nationalGuardActivation'],
            properties: {
              nationalGuardActivation,
              nationalGuard: _.set('properties.address', address.schema(fullSchemaPensions), nationalGuard)
            }
          }
        },
        powAndSeverance: {
          path: 'military/pow-severance',
          title: 'POW Status & Severance Pay',
          uiSchema: {
            'ui:title': 'POW Status & Severance Pay',
            'ui:order': ['view:powStatus', 'powDateRange', 'view:receivedSeverancePay', 'severancePay'],
            'view:powStatus': {
              'ui:title': 'Have you ever been a POW?',
              'ui:widget': 'yesNo'
            },
            powDateRange: _.set('ui:options.expandUnder', 'view:powStatus', dateRangeUI(
                  'Start of confinement',
                  'End of confinement',
                  'Confinement start date must be before end date'
            )),
            'view:receivedSeverancePay': {
              'ui:title': 'Have you received any type of severance or separation pay?',
              'ui:widget': 'yesNo'
            },
            severancePay: {
              'ui:order': [
                'type',
                'amount'
              ],
              'ui:options': {
                expandUnder: 'view:receivedSeverancePay'
              },
              amount: {
                'ui:title': 'Amount',
                'ui:options': {
                  classNames: 'schemaform-currency-input'
                }
              },
              type: {
                'ui:title': 'Pay Type',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: {
                    PDRL: 'Permanent Disability Retirement List (PDRL)',
                    TDRL: 'Temporary Disability Retirement List (TDRL)'
                  }
                }
              }
            }
          },
          schema: {
            type: 'object',
            required: ['view:powStatus', 'view:receivedSeverancePay'],
            properties: {
              'view:powStatus': {
                type: 'boolean'
              },
              powDateRange,
              'view:receivedSeverancePay': {
                type: 'boolean'
              },
              severancePay
            }
          }
        }
      }
    },
    workHistory: {
      title: 'Work history',
      pages: {
        disabilityHistory: {
          title: 'Disability history',
          path: 'disability/history',
          depends: isUnder65,
          uiSchema: {
            disabilities: {
              'ui:title': 'What Disabilities prevent you from working?',
              'ui:order': ['name', 'disabilityStartDate'],
              'ui:options': {
                viewField: DisabilityField,
                reviewTitle: 'Disability history'
              },
              items: {
                name: {
                  'ui:title': 'Disability'
                },
                disabilityStartDate: dateUI('Date disability began')
              }
            },
            hasVisitedVAMC: {
              'ui:title': 'Have you been treated at a VA medical center for the above disability?',
              'ui:widget': 'yesNo'
            }
          },
          schema: {
            type: 'object',
            required: ['disabilities', 'hasVisitedVAMC'],
            properties: {
              disabilities: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: ['name', 'disabilityStartDate'],
                  properties: disabilities.items.properties
                }
              },
              hasVisitedVAMC: {
                type: 'boolean'
              }
            }
          }
        },
        employmentHistory: {
          title: 'Employment history',
          path: 'employment/history',
          depends: isUnder65,
          uiSchema: {
            'view:workedBeforeDisabled': {
              'ui:title': 'Have you worked between now and one year before you became to disabled to continue?',
              'ui:widget': 'yesNo'
            },
            'view:history': {
              'ui:options': {
                expandUnder: 'view:workedBeforeDisabled'
              },
              'ui:description': employmentDescription,
              jobs: {
                'ui:options': {
                  viewField: EmploymentField
                },
                items: {
                  employer: {
                    'ui:title': 'Name of employer'
                  },
                  address: address.uiSchema('Address of employer'),
                  jobTitle: {
                    'ui:title': 'Job title'
                  },
                  dateRange: dateRangeUI(),
                  daysMissed: {
                    'ui:title': 'How many days lost to disability'
                  },
                  annualEarnings: {
                    'ui:title': 'Total annual earnings',
                    'ui:options': {
                      classNames: 'schemaform-currency-input'
                    }
                  }
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:workedBeforeDisabled': { type: 'boolean' },
              'view:history': {
                type: 'object',
                properties: {
                  jobs: {
                    type: 'array',
                    minItems: 1,
                    items: {
                      type: 'object',
                      required: ['address', 'employer', 'jobTitle', 'dateRange', 'daysMissed', 'annualEarnings'],
                      properties: _.assign(jobs.items.properties, {
                        address: address.schema(fullSchemaPensions, true),
                        dateRange: _.set('required', ['to', 'from'], dateRange)
                      })
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    householdInformation: {
      title: 'Household Information',
      pages: {
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
                showFieldLabel: true,
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
                  'ui:title': 'Place of marriage'
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
                    'ui:required': (...args) => !isCurrentMarriage(...args)
                  }),
                  locationOfSeparation: {
                    'ui:title': 'Place marriage ended',
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
        spouseInfo: {
          title: 'Spouse information',
          path: 'household/spouse-info',
          depends: isMarried,
          uiSchema: {
            'ui:title': 'Spouse information',
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
                pattern: 'File number must be 8 digits'
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
            reasonForNotLivingWithSpouse: {
              'ui:title': 'What is the reason you do not live with your spouse?',
              'ui:required': form => form.liveWithSpouse === false,
              'ui:options': {
                expandUnder: 'liveWithSpouse',
                expandUnderCondition: false
              }
            },
            monthlySpousePayment: {
              'ui:title': spouseContribution,
              'ui:required': form => form.liveWithSpouse === false,
              'ui:options': {
                classNames: 'schemaform-currency-input',
                expandUnder: 'liveWithSpouse',
                expandUnderCondition: false
              }
            },
            'view:spousePreviousMarried': {
              'ui:title': 'Has your spouse been married before?',
              'ui:widget': 'yesNo'
            },
            spouseMarriages: {
              'ui:title': 'How many times has your spouse been married before? (Not including current marriage)',
              'ui:widget': ArrayCountWidget,
              'ui:field': 'StringField',
              'ui:required': form => !!form['view:spousePreviousMarried'],
              'ui:options': {
                showFieldLabel: true,
                keepInPageOnReview: true,
                expandUnder: 'view:spousePreviousMarried',
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
              'view:spousePreviousMarried',
              'spouseIsVeteran',
              'liveWithSpouse'
            ],
            properties: {
              spouseDateOfBirth,
              spouseSocialSecurityNumber,
              spouseIsVeteran,
              spouseVaFileNumber,
              liveWithSpouse,
              spouseAddress: address.schema(fullSchemaPensions),
              reasonForNotLivingWithSpouse,
              monthlySpousePayment,
              'view:spousePreviousMarried': {
                type: 'boolean'
              },
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
                spouseFullName: _.merge(fullNameUI, {
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
                dateOfMarriage: _.merge(currentOrPastDateUI(''), {
                  'ui:options': {
                    updateSchema: createSpouseLabelSelector(spouseName =>
                      `Date of ${spouseName.first} ${spouseName.last}’s marriage`)
                  }
                }),
                locationOfMarriage: {
                  'ui:options': {
                    updateSchema: createSpouseLabelSelector(spouseName =>
                      `Place of ${spouseName.first} ${spouseName.last}’s marriage`)
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
                reasonForSeparation: {
                  'ui:title': 'Why did the marriage end?',
                  'ui:widget': 'radio'
                },
                dateOfSeparation: currentOrPastDateUI('Date marriage ended'),
                locationOfSeparation: {
                  'ui:title': 'Place marriage ended',
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
                    reasonForSeparation,
                    dateOfSeparation: marriageProperties.dateOfSeparation,
                    locationOfSeparation: marriageProperties.locationOfSeparation
                  }
                }
              }
            }
          }
        },
        dependents: {
          title: 'Dependents',
          path: 'household/dependents',
          uiSchema: {
            'ui:title': 'Dependents',
            'view:hasDependents': {
              'ui:title': 'Do you have any child or parent dependents?',
              'ui:widget': 'yesNo'
            },
            dependents: {
              'ui:options': {
                expandUnder: 'view:hasDependents',
                viewField: DependentField
              },
              items: {
                dependentRelationship: {
                  'ui:title': 'Relationship to Veteran',
                  'ui:widget': 'radio',
                  'ui:options': {
                    labels: relationshipLabels
                  }
                },
                fullName: _.merge(fullNameUI, {
                  'ui:options': {
                    expandUnder: 'dependentRelationship',
                    expandUnderCondition: () => true
                  }
                }),
                childDateOfBirth: _.assign(currentOrPastDateUI('Date of birth'), {
                  'ui:required': (form, index) => form.dependents[index].dependentRelationship === 'child',
                  'ui:options': {
                    expandUnder: 'dependentRelationship',
                    expandUnderCondition: 'child'
                  }
                }),
              }
            }
          },
          schema: {
            type: 'object',
            required: ['view:hasDependents'],
            properties: {
              'view:hasDependents': {
                type: 'boolean'
              },
              dependents: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: ['dependentRelationship', 'fullName'],
                  properties: {
                    dependentRelationship: dependents.items.properties.dependentRelationship,
                    fullName: dependents.items.properties.fullName,
                    childDateOfBirth: dependents.items.properties.childDateOfBirth,
                  }
                }
              }
            }
          }
        },
        childrenInformation: {
          path: 'household/dependents/children/information/:index',
          title: item => `${item.fullName.first || ''} ${item.fullName.last || ''} information`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          itemFilter: (item) => isChild(item),
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['childPlaceOfBirth', 'childSocialSecurityNumber', 'childRelationship', 'disabled', 'previouslyMarried'],
                  properties: {
                    childPlaceOfBirth: dependents.items.properties.childPlaceOfBirth,
                    childSocialSecurityNumber: dependents.items.properties.childSocialSecurityNumber,
                    childRelationship: dependents.items.properties.childRelationship,
                    attendingCollege: dependents.items.properties.attendingCollege,
                    disabled: dependents.items.properties.disabled,
                    previouslyMarried: dependents.items.properties.previouslyMarried,
                    married: dependents.items.properties.married,
                  }
                }
              }
            }
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle('fullName', 'Information'),
                childPlaceOfBirth: {
                  'ui:title': 'Place of Birth'
                },
                childSocialSecurityNumber: _.merge(ssnUI, {
                  'ui:title': 'Social Security number'
                }),
                childRelationship: {
                  'ui:title': 'Relationship',
                  'ui:widget': 'radio',
                  'ui:options': {
                    labels: {
                      biological: 'Biological child',
                      adopted: 'Adopted child',
                      stepchild: 'Stepchild'
                    }
                  }
                },
                attendingCollege: {
                  'ui:title': 'Is your child in school?',
                  'ui:widget': 'yesNo',
                  'ui:required': (form, index) => isBetween18And23(_.get(['dependents', index, 'childDateOfBirth'], form)),
                  'ui:options': {
                    hideIf: (form, index) => !isBetween18And23(_.get(['dependents', index, 'childDateOfBirth'], form)),
                  }
                },
                disabled: {
                  'ui:title': 'Is your child seriously disabled?',
                  'ui:widget': 'yesNo',
                },
                previouslyMarried: {
                  'ui:title': 'Has your child ever been married?',
                  'ui:widget': 'yesNo',
                },
                married: {
                  'ui:title': 'Are they currently married?',
                  'ui:widget': 'yesNo',
                  'ui:required': (form, index) => !!_.get(['dependents', index, 'previouslyMarried'], form),
                  'ui:options': {
                    expandUnder: 'previouslyMarried'
                  }
                }
              }
            }
          }
        },
        childrenAddress: {
          path: 'household/dependents/children/address/:index',
          title: item => `${item.fullName.first || ''} ${item.fullName.last || ''} address`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          itemFilter: (item) => isChild(item),
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
                    childAddress: dependents.items.properties.childAddress,
                    personWhoLivesWithChild: dependents.items.properties.personWhoLivesWithChild,
                    monthlyPayment: dependents.items.properties.monthlyPayment
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
                  'ui:title': 'Does your child live with you?',
                  'ui:widget': 'yesNo'
                },
                childAddress: _.merge(address.uiSchema('Address', false, (form, index) => !_.get(['dependents', index, 'childInHousehold'], form)),
                  {
                    'ui:options': {
                      expandUnder: 'childInHousehold',
                      expandUnderCondition: false
                    }
                  }
                ),
                personWhoLivesWithChild: _.merge(fullNameUI,
                  {
                    'ui:title': 'Who do they live with?',
                    'ui:options': {
                      updateSchema: (form, UISchema, schema, index) => {
                        if (!_.get(['dependents', index, 'childInHousehold'], form)) {
                          return fullName;
                        }
                        return nonRequiredFullName;
                      },
                      expandUnder: 'childInHousehold',
                      expandUnderCondition: false
                    }
                  }
                ),
                monthlyPayment: {
                  'ui:title': 'How much do you contribute per month to their support?',
                  'ui:required': (form, index) => !_.get(['dependents', index, 'childInHousehold'], form),
                  'ui:options': {
                    classNames: 'schemaform-currency-input',
                    expandUnder: 'childInHousehold',
                    expandUnderCondition: false
                  }
                }
              }
            }
          }
        }
      }
    },
    financialDisclosure: {
      title: 'Financial Disclosure',
      pages: {
        netWorth: {
          path: 'financial-disclosure/net-worth',
          title: item => `${item.veteranFullName.first} ${item.veteranFullName.last} net worth`,
          schema: {
            type: 'object',
            required: ['netWorth'],
            properties: {
              netWorth
            }
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('veteranFullName', 'Net worth'),
            'ui:description': 'Bank accounts, investments, and property',
            netWorth: netWorthUI
          }
        },
        monthlyIncome: {
          path: 'financial-disclosure/monthly-income',
          title: item => `${item.veteranFullName.first} ${item.veteranFullName.last} monthly income`,
          initialData: {
          },
          schema: {
            type: 'object',
            required: ['monthlyIncome'],
            properties: {
              monthlyIncome
            }
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('veteranFullName', 'Monthly income'),
            'ui:description': 'Social Security or other pensions',
            monthlyIncome: monthlyIncomeUI
          }
        },
        expectedIncome: {
          path: 'financial-disclosure/expected-income',
          title: item => `${item.veteranFullName.first} ${item.veteranFullName.last} expected income`,
          initialData: {
          },
          schema: {
            type: 'object',
            required: ['expectedIncome'],
            properties: {
              expectedIncome
            }
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('veteranFullName', 'Expected income'),
            'ui:description': 'Any income you expect to receive in the next 12 months',
            expectedIncome: expectedIncomeUI
          }
        },
        otherExpenses: {
          path: 'financial-disclosure/other-expenses',
          title: item => `${item.veteranFullName.first} ${item.veteranFullName.last} expenses`,
          schema: {
            type: 'object',
            properties: {
              otherExpenses
            }
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('veteranFullName', 'Medical, legal, or other unreimbursed expenses'),
            otherExpenses: otherExpensesUI
          }
        },
        spouseNetWorth: {
          path: 'financial-disclosure/net-worth/spouse',
          title: 'Spouse net worth',
          depends: isMarried,
          initialData: {
          },
          schema: {
            type: 'object',
            properties: {
              spouseNetWorth: netWorth
            }
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('spouse', 'Net worth'),
            'ui:description': 'Bank accounts, investments, and property',
            spouseNetWorth: netWorthUI
          }
        },
        spouseMonthlyIncome: {
          path: 'financial-disclosure/monthly-income/spouse',
          title: 'Spouse monthly income',
          depends: isMarried,
          initialData: {
          },
          schema: {
            type: 'object',
            properties: {
              spouseMonthlyIncome: monthlyIncome
            }
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('spouse', 'Monthly income'),
            'ui:description': 'Social Security or other pensions',
            spouseMonthlyIncome: monthlyIncomeUI
          }
        },
        spouseExpectedIncome: {
          path: 'financial-disclosure/expected-income/spouse',
          title: 'Spouse expected income',
          depends: isMarried,
          initialData: {
          },
          schema: {
            type: 'object',
            properties: {
              spouseExpectedIncome: expectedIncome
            }
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('spouse', 'Expected income'),
            'ui:description': 'Any income you expect your spouse to receive in the next 12 months',
            spouseExpectedIncome: expectedIncomeUI
          }
        },
        spouseOtherExpenses: {
          path: 'financial-disclosure/other-expenses/spouse',
          depends: isMarried,
          title: 'Spouse other expenses',
          schema: {
            type: 'object',
            properties: {
              spouseOtherExpenses: otherExpenses
            }
          },
          uiSchema: {
            'ui:title': createHouseholdMemberTitle('spouse', 'Medical, legal, or other unreimbursed expenses'),
            spouseOtherExpenses: otherExpensesUI
          }
        },
        dependentsNetWorth: {
          path: 'financial-disclosure/net-worth/dependents/:index',
          title: item => `${item.fullName.first || ''} ${item.fullName.last || ''} net worth`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    netWorth
                  }
                }
              }
            }
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle('fullName', 'Net worth'),
                'ui:description': 'Bank accounts, investments, and property',
                netWorth: netWorthUI
              }
            }
          }
        },
        dependentsMonthlyIncome: {
          path: 'financial-disclosure/monthly-income/dependents/:index',
          title: item => `${item.fullName.first || ''} ${item.fullName.last || ''} monthly income`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          initialData: {
          },
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    monthlyIncome
                  }
                }
              }
            }
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle('fullName', 'Monthly income'),
                'ui:description': 'Social Security or other pensions',
                monthlyIncome: monthlyIncomeUI
              }
            }
          }
        },
        dependentsExpectedIncome: {
          path: 'financial-disclosure/expected-income/dependents/:index',
          title: item => `${item.fullName.first || ''} ${item.fullName.last || ''} expected income`,
          showPagePerItem: true,
          arrayPath: 'dependents',
          initialData: {
          },
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    expectedIncome
                  }
                }
              }
            }
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle('fullName', 'Expected income'),
                'ui:description': 'Any income you expect this dependent to receive in the next 12 months',
                expectedIncome: expectedIncomeUI
              }
            }
          }
        },
        dependentsOtherExpenses: {
          path: 'financial-disclosure/other-expenses/dependents/:index',
          showPagePerItem: true,
          arrayPath: 'dependents',
          title: item => `${item.fullName.first || ''} ${item.fullName.last || ''} expenses`,
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    otherExpenses
                  }
                }
              }
            }
          },
          uiSchema: {
            dependents: {
              items: {
                'ui:title': createHouseholdMemberTitle('fullName', 'Medical, legal, or other unreimbursed expenses'),
                otherExpenses: otherExpensesUI
              }
            }
          }
        }
      }
    },
    additionalInformation: {
      title: 'Additional Information',
      pages: {
        directDeposit: {
          title: 'Direct deposit',
          path: 'personal-information/direct-deposit',
          initialData: {},
          uiSchema: {
            'ui:title': 'Direct deposit',
            'view:bankAccountChange': {
              'ui:title': 'Benefit payment method',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  start: 'Setup direct deposit',
                  'continue': 'I already have direct deposit working',
                  stop: 'Don’t use direct deposit'
                }
              }
            },
            bankAccount: _.merge(bankAccountUI, {
              'ui:order': [
                'accountType',
                'bankName',
                'accountNumber',
                'routingNumber'
              ],
              'ui:options': {
                expandUnder: 'view:bankAccountChange',
                expandUnderCondition: 'start'
              },
              bankName: {
                'ui:title': 'Bank name'
              },
              accountType: {
                'ui:required': setupDirectDeposit
              },
              accountNumber: {
                'ui:required': setupDirectDeposit
              },
              routingNumber: {
                'ui:required': setupDirectDeposit
              }
            }),
            'view:stopWarning': {
              'ui:description': directDepositWarning,
              'ui:options': {
                hideIf: (formData) => formData['view:bankAccountChange'] !== 'stop'
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:bankAccountChange': {
                type: 'string',
                'enum': [
                  'start',
                  'continue',
                  'stop'
                ]
              },
              bankAccount,
              'view:stopWarning': {
                type: 'object',
                properties: {}
              }
            }
          }
        },
        contactInformation: {
          title: 'Contact information',
          path: 'additional-information/contact',
          uiSchema: {
            'ui:title': 'Contact information',
            veteranAddress: address.uiSchema('Mailing address'),
            email: {
              'ui:title': 'Primary email'
            },
            altEmail: {
              'ui:title': 'Secondary email'
            },
            dayPhone: phoneUI('Daytime phone'),
            nightPhone: phoneUI('Evening phone'),
            mobilePhone: phoneUI('Mobile phone'),
          },
          schema: {
            type: 'object',
            required: ['veteranAddress'],
            properties: {
              veteranAddress: address.schema(fullSchemaPensions, true),
              email,
              altEmail,
              dayPhone,
              nightPhone,
              mobilePhone
            }
          }
        }
      }
    },
    documentUpload: {
      title: 'Document Upload',
      pages: {
        documentUpload: {
          title: 'Document upload',
          path: 'documents',
          editModeOnReviewPage: true,
          uiSchema: {
            'ui:description': fileHelp,
            files: fileUploadUI('Please upload any documentation that you need to support your claim', {
              fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
            })
          },
          schema: {
            type: 'object',
            properties: {
              files
            }
          }
        }
      }
    },
  }
};

export default formConfig;
