import _ from 'lodash/fp';
import moment from 'moment';
import { createSelector } from 'reselect';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import * as address from '../../common/schemaform/definitions/address';
import applicantInformation from '../../common/schemaform/pages/applicantInformation';
import { transform, employmentDescription, getMarriageTitle, spouseContribution } from '../helpers';
import IntroductionPage from '../components/IntroductionPage';
import DisabilityField from '../components/DisabilityField';
import MarriageTitle from '../components/MarriageTitle';
import ConfirmationPage from '../containers/ConfirmationPage';
import FullNameField from '../components/FullNameField';
import EmploymentField from '../components/EmploymentField';
import createDisclosureTitle from '../components/DisclosureTitle';
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
  monthlySpousePayment
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
  vaFileNumber
} = fullSchemaPensions.definitions;

function isUnder65(formData) {
  return moment().startOf('day').subtract(65, 'years').isBefore(formData.veteranDateOfBirth);
}

function isMarried(form) {
  return form.maritalStatus === 'Married';
}

function isCurrentMarriage(form, index) {
  const status = form ? form.maritalStatus : undefined;
  const numMarriages = form && form.marriages ? form.marriages.length : 0;
  return status === 'Married' && numMarriages - 1 === index;
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
  urlPrefix: '/527EZ/',
  submitUrl: '/v0/pensions_applications',
  trackingPrefix: 'pensions',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  disableSave: true,
  title: 'Apply for pension',
  subTitle: 'Form 21-527EZ',
  defaultDefinitions: {
    additionalSources: additionalSourcesSchema(fullSchemaPensions),
    date,
    dateRange,
    usaPhone,
    fullName,
    ssn,
    vaFileNumber
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: applicantInformation(fullSchemaPensions, {
          fields: [
            'veteranFullName',
            'veteranSocialSecurityNumber',
            'view:noSSN',
            'vaFileNumber',
            'veteranDateOfBirth'
          ],
          required: [
            'veteranFullName',
            'veteranDateOfBirth'
          ],
          isVeteran: true
        }),
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
                viewField: FullNameField
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
                'ui:title': 'Name of Reserve/NG unit',
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
                'ui:title': 'Amount'
              },
              type: {
                'ui:title': 'Pay Type',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: {
                    Longevity: 'Longevity',
                    PDRL: 'PDRL',
                    Separation: 'Separation',
                    Severance: 'Severance',
                    TDRL: 'TDRL'
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
                viewField: DisabilityField
              },
              items: {
                name: {
                  'ui:title': 'Disability'
                },
                disabilityStartDate: dateUI('Date disability began')
              }
            },
            // TODO: update schema with this field if stakeholders approve
            hasVisitedVAMC: {
              'ui:title': 'Have you been treated at a VA Medical Center for the above disability?',
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
                  'ui:title': 'Total annual earnings'
                }
              }
            }
          },
          schema: {
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
    },
    householdInformation: {
      title: 'Household Information',
      pages: {
        marriageInfo: {
          title: 'Marriage history',
          path: 'household/marriage-info',
          uiSchema: {
            maritalStatus: {
              'ui:title': 'Have you ever been married?',
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
          title: (form, { pagePerItemIndex }) => getMarriageTitle(pagePerItemIndex),
          path: 'household/marriages/:index',
          showPagePerItem: true,
          arrayPath: 'marriages',
          uiSchema: {
            marriages: {
              items: {
                'ui:title': MarriageTitle,
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
              'ui:title': 'What is their File Number?',
              'ui:options': {
                expandUnder: 'spouseIsVeteran'
              },
              'ui:required': form => form.spouseIsVeteran === true,
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
          title: (form, { pagePerItemIndex }) => getMarriageTitle(pagePerItemIndex),
          path: 'household/spouse-marriages/:index',
          depends: isMarried,
          showPagePerItem: true,
          arrayPath: 'spouseMarriages',
          uiSchema: {
            spouseMarriages: {
              items: {
                'ui:title': MarriageTitle,
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
                    'reasonForSeparation'
                  ],
                  properties: {
                    dateOfMarriage: marriageProperties.dateOfMarriage,
                    locationOfMarriage: marriageProperties.locationOfMarriage,
                    spouseFullName: marriageProperties.spouseFullName,
                    marriageType,
                    otherExplanation: marriageProperties.otherExplanation,
                    reasonForSeparation
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
          initialData: {
            spouseFullName: {
              first: 'Rick',
              last: 'Test'
            }
          },
          schema: {
            type: 'object',
            required: ['netWorth'],
            properties: {
              netWorth
            }
          },
          uiSchema: {
            'ui:title': createDisclosureTitle('veteranFullName', 'Net worth'),
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
            'ui:title': createDisclosureTitle('veteranFullName', 'Monthly income'),
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
            'ui:title': createDisclosureTitle('veteranFullName', 'Expected income'),
            'ui:description': 'Any income you expect to receive in the next 12 months',
            expectedIncome: expectedIncomeUI
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
            'ui:title': createDisclosureTitle('spouseFullName', 'Net worth'),
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
            'ui:title': createDisclosureTitle('spouseFullName', 'Monthly income'),
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
            'ui:title': createDisclosureTitle('spouseFullName', 'Expected income'),
            'ui:description': 'Any income you expect your spouse to receive in the next 12 months',
            spouseExpectedIncome: expectedIncomeUI
          }
        },
        dependentsNetWorth: {
          path: 'financial-disclosure/net-worth/dependents/:index',
          title: item => `${item.childFullName.first} ${item.childFullName.last} net worth`,
          showPagePerItem: true,
          arrayPath: 'children',
          itemFilter: (item) => !item.childNotInHousehold,
          initialData: {
            children: [
              {
                childFullName: {
                  first: 'First',
                  last: 'Child'
                }
              },
              {
                childFullName: {
                  first: 'Second',
                  last: 'Child'
                }
              }
            ]
          },
          schema: {
            type: 'object',
            properties: {
              children: {
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
            children: {
              items: {
                'ui:title': createDisclosureTitle('childFullName', 'Net worth'),
                'ui:description': 'Bank accounts, investments, and property',
                netWorth: netWorthUI
              }
            }
          }
        },
        dependentsMonthlyIncome: {
          path: 'financial-disclosure/monthly-income/dependents/:index',
          title: item => `${item.childFullName.first} ${item.childFullName.last} monthly income`,
          showPagePerItem: true,
          arrayPath: 'children',
          itemFilter: (item) => !item.childNotInHousehold,
          initialData: {
          },
          schema: {
            type: 'object',
            properties: {
              children: {
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
            children: {
              items: {
                'ui:title': createDisclosureTitle('childFullName', 'Monthly income'),
                'ui:description': 'Social Security or other pensions',
                monthlyIncome: monthlyIncomeUI
              }
            }
          }
        },
        dependentsExpectedIncome: {
          path: 'financial-disclosure/expected-income/dependents/:index',
          title: item => `${item.childFullName.first} ${item.childFullName.last} expected income`,
          showPagePerItem: true,
          arrayPath: 'children',
          itemFilter: (item) => !item.childNotInHousehold,
          initialData: {
          },
          schema: {
            type: 'object',
            properties: {
              children: {
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
            children: {
              items: {
                'ui:title': createDisclosureTitle('childFullName', 'Expected income'),
                'ui:description': 'Any income you expect this dependent to receive in the next 12 months',
                expectedIncome: expectedIncomeUI
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
