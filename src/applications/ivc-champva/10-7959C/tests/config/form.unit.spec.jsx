import { testNumberOfWebComponentFields } from '../../../shared/tests/pages/pageTests.spec';

import formConfig from '../../config/form';
import mockData from '../fixtures/data/test-data.json';

testNumberOfWebComponentFields(
  formConfig,
  formConfig.chapters.signerInformation.pages.signerClass.schema,
  formConfig.chapters.signerInformation.pages.signerClass.uiSchema,
  1,
  'Signer information',
  { ...mockData.data },
);
