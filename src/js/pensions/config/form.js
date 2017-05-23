// import _ from 'lodash/fp';

// import fullSchemaPensions from 'vets-json-schema/dist/21-527-schema.json';

import ArrayPage from '../../common/schemaform/ArrayPage';
import { transform } from '../helpers';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

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
  },
  chapters: {
    financialDisclosure: {
      title: 'Financial Disclosure',
      pages: {
        netWorth: {
          path: '/financial-disclosure/net-worth',
          title: 'Net worth',
          initialData: {
          }
        },
        spouseNetWorth: {
          path: '/financial-disclosure/net-worth/spouse',
          title: 'Net worth',
          initialData: {
          }
        },
        householdDependentsNetWorth: {
          path: '/financial-disclosure/net-worth/dependents/household/:index',
          title: 'Net worth',
          arrayPath: 'childrenInHousehold',
          component: ArrayPage,
          initialData: {
            childrenInHousehold: [{}]
          }
        },
        nonHouseholdDependentsNetWorth: {
          path: '/financial-disclosure/net-worth/dependents/:index',
          title: 'Net worth',
          arrayPath: 'childrenNotInHousehold',
          component: ArrayPage,
          initialData: {
            childrenNotInHousehold: [{}]
          }
        }
      }
    }
  }
};

export default formConfig;
