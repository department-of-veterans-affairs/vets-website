import _ from 'lodash/fp';
import moment from 'moment';
import { createSelector } from 'reselect';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import applicantInformation from '../../common/schemaform/pages/applicantInformation';
import { transform } from '../helpers';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import FullNameField from '../components/FullNameField';
import createDisclosureTitle from '../components/DisclosureTitle';
import { netWorthSchema, netWorthUI } from '../definitions/netWorth';
import { monthlyIncomeSchema, monthlyIncomeUI } from '../definitions/monthlyIncome';
import { expectedIncomeSchema, expectedIncomeUI } from '../definitions/expectedIncome';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import dateRangeUI from '../../common/schemaform/definitions/dateRange';

const {
  previousNames,
  combatSince911,
  placeOfSeparation
} = fullSchemaPensions.properties;

const {
  fullName,
  dateRange,
  date
} = fullSchemaPensions.definitions;

const formConfig = {
  urlPrefix: '/527EZ/',
  submitUrl: '/v0/pensions_applications',
  trackingPrefix: 'pensions',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Apply for pension',
  subTitle: 'Form 21-527EZ',
  defaultDefinitions: {
    additionalSources: {
      type: 'string'
    },
    fullName,
    date,
    dateRange
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
            veteranFullName: {
              first: 'Joe',
              last: 'Test'
            },
            spouseFullName: {
              first: 'Rick',
              last: 'Test'
            }
          },
          schema: {
            type: 'object',
            required: ['netWorth'],
            properties: {
              netWorth: netWorthSchema(fullSchemaPensions)
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
              monthlyIncome: monthlyIncomeSchema(fullSchemaPensions)
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
              expectedIncome: expectedIncomeSchema(fullSchemaPensions)
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
          // TODO: Update with spouse check
          depends: () => true,
          initialData: {
          },
          schema: {
            type: 'object',
            properties: {
              spouseNetWorth: netWorthSchema(fullSchemaPensions)
            }
          },
          uiSchema: {
            'ui:title': createDisclosureTitle('spouseFullName', 'Net worth'),
            'ui:description': 'Bank accounts, investments, and property',
            spouseNetWorth: _.merge(netWorthUI, {
              // TODO Update with spouse check
              bank: {
                'ui:required': () => true
              },
              interestBank: {
                'ui:required': () => true
              },
              ira: {
                'ui:required': () => true
              },
              stocks: {
                'ui:required': () => true
              },
              realProperty: {
                'ui:required': () => true
              },
              otherProperty: {
                'ui:required': () => true
              }
            })
          }
        },
        spouseMonthlyIncome: {
          path: 'financial-disclosure/monthly-income/spouse',
          title: 'Spouse monthly income',
          depends: () => true,
          initialData: {
          },
          schema: {
            type: 'object',
            properties: {
              spouseMonthlyIncome: monthlyIncomeSchema(fullSchemaPensions)
            }
          },
          uiSchema: {
            'ui:title': createDisclosureTitle('spouseFullName', 'Monthly income'),
            'ui:description': 'Social Security or other pensions',
            spouseMonthlyIncome: _.merge(monthlyIncomeUI, {
              // TODO Update with spouse check
              socialSecurity: {
                'ui:required': () => true
              },
              civilService: {
                'ui:required': () => true
              },
              railroad: {
                'ui:required': () => true
              },
              blackLung: {
                'ui:required': () => true
              },
              serviceRetirement: {
                'ui:required': () => true
              },
              ssi: {
                'ui:required': () => true
              }
            })
          }
        },
        spouseExpectedIncome: {
          path: 'financial-disclosure/expected-income/spouse',
          title: 'Spouse expected income',
          depends: () => true,
          initialData: {
          },
          schema: {
            type: 'object',
            properties: {
              spouseExpectedIncome: expectedIncomeSchema(fullSchemaPensions)
            }
          },
          uiSchema: {
            'ui:title': createDisclosureTitle('spouseFullName', 'Expected income'),
            'ui:description': 'Any income you expect your spouse to receive in the next 12 months',
            spouseExpectedIncome: _.merge(expectedIncomeUI, {
              salary: {
                'ui:required': () => true
              },
              interest: {
                'ui:required': () => true
              },
              other: {
                'ui:required': () => true
              }
            })
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
                    netWorth: netWorthSchema(fullSchemaPensions)
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
                    monthlyIncome: monthlyIncomeSchema(fullSchemaPensions)
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
                    expectedIncome: expectedIncomeSchema(fullSchemaPensions)
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
