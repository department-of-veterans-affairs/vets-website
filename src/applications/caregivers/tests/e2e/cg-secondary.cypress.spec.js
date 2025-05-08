import path from 'path';
import testForm from '@department-of-veterans-affairs/platform-testing/form-tester';
import { createTestConfig } from '@department-of-veterans-affairs/platform-testing/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { pageHooks, setupBasicTest } from './utils';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: [
      'oneSecondaryCaregiver',
      'twoSecondaryCaregivers',
      'secondaryOneOnly',
    ],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },
    setupPerTest: () => setupBasicTest(),
    pageHooks,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
