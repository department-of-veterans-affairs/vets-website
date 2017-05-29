import _ from 'lodash/fp';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

// import ArrayPage from '../../common/schemaform/ArrayPage';
import applicantInformation from '../../common/schemaform/pages/applicantInformation';
import { transform } from '../helpers';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import createDisclosureTitle from '../components/DisclosureTitle';
import { netWorthSchema, netWorthUI } from '../definitions/netWorth';
import { monthlyIncomeSchema, monthlyIncomeUI } from '../definitions/monthlyIncome';
import { expectedIncomeSchema, expectedIncomeUI } from '../definitions/expectedIncome';

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
    }
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
    financialDisclosure: {
      title: 'Financial Disclosure',
      pages: {
        netWorth: {
          path: 'financial-disclosure/net-worth',
          title: 'Net worth',
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
          title: 'Monthly income',
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
          title: 'Expected income',
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
            'ui:description': 'Any income you expect to receive in the next 12 months',
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
        // dependentsNetWorth: {
        //   path: '/financial-disclosure/net-worth/dependents/household/:index',
        //   title: 'Net worth',
        //   arrayPath: 'childrenInHousehold',
        //   itemFilter: (item) => item.childNotInHousehold,
        //   component: ArrayPage,
        //   initialData: {
        //     childrenInHousehold: [{}]
        //   }
        // }
      }
    }
  }
};

export default formConfig;
